import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "@/common/prisma/prisma.service";
import { PageQueryType } from "./types";
import {
  httpError,
  queryLike,
  removeObjKeys,
  whereCuserByStatus,
} from "@/utils/http.util";
import { formatDate } from "@/utils/dayjs.util";
import { hash } from "argon2";
import { onPickKeys } from "@/utils/index.util";
import { JwtUserType } from "@/common/shared/user.model";
import { handlePageData } from "@/utils/http.util";
import { user } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, user: JwtUserType) {
    // 删除密码确认
    const reslot = await this.prisma.user.create({
      data: {
        ...removeObjKeys(createUserDto, ["passwordConfirm"]),
        status: createUserDto.status || 1,
        gender: createUserDto.gender || 0,
        password: await hash(createUserDto.password),
        userId: "",
        cUserId: user.id,
        cUserName: user.name,
      },
    });
    const upDateUser = await this.update(
      reslot.id,
      {
        ...reslot,
        userId: `W${reslot.id}`,
      },
      reslot.password,
    );
    return upDateUser;
  }

  async findAll(query: PageQueryType, cUserId: number) {
    // 获取全部角色组
    const roles = await this.prisma.role.findMany();
    const likes = queryLike(query, ["userName", "nickName", "role"]);
    const where = {
      ...likes,
      ...whereCuserByStatus(
        { ...query, cUserId },
        {
          status: ["status"],
          cUserId: "cUserId",
        },
      ),
    };
    return handlePageData<user>("user", where, query, data => {
      data = data.map(x => ({
        ...x,
        createTime: formatDate({
          type: "YYYY-MM-DD HH:mm:ss",
          value: x.createTime,
        }),
        roleName:
          x.role === "admin"
            ? "超级管理员"
            : roles.find(y => y.roleId === x.role)?.roleName,
      }));
      return onPickKeys(data, ["password"]);
    });
  }

  findOne(id: number) {
    const reslot = this.prisma.user.findUnique({
      where: { id },
    });
    return reslot;
  }

  async update(id: number, updateUserDto: UpdateUserDto, password?: string) {
    // 先获取用户信息 取里面的密码
    const user = password
      ? { ...updateUserDto, password }
      : await this.prisma.user.findUnique({
          where: { id },
        });
    if (user.userName !== updateUserDto.userName) {
      httpError("用户名错误");
    }
    if (
      +user.id === 1 &&
      (updateUserDto.role !== "admin" || !updateUserDto.status)
    ) {
      httpError("超级管理员不允许修改权限");
    }

    const reslot = await this.prisma.user.update({
      where: { id },
      data: {
        ...removeObjKeys(updateUserDto, ["createTime", "roleName"]),
        password: user.password,
      },
    });
    return reslot;
  }

  async remove(id: number) {
    if (id === 1) {
      httpError("超级管理员不允许删除");
    }
    const reslot = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return reslot;
  }
}
