import { Injectable } from "@nestjs/common";
import LoginDto from "@/modules/auth/dto/login.dto";
import { PrismaService } from "@/common/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { user } from "@prisma/client";
import { hash, verify } from "argon2";
import UpdateUserDto from "./dto/updateUser.dto";
import { httpError } from "@/utils/http.util";
import { CommonService } from "@/common/services/common.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly common: CommonService,
  ) {}

  // 生成token
  async createToken(data: user) {
    return {
      access_token: await this.jwt.signAsync({
        name: data.userName,
        id: data.id,
      }),
    };
  }

  // 登录
  async login(body: LoginDto) {
    // 获取用户信息
    const result = await this.prisma.user.findUnique({
      where: {
        userName: body.userName,
      },
    });
    if (!(await verify(result.password, body.password))) {
      httpError("密码错误");
    } else {
      if (result.id === 1) {
        // 超管直接进入
        return await this.createToken(result);
      } else {
        // 判断用户是否被禁用
        if (!result.status) {
          httpError("当前用户被禁用,请联系管理员");
        }
        // 获取用户的角色
        const userRole = await this.prisma.role.findMany({
          where: { roleId: result.role },
        });
        if (!userRole.length) {
          httpError("当前用户没有角色,请联系管理员");
        }
        if (userRole.length && !userRole[0].status) {
          httpError("当前用户绑定角色被禁用,请联系管理员");
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
      httpError("旧密码错误");
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
}
