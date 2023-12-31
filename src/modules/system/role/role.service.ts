import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import {
  handlePageData,
  httpError,
  queryLike,
  removeObjKeys,
  whereCuserByStatus,
} from "@/utils/http.util";
import { PageQueryType } from "./types";
import { PrismaService } from "@/common/prisma/prisma.service";
import { JwtUserType } from "@/common/shared/user.model";
import { AuthService } from "@/modules/auth/auth.service";
import { role } from "@prisma/client";
import { formatDate } from "@/utils/dayjs.util";

@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  // 创建
  async create(createRoleDto: CreateRoleDto, user: JwtUserType) {
    const reslot = await this.prisma.role.create({
      data: {
        ...createRoleDto,
        status: createRoleDto.status || 1,
        roleId: "",
        cUserId: user.id,
        cUserName: user.name,
      },
    });
    const upDateRole = await this.update(reslot.id, {
      ...reslot,
      roleId: `R${reslot.id}`,
    });
    return upDateRole;
  }

  // 查询菜单权限
  async findMenus(user: JwtUserType) {
    const menus = await this.auth.getUserMenu({
      name: user.name,
      id: user.id,
    });
    return menus;
  }

  // 列表
  async findAll(query: PageQueryType, cUserId: number) {
    const likes = queryLike(query, ["roleName"]);
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
    return handlePageData<role>("role", where, query, data => {
      return data.map(x => ({
        ...x,
        createTime: formatDate({
          type: "YYYY-MM-DD HH:mm:ss",
          value: x.createTime,
        }),
      }));
    });
  }

  async findOne(id: number) {
    const reslot = await this.prisma.role.findUnique({
      where: { id },
    });
    return reslot;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const reslot = await this.prisma.role.update({
      where: { id },
      data: {
        ...removeObjKeys(updateRoleDto, ["createTime"]),
      },
    });
    return reslot;
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    const hasUserRole = await this.prisma.user.findMany({
      where: {
        role: role.roleId,
      },
    });
    if (hasUserRole.length) {
      httpError("该角色下存在用户无法删除");
    }
    const reslot = await this.prisma.role.delete({
      where: { id },
    });
    return reslot;
  }
}
