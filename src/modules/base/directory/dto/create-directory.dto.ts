import { IsNotExistsRule } from "@/common/rules/IsNotExists.rule";
import { IsIn, IsNotEmpty, Min } from "class-validator";

export class CreateDirectoryDto {
  @IsNotEmpty({ message: "目录名称不能为空" })
  directoryName: string;
  remark: string;
  status: number;
  orderNum: number;
  projectId: string;
  @Min(0)
  pId: number;
  @Min(0)
  level: number;
  @IsIn(["folder", "file"]) //参数值只能是数组中的其中一位成员
  type: string;
  icon: string;
  extend?: string;
  extend1?: string;
  extend2?: string;
  extend3?: string;
}
