import { IsNotExistsRule } from "@/common/rules/IsNotExists.rule";
import { IsNotEmpty } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty({ message: "角色名称不能为空" })
  @IsNotExistsRule("role", {
    message: "角色名称已存在",
  })
  roleName: string;
  @IsNotEmpty({ message: "菜单不能为空" })
  menuId: string;
  remark: string;
  status: number;
  orderNum: number;
}
