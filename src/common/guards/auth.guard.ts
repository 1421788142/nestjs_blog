import { httpError } from "@/utils/http.util";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 全局权限守卫
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    // 在白名单或者则直接出去
    if (this.hasWhite(this.whiteList, request.url)) {
      return true;
    }
    if (token) {
      try {
        const access_token = token.replace("Bearer ", "");
        const decoded = this.jwtService.verify(access_token);
        request.user = decoded;
        return true;
      } catch {
        httpError({
          msg: "token失效, 请重新登录",
          code: "UNAUTHORIZED",
        });
      }
    } else {
      httpError({
        msg: "token失效, 请重新登录",
        code: "UNAUTHORIZED",
      });
    }
  }
  // 不校验token白名单
  private whiteList: string[] = ["/dev/auth/login"];

  // 路由白名单
  public hasWhite(whiteList: string[], path: string) {
    return whiteList.includes(path);
  }
}
