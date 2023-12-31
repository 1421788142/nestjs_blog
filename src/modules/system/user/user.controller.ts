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
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PageQueryType } from "./types";
import { ResetParameterFactory } from "@/common/decorator/resetParameter.decorator";
import { AuthUser } from "@/common/decorator/user.decorator";
import { JwtUserType } from "@/common/shared/user.model";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/create")
  @UseInterceptors(
    ResetParameterFactory([
      {
        names: ["age", "status", "gender"],
        type: "number",
      },
    ]),
  )
  create(@AuthUser() user: JwtUserType, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, user);
  }

  @Get("/listByPage")
  findAll(@AuthUser() user: JwtUserType, @Query() query: PageQueryType) {
    return this.userService.findAll(query, user.id);
  }

  @Get("/detail/:id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Post("/update")
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+updateUserDto.id, updateUserDto);
  }

  @Delete("/delete/:id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
