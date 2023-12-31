import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import GetFileDto from "../common/dto/getFile.dto";
import { CreateFileDto } from "./dto/create-file";
import { DeleteFileDto } from "./dto/delete-file";
import { AuthUser } from "@/common/decorator/user.decorator";
import { JwtUserType } from "@/common/shared/user.model";

@Controller("upload")
export class UploadController {
  constructor(private readonly upload: UploadService) {}

  //上传图片
  @Post("image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @Body() body: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: JwtUserType,
  ) {
    return await this.upload.uploadImage(body, file, user);
  }

  // 获取图片
  @Get("/get")
  async getFile(@Query() query: GetFileDto) {
    return await this.upload.getImage(query);
  }

  @Delete("/delete")
  async deleteFile(@Query() query: DeleteFileDto) {
    return await this.upload.deleteFile(query);
  }
}
