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
import { FilterFields } from "@/common/decorator/filterFields.decorator";
import { FilterFieldsInterceptor } from "@/common/interceptors/filterFields.interceptor";

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
    return this.userService.findAll(query, user.userId);
  }

  @Get("/detail/:id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Post("/update")
  @UseInterceptors(FilterFieldsInterceptor)
  @FilterFields()
  update(@Body() updateUserDto: any) {
    const dto = updateUserDto as UpdateUserDto;
    return this.userService.update(+dto.id, dto);
  }

  @Delete("/delete/:id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
