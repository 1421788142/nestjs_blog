import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { PrismaService } from "@/common/prisma/prisma.service";
import { PageQueryType } from "./types";
import { httpError } from "@/utils/http.util";

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}
  async create(createMenuDto: CreateMenuDto) {
    const reslot = this.prisma.menu.create({
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
      },
    });
    return reslot;
  }

  async findAll(query: PageQueryType) {
    let whereStatusCondition = {}; //状态查询
    if (query.status !== "-1") {
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
    return result;
  }

  async findOne(id: number) {
    const reslot = await this.prisma.menu.findUnique({
      where: {
        id,
      },
    });
    return reslot;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const reslot = await this.prisma.menu.update({
      where: {
        id,
      },
      data: updateMenuDto,
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
      httpError("菜单下有子菜单,不可删除");
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
