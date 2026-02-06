import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import LoginDto from "./dto/login.dto";
import UpdateUserDto from "./dto/updateUser.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(@Req() req: any, @Body() body: LoginDto) {
    return this.auth.login(req, body);
  }

  // 获取用户信息
  @Get("/user/info")
  async userInfo(@Req() req: any) {
    return this.auth.userInfo(req.user);
  }

  // 修改用户
  @Post("/user/update")
  async updateUser(@Body() body: UpdateUserDto) {
    return this.auth.updateUser(body);
  }

  // 获取用户菜单
  @Get("/user/menu")
  async userMenu(@Req() req: any) {
    return this.auth.getUserMenu(req.user);
  }

  // 获取用户文档
  @Get("/user/docs")
  async userDocs(@Req() req: any, @Query() query: { name: string }) {
    return this.auth.getUserDoc(req.user, query);
  }
}
