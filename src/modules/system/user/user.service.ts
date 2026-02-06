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
import { hash } from "argon2";
import { onPickKeys } from "@/utils/index.util";
import { JwtUserType } from "@/common/shared/user.model";
import { handlePageData } from "@/utils/http.util";
import { user } from "@prisma/client";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserDto: CreateUserDto, user: JwtUserType) {
    const reslot = await this.prisma.user.create({
      data: {
        // 删除密码确认
        ...removeObjKeys(createUserDto, ["passwordConfirm"]),
        status: createUserDto.status || 1,
        gender: createUserDto.gender || 0,
        password: await hash(createUserDto.password),
        userId: "",
        cUserId: user.userId,
        mUserId: null,
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

  async findAll(query: PageQueryType, cUserId: string) {
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
        roleName:
          x.role === "admin"
            ? this.i18n.t("messages.superAdministrator")
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
      httpError(this.i18n.t("messages.userNameError"));
    }
    if (
      +user.id === 1 &&
      (updateUserDto.role !== "admin" || !updateUserDto.status)
    ) {
      httpError(this.i18n.t("messages.adminRole"));
    }

    const reslot = await this.prisma.user.update({
      where: { id },
      data: {
        ...removeObjKeys(updateUserDto, ["createTime", "roleName"]),
        password: user.password,
        mTime: new Date(),
      },
    });
    return reslot;
  }

  async remove(id: number) {
    if (id === 1) {
      httpError(this.i18n.t("messages.adminDelete"));
    }
    const reslot = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return reslot;
  }
}
