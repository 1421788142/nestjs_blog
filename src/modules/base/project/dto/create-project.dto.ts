import { IsNotExistsRule } from "@/common/rules/IsNotExists.rule";
import { IsNotEmpty } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty({ message: "项目名称不能为空" })
  @IsNotExistsRule("project", {
    message: "项目名称已存在",
  })
  projectName: string;
  remark: string;
  status: number;
  orderNum: number;
}
