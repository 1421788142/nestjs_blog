import { Injectable } from "@nestjs/common";
import { CreateDirectoryDto } from "./dto/create-directory.dto";
import { UpdateDirectoryDto } from "./dto/update-directory.dto";
import {
  httpError,
  queryLike,
  removeObjKeys,
  whereCuserByStatus,
} from "@/utils/http.util";
import { PageQueryType } from "./types";
import { PrismaService } from "@/common/prisma/prisma.service";
import { JwtUserType } from "@/common/shared/user.model";
import { user, project } from "@prisma/client";
import { formatDate } from "@/utils/dayjs.util";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class DirectoryService {
  constructor(
    private prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  // 创建
  async create(createDirectoryDto: CreateDirectoryDto, user: JwtUserType) {
    const reslot = await this.prisma.directory.create({
      data: {
        ...createDirectoryDto,
        status: createDirectoryDto.status || 1,
        directoryId: "",
        cUserId: user.userId,
        mUserId: null,
      },
    });
    const upDateDirectory = await this.update(
      reslot.id,
      {
        ...reslot,
        directoryId: `D${reslot.id}`,
      },
      user,
    );
    return upDateDirectory;
  }

  // 列表
  async findAll(query: PageQueryType, cUserId: string) {
    const likes = queryLike(query, ["directoryName"]);
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
    const result = await this.prisma.directory.findMany({
      where: where,
      select: {
        id: true,
        directoryName: true,
        directoryId: true,
        orderNum: true,
        projectId: true,
        pId: true,
        status: true,
        level: true,
        type: true,
        icon: true,
        remark: true,
        cUserId: true,
        cTime: true,
        mUserId: true,
        mTime: true,
        extend: false,
        extend1: true,
        extend2: true,
        extend3: true,
      },
    });

    // 提取所有的 cUserId 和 mUserId 并去重
    const cUserIds = Array.from(
      new Set(result.map(x => x.cUserId).filter(Boolean)),
    );
    const mUserIds = Array.from(
      new Set(result.map(x => x.mUserId).filter(Boolean)),
    );
    const projectIds = Array.from(
      new Set(result.map(x => x.projectId).filter(Boolean)),
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
      users.forEach((item: user) => userMap.set(item.userId, item.userName));
    }

    // 查询项目
    const projectMap = new Map<string, string>();
    if (projectIds.length) {
      const projects = await this.prisma.project.findMany({
        where: {
          projectId: {
            in: projectIds, // 查询 cUserId 和 mUserId 对应的用户
          },
        },
        select: {
          projectId: true,
          projectName: true,
        },
      });
      projects.forEach((item: project) =>
        projectMap.set(item.projectId, item.projectName),
      );
    }

    return result.map(x => {
      let commonObj = {};
      if (x?.cUserId) {
        commonObj["cUserName"] = userMap.get(x.cUserId);
      }
      if (x?.mUserId) {
        commonObj["mUserName"] = userMap.get(x.mUserId);
      }
      if (x?.projectId) {
        commonObj["projectName"] = projectMap.get(x.projectId);
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
    const reslot = await this.prisma.directory.findUnique({
      where: { id },
    });
    return reslot;
  }

  async update(
    id: number,
    updateDirectoryDto: UpdateDirectoryDto,
    user: JwtUserType,
  ) {
    const reslot = await this.prisma.directory.update({
      where: { id },
      data: {
        ...removeObjKeys(updateDirectoryDto, ["createTime"]),
        mTime: new Date(),
        mUserId: user.userId,
      },
    });
    return reslot;
  }

  async remove(id: number) {
    const directory = await this.findOne(id);
    const hasDirectory = await this.prisma.directory.findMany({
      where: {
        pId: directory.id,
      },
    });
    if (hasDirectory.length) {
      httpError(this.i18n.t("messages.hasDirectoryChildrenDelete"));
    }
    const reslot = await this.prisma.directory.delete({
      where: { id },
    });
    return reslot;
  }
}
