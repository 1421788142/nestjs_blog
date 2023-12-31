import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { CommonService } from "@/common/services/common.service";

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory() {
        return {
          storage: diskStorage({
            // 文件保存路径
            destination: (req, file, cb) => {
              const fileDir = file.mimetype.includes("image")
                ? "images"
                : "videos";
              // 上传文件的目录 保证项目根目录中public/uploads文件夹存在
              cb(null, join(__dirname, "../../..", `public/upload/${fileDir}`));
            },
            // 文件名称的定制
            filename: (req, file, cb) => {
              const path =
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e10) +
                extname(file.originalname);
              cb(null, path);
            },
          }),
        };
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, CommonService],
})
export class UploadModule {}
