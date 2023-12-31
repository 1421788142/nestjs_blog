import { IsNotEmpty } from "class-validator";

export default class GetFileDto {
  @IsNotEmpty({ message: "文件id不能为空" })
  fileIds: string;
  @IsNotEmpty({ message: "文件类型不能为空" })
  fileType: string;
}
