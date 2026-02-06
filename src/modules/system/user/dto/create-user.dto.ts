import { IsConfirmRule } from "@/common/rules/IsConfirm.rule";
import { IsNotExistsRule } from "@/common/rules/IsNotExists.rule";
import { IsEmail, IsNotEmpty, Validate } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "用户名不能为空" })
  @IsNotExistsRule("user", {
    message: "用户名已存在",
  })
  userName: string;
  @IsEmail({}, { message: "邮箱格式错误" })
  email: string;
  @IsNotEmpty({ message: "密码不能为空" })
  password: string;
  @Validate(IsConfirmRule, {
    message: "确认密码输入错误",
  })
  passwordConfirm: string;
  @IsNotEmpty({ message: "昵称不能为空" })
  nickName: string;
  avatar: string;
  role: string;
  address: string;
  status: number;
  remark: string;
  gender: number;
  age: number;
  extend?: string;
  extend1?: string;
  extend2?: string;
  extend3?: string;
}
