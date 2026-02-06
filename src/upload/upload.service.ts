import GetFileDto from "@/common/dto/getFile.dto";
import { PrismaService } from "@/common/prisma/prisma.service";
import { CommonService } from "@/common/services/common.service";
import { Injectable } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file";
import { JwtUserType } from "@/common/shared/user.model";
import { parse, join } from "path";
import { unlink } from "fs";
import { promisify } from "util";
import { DeleteFileDto } from "./dto/delete-file";
import { httpError } from "@/utils/http.util";
import { I18nService } from "nestjs-i18n";

const unlinkAsync = promisify(unlink);

@Injectable()
export class UploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly common: CommonService,
  ) {}
  // 获取图片
  async getImage(query: GetFileDto) {
    let reslot = await this.common.getFile(query);
    return reslot;
  }
  // 上传图片
  async uploadImage(
    body: CreateFileDto,
    file: Express.Multer.File,
    user: JwtUserType,
  ) {
    // 获取文件名
    const { base } = parse(file.path);

    const reslot = await this.prisma.uploadFile.create({
      data: {
        ...body,
        fileName: file.originalname,
        fileSize: file.size,
        filePath: `/upload/images/${base}`,
        cUserId: user.userId,
        fileId: "",
      },
    });
    const update = await this.prisma.uploadFile.update({
      where: { id: reslot.id },
      data: {
        ...reslot,
        fileId: `F${reslot.id}`,
      },
    });
    return update;
  }

  async deleteFilesInPublic(fileUrls: Array<string>) {
    try {
      // 删除每个文件
      await Promise.all(fileUrls.map(file => unlinkAsync(file)));
    } catch {
      httpError(this.i18n.t("messages.deleteError"));
    }
  }

  // 删除图片
  async deleteFile(query: DeleteFileDto) {
    const delFilePath = join(__dirname, "../../..", "public/");
    try {
      const reslot = await this.getImage(query);
      const fileUrls = reslot.map(res => {
        const [, , path] = res.filePath.match(/\/\/localhost:(\d+)\/(.+)/);
        return `${delFilePath}${path}`;
      });
      await this.deleteFilesInPublic(fileUrls);
      let delRes = await this.prisma.uploadFile.deleteMany({
        where: {
          fileId: {
            in: query.fileIds.split(","),
          },
          fileType: query.fileType,
        },
      });
      return this.i18n.t("messages.deleteErrorCount", {
        args: { count: delRes.count },
      });
    } catch {
      httpError(this.i18n.t("messages.deleteError"));
    }
  }
}
