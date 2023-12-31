import { Role } from "@/modules/auth/enum"
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from '@nestjs/core'
import { user } from '@prisma/client'

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        // 获取用户信息 通过jwt策略携带再http请求里面的
        const user = context.switchToHttp().getRequest().user as user
        // // 通过反射器 取到 SetMetadata报错的数据
        const role = this.reflector.get<Role[]>('roles', context.getHandler())
        // // 有角色就判断用户角色 否则直接通过
        return role ? role.includes(user.role as any) : true
    }
}