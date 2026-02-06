import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { PrismaService } from "@/common/prisma/prisma.service";
import { PageQueryType } from "./types";
import { httpError } from "@/utils/http.util";
import { JwtUserType } from "@/common/shared/user.model";
import { formatDate } from "@/utils/dayjs.util";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}
  async create(createMenuDto: CreateMenuDto, user: JwtUserType) {
    const result = this.prisma.menu.create({
      data: {
        title: createMenuDto.title,
        component: createMenuDto.component || "",
        path: createMenuDto.path || "",
        menuType: createMenuDto.menuType,
        pId: createMenuDto.pId,
        icon: createMenuDto.icon || "",
        perms: createMenuDto.perms || "",
        orderNum: createMenuDto.orderNum || 50,
        isFrame: createMenuDto.isFrame || 0,
        status: createMenuDto.status || 1,
        keepAlive: createMenuDto.keepAlive || 1,
        hidden: createMenuDto.hidden || 0,
        mUserId: null,
        cUserId: user.userId,
        extend: createMenuDto.extend || null,
        extend1: createMenuDto.extend1 || null,
      },
    });
    return result;
  }

  async findAll(query: PageQueryType) {
    let whereStatusCondition = {}; //状态查询
    if (query?.status && query?.status !== "-1") {
      whereStatusCondition = {
        status: +query.status,
      };
    }
    const where = {
      title: {
        contains: query.title || "",
      },
      ...whereStatusCondition,
    };

    const result = await this.prisma.menu.findMany({
      where: where,
    });

    // 提取所有的 cUserId 和 mUserId 并去重
    const cUserIds = Array.from(
      new Set(result.map(x => x.cUserId).filter(Boolean)),
    );
    const mUserIds = Array.from(
      new Set(result.map(x => x.mUserId).filter(Boolean)),
    );

    // 查询 cUserName 和 mUserName
    const userMap = new Map<string, string>();
    if (cUserIds.length || mUserIds.length) {
      const users = await this.prisma.user.findMany({
        where: {
          userId: {
            in: [...cUserIds, ...mUserIds] as string[], // 查询 cUserId 和 mUserId 对应的用户
          },
        },
        select: {
          userId: true,
          userName: true,
        },
      });
      users.forEach(user => userMap.set(user.userId, user.userName));
    }

    return result.map(x => {
      let commonObj = {};
      if (x?.cUserId) {
        commonObj["cUserName"] = userMap.get(x.cUserId);
      }
      if (x?.mUserId) {
        commonObj["mUserName"] = userMap.get(x.mUserId);
      }
      if (x?.cTime) {
        commonObj["cTime"] = formatDate({
          type: "YYYY-MM-DD HH:mm:ss",
          value: x.cTime,
        });
      }
      if (x?.mTime) {
        commonObj["mTime"] = formatDate({
          type: "YYYY-MM-DD HH:mm:ss",
          value: x.mTime,
        });
      }
      return {
        ...x,
        ...commonObj,
      };
    });
  }

  async findOne(id: number) {
    const revolt = await this.prisma.menu.findUnique({
      where: {
        id,
      },
    });
    return revolt;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto, user: JwtUserType) {
    const reslot = await this.prisma.menu.update({
      where: {
        id,
      },
      data: {
        ...updateMenuDto,
        mTime: new Date(),
        mUserId: user.userId,
      },
    });
    return reslot;
  }

  async remove(id: number) {
    const childrenMenu = await this.prisma.menu.findMany({
      where: {
        pId: id,
      },
    });
    if (childrenMenu && childrenMenu.length > 0) {
      httpError(this.i18n.t("messages.hasMenuChildrenDelete"));
    } else {
      const reslot = await this.prisma.menu.delete({
        where: {
          id,
        },
      });
      return reslot;
    }
  }
}
