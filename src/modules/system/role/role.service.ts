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
import { I18nService } from "nestjs-i18n";

@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    private readonly auth: AuthService,
    private readonly i18n: I18nService,
  ) {}

  // 创建
  async create(createRoleDto: CreateRoleDto, user: JwtUserType) {
    const reslot = await this.prisma.role.create({
      data: {
        ...createRoleDto,
        status: createRoleDto.status || 1,
        roleId: "",
        cUserId: user.userId,
        mUserId: null,
      },
    });
    const upDateRole = await this.update(
      reslot.id,
      {
        ...reslot,
        roleId: `R${reslot.id}`,
      },
      user,
    );
    return upDateRole;
  }

  // 获取用户权限 菜单|文档
  async findAuth(user: JwtUserType) {
    const menus = await this.auth.getUserMenu({
      name: user.name,
      id: user.id,
    });

    const docs = await this.auth.getUserDoc(
      {
        name: user.name,
        id: user.id,
      },
      { name: null },
    );

    return {
      menuList: menus.dataList,
      docList: docs.dataList,
    };
  }

  // 列表
  async findAll(query: PageQueryType, cUserId: string) {
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
    return handlePageData<role>("role", where, query);
  }

  async findOne(id: number) {
    const reslot = await this.prisma.role.findUnique({
      where: { id },
    });
    return reslot;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto, user: JwtUserType) {
    const reslot = await this.prisma.role.update({
      where: { id },
      data: {
        ...removeObjKeys(updateRoleDto, ["cTime"]),
        mTime: new Date(),
        mUserId: user.userId,
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
      httpError(this.i18n.t("messages.hasRoleByUserDelete"));
    }
    const reslot = await this.prisma.role.delete({
      where: { id },
    });
    return reslot;
  }
}
