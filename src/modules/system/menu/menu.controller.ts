import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { AuthCreateMenu } from "@/common/decorator/createMenu.decorator";
import { Role } from "@/modules/auth/enum";
import { PageQueryType } from "./types";
import { ResetParameterFactory } from "@/common/decorator/resetParameter.decorator";
import { AuthUser } from "@/common/decorator/user.decorator";
import { JwtUserType } from "@/common/shared/user.model";
import { FilterFieldsInterceptor } from "@/common/interceptors/filterFields.interceptor";
import { FilterFields } from "@/common/decorator/filterFields.decorator";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post("/create")
  @UseInterceptors(
    ResetParameterFactory([
      {
        names: ["orderNum", "pId", "keepAlive", "hidden", "status"],
        type: "number",
      },
    ]),
  )
  @AuthCreateMenu(Role.ADMIN) //必须登录切是超级管理员
  create(@AuthUser() user: JwtUserType, @Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto, user);
  }

  @Get("/listByPage")
  findAll(@Query() query: PageQueryType) {
    return this.menuService.findAll(query);
  }

  @Get("/detail/:id")
  findOne(@Param("id") id: string) {
    return this.menuService.findOne(+id);
  }

  @Post("/update")
  @UseInterceptors(FilterFieldsInterceptor)
  @FilterFields()
  update(@AuthUser() user: JwtUserType, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+updateMenuDto.id, updateMenuDto, user);
  }

  @Delete("/delete/:id")
  remove(@Param("id") id: string) {
    return this.menuService.remove(+id);
  }
}
