import { ExecutionContext, createParamDecorator } from "@nestjs/common";

// 获取用户信息
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
