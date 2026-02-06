import { OmitType } from "@nestjs/mapped-types";
import { CreateDirectoryDto } from "./create-directory.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateDirectoryDto extends OmitType(CreateDirectoryDto, [
  "directoryName",
]) {
  @IsNotEmpty({ message: "项目id不能为空" })
  directoryId: string;
  id: number;
}
