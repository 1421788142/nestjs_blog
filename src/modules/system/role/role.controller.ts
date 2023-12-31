import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { PageQueryType } from "./types";
import { AuthUser } from "@/common/decorator/user.decorator";
import { JwtUserType } from "@/common/shared/user.model";

@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post("/create")
  create(@AuthUser() user: JwtUserType, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto, user);
  }

  @Get("/menus")
  findMenus(@AuthUser() user: JwtUserType) {
    return this.roleService.findMenus(user);
  }

  @Get("/listByPage")
  findAll(@AuthUser() user: JwtUserType, @Query() query: PageQueryType) {
    return this.roleService.findAll(query, user.id);
  }

  @Get("/detail/:id")
  findOne(@Param("id") id: string) {
    return this.roleService.findOne(+id);
  }

  @Post("/update")
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+updateRoleDto.id, updateRoleDto);
  }

  @Delete("/delete/:id")
  remove(@Param("id") id: string) {
    return this.roleService.remove(+id);
  }
}
