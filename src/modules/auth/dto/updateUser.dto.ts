import { IsNotEmpty, Validate } from 'class-validator';
import { IsExistsRule } from '@/common/rules/IsExists.rule';
import { IsConfirmRule } from '@/common/rules/IsConfirm.rule';

export default class UpdateUserDto {
    @IsNotEmpty({ message: "用户名不能为空" })
    @IsExistsRule('user', { message: "用户名不存在" })
    userName: string;
    @IsNotEmpty({ message: "密码不能为空" })
    password: string;
    @Validate(IsConfirmRule, { message: '确认密码输入错误' })
    passwordConfirm: string;
    @IsNotEmpty({ message: "新密码不能为空" })
    newPassword: string;
}