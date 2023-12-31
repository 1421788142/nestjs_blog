import { Role } from "@/modules/auth/enum";
import { UseGuards, applyDecorators, SetMetadata } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../guards/role.guard";

// 只能是超级管理员才能添加菜单
export function AuthCreateMenu(...roles: Role[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        // 多个守卫 jwt 通过 判断角色
        UseGuards(AuthGuard('jwt'), RoleGuard)
    );
}