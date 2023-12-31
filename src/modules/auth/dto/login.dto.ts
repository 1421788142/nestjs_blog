import { IsNotEmpty } from 'class-validator';
import { IsExistsRule } from '@/common/rules/IsExists.rule';

export default class LoginDto {
    @IsNotEmpty({ message: "用户名不能为空" })
    @IsExistsRule('user', { message: "用户名不存在" })
    userName: string;
    @IsNotEmpty({ message: "密码不能为空" })
    password: string;
}