import { Injectable } from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
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
import { project } from "@prisma/client";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  // 创建
  async create(createProjectDto: CreateProjectDto, user: JwtUserType) {
    const reslot = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        status: createProjectDto.status || 1,
        projectId: "",
        cUserId: user.userId,
        mUserId: null,
      },
    });
    const upDateProject = await this.update(
      reslot.id,
      {
        ...reslot,
        projectId: `P${reslot.id}`,
      },
      user,
    );
    return upDateProject;
  }

  // 列表
  async findAll(query: PageQueryType, cUserId: string) {
    const likes = queryLike(query, ["projectName"]);
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
    return handlePageData<project>("project", where, query);
  }

  async findOne(id: string) {
    const reslot = await this.prisma.project.findUnique({
      where: { projectId: id, id: +id.replace("P", "") },
    });
    return reslot;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    user: JwtUserType,
  ) {
    const reslot = await this.prisma.project.update({
      where: { id },
      data: {
        ...removeObjKeys(updateProjectDto, ["createTime"]),
        mTime: new Date(),
        mUserId: user.userId,
      },
    });
    return reslot;
  }

  async remove(id: number) {
    const project = await this.findOne(`P${id}`);
    const hasDirectory = await this.prisma.directory.findMany({
      where: {
        projectId: project.projectId,
      },
    });
    if (hasDirectory.length) {
      httpError(this.i18n.t("messages.hasDirectoryFileChildrenDelete"));
    }
    const reslot = await this.prisma.project.delete({
      where: { id },
    });
    return reslot;
  }
}
