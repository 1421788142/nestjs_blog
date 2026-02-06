import { OmitType } from "@nestjs/mapped-types";
import { CreateRoleDto } from "./create-role.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateRoleDto extends OmitType(CreateRoleDto, ["roleName"]) {
  @IsNotEmpty({ message: "角色id不能为空" })
  roleId: string;
  @IsNotEmpty({ message: "角色名称不能为空" })
  roleName: string;
  id: number;
}
