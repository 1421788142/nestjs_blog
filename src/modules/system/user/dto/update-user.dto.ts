import { OmitType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateUserDto extends OmitType(CreateUserDto, [
  "userName",
  "passwordConfirm",
  "password",
]) {
  @IsNotEmpty({ message: "用户名不能为空" })
  userName: string;
  userId: string;
  id: number;
}
