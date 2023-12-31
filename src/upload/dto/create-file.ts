import { IsNotEmpty } from "class-validator";

export class CreateFileDto {
  @IsNotEmpty({ message: "文件类型不能为空" })
  fileType: string;
  @IsNotEmpty({ message: "文件标识不能为空" })
  keywords: string;
}
