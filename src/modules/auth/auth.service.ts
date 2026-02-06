import { Injectable } from "@nestjs/common";
import LoginDto from "@/modules/auth/dto/login.dto";
import { PrismaService } from "@/common/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { user } from "@prisma/client";
import { hash, verify } from "argon2";
import UpdateUserDto from "./dto/updateUser.dto";
import { httpError } from "@/utils/http.util";
import { CommonService } from "@/common/services/common.service";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly common: CommonService,
    private readonly i18n: I18nService,
  ) {}

  // 生成token
  async createToken(data: user) {
    return {
      access_token: await this.jwt.signAsync({
        name: data.userName,
        id: data.id,
        userId: data.userId,
      }),
    };
  }

  // 登录
  async login(req: any, body: LoginDto) {
    // 获取用户信息
    const result = await this.prisma.user.findUnique({
      where: {
        userName: body.userName,
      },
    });
    if (!(await verify(result.password, body.password))) {
      httpError(this.i18n.t("messages.passwordError"));
    } else {
      if (result.id === 1) {
        // 超管直接进入
        return await this.createToken(result);
      } else {
        // 判断用户是否被禁用
        if (!result.status) {
          httpError(this.i18n.t("messages.userDisable"));
        }
        // 获取用户的角色
        const userRole = await this.prisma.role.findMany({
          where: { roleId: result.role },
        });
        if (!userRole.length) {
          httpError(this.i18n.t("messages.userNotRole"));
        }
        if (userRole.length && !userRole[0].status) {
          httpError(this.i18n.t("messages.userRoleDisable"));
        } else {
          return await this.createToken(result);
        }
      }
    }
  }

  // 获取用户信息
  // @Public
  async userInfo(user: { name: string; id: number }) {
    const result = await this.prisma.user.findUnique({
      where: { userName: user.name },
    });
    // 获取用户头像
    const avatar = await this.common.getFile({
      fileIds: result.avatar,
      fileType: "image",
    });
    delete result["password"];
    return {
      ...result,
      avatar: avatar[0]?.filePath || "",
    };
  }

  // 更新用户
  async updateUser(body: UpdateUserDto) {
    const result = await this.prisma.user.findUnique({
      where: {
        userName: body.userName,
      },
    });
    if (!(await verify(result.password, body.password))) {
      httpError(this.i18n.t("messages.oldPasswordError"));
    } else {
      delete body["passwordConfirm"];
      const res = await this.prisma.user.update({
        where: {
          id: result.id,
        },
        data: {
          ...result,
          password: await hash(body.newPassword),
        },
      });
      return res;
    }
  }

  // 获取用户菜单
  async getUserMenu(user: { name: string; id: number }) {
    let result = [];
    try {
      // 获取用户查看是否为超管
      const userInfo = await this.userInfo(user);
      if (userInfo.role === "admin") {
        //超管取出所有菜单
        result = await this.prisma.menu.findMany();
      } else {
        result = await this.getUserPermission(userInfo.role);
      }
    } finally {
      return {
        dataList: result,
      };
    }
  }
  // 查询用户权限
  async getUserPermission(roleId: string) {
    const result = await this.prisma.role.findMany({
      where: {
        roleId,
      },
    });
    const menus = await this.prisma.menu.findMany();
    // 取出所有菜单id
    const menuIds = result[0].menuId.split(",").map(Number);
    // 过滤出用户拥有的菜单
    const userMenus = menus.filter(x => menuIds.includes(x.id));
    // 取出所有父菜单
    const pIds = [...new Set(userMenus.map(x => x.pId).filter(x => x))];
    //合并父菜单
    return menus.filter(x =>
      [...new Set([...pIds, ...menuIds])].includes(x.id),
    );
  }

  // 获取用户文档
  async getUserDoc(
    user: { name: string; id: number },
    query: { name: string },
  ) {
    let result = [];
    try {
      let docWhere = {};
      if (query.name) {
        docWhere = {
          directoryName: {
            contains: query.name || "",
          },
          type: "file",
        };
      }
      // 获取用户查看是否为超管
      const userInfo = await this.userInfo(user);
      if (userInfo.role === "admin") {
        //超管取出项目+文档

        result = [
          ...(
            await this.prisma.project.findMany({
              select: {
                projectId: true,
                projectName: true,
              },
            })
          ).map(x => ({
            directoryName: x.projectName,
            id: x.projectId,
            directoryId: x.projectId,
            projectId: x.projectId,
            type: "project",
            icon: "",
            pId: 0,
          })),
          ...(
            await this.prisma.directory.findMany({
              select: {
                id: true,
                directoryName: true,
                directoryId: true,
                projectId: true,
                pId: true,
                icon: true,
              },
              where: docWhere,
            })
          ).map(x => ({
            ...x,
            pId: Number(x.pId) === 0 ? x.projectId : x.pId,
            type: "directory",
          })),
        ];
      } else {
        result = await this.getUserDocs(userInfo.role, docWhere);
      }
    } finally {
      return {
        dataList: result,
      };
    }
  }

  async getUserDocs(roleId: string, docWhere: any = {}) {
    const result = await this.prisma.role.findMany({
      where: {
        roleId,
      },
    });
    const directory = await this.prisma.directory.findMany({
      select: {
        id: true,
        directoryName: true,
        projectId: true,
        pId: true,
        icon: true,
      },
      where: docWhere,
    });
    const project = await this.prisma.project.findMany({
      select: {
        projectId: true,
        projectName: true,
      },
    });
    // 取出所有文档id
    const docIds = result[0].extend.split(",");
    // 过滤出用户拥有的文档
    const userDocs = [
      ...directory
        .filter(x => docIds.includes(String(x.id)))
        .map(m => {
          return {
            ...m,
            pId: Number(m.pId) === 0 ? m.projectId : m.pId,
            type: "directory",
          };
        }),
      ...project
        .filter(x => docIds.includes(String(x.projectId)))
        .map(m => ({
          ...m,
          pId: null,
          id: m.projectId,
          directoryId: m.projectId,
          directoryName: m.projectName,
          icon: "",
          type: "project",
        })),
    ];

    // // 取出所有父文档
    const pIds = [...new Set(userDocs.map(x => x.pId).filter(x => x))];
    //合并父文档
    return userDocs.filter(x =>
      [...new Set([...pIds, ...docIds])].includes(String(x.id)),
    );
  }
}
