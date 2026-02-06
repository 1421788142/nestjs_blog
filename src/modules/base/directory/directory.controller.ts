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
import { DirectoryService } from "./directory.service";
import { CreateDirectoryDto } from "./dto/create-directory.dto";
import { UpdateDirectoryDto } from "./dto/update-directory.dto";
import { PageQueryType } from "./types";
import { AuthUser } from "@/common/decorator/user.decorator";
import { JwtUserType } from "@/common/shared/user.model";
import { FilterFields } from "@/common/decorator/filterFields.decorator";
import { FilterFieldsInterceptor } from "@/common/interceptors/filterFields.interceptor";

@Controller("base/directory")
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Post("/create")
  create(
    @AuthUser() user: JwtUserType,
    @Body() createDirectoryDto: CreateDirectoryDto,
  ) {
    return this.directoryService.create(createDirectoryDto, user);
  }

  @Get("/listByPage")
  findAll(@AuthUser() user: JwtUserType, @Query() query: PageQueryType) {
    return this.directoryService.findAll(query, user.userId);
  }

  @Get("/detail/:id")
  findOne(@Param("id") id: string) {
    return this.directoryService.findOne(+id);
  }

  @Post("/update")
  @UseInterceptors(FilterFieldsInterceptor)
  @FilterFields(["projectName"])
  update(
    @AuthUser() user: JwtUserType,
    @Body() updateDirectoryDto: UpdateDirectoryDto,
  ) {
    return this.directoryService.update(
      +updateDirectoryDto.id,
      updateDirectoryDto,
      user,
    );
  }

  @Delete("/delete/:id")
  remove(@Param("id") id: string) {
    return this.directoryService.remove(+id);
  }
}
