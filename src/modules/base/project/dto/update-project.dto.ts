import { OmitType } from "@nestjs/mapped-types";
import { CreateProjectDto } from "./create-project.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateProjectDto extends OmitType(CreateProjectDto, [
  "projectName",
]) {
  @IsNotEmpty({ message: "项目id不能为空" })
  projectId: string;
  @IsNotEmpty({ message: "项目名称不能为空" })
  projectName: string;
  id: number;
}
