import { IsNotExistsRule } from "@/common/rules/IsNotExists.rule";
import { IsNotEmpty } from "class-validator";

export class CreateMenuDto {
  @IsNotEmpty({ message: "菜单类型不能为空" })
  menuType: string;
  @IsNotEmpty({ message: "父级菜单不能为空" })
  pId: number;
  @IsNotEmpty({ message: "菜单名称不能为空" })
  title: string;
  icon: string;
  orderNum: number;
  component: string;
  @IsNotExistsRule("menu", { message: "该菜单路径已存在,不可重复添加" })
  path: string;
  isFrame: number;
  hidden: number;
  keepAlive: number;
  status: number;
  perms: string;
}
