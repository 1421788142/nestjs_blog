import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Lang = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const lang = request.headers["accept-language"] || "zh";
    return lang.toLowerCase();
  },
);
