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
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { PageQueryType } from "./types";
import { AuthUser } from "@/common/decorator/user.decorator";
import { JwtUserType } from "@/common/shared/user.model";
import { FilterFields } from "@/common/decorator/filterFields.decorator";
import { FilterFieldsInterceptor } from "@/common/interceptors/filterFields.interceptor";

@Controller("base/project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post("/create")
  create(
    @AuthUser() user: JwtUserType,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectService.create(createProjectDto, user);
  }

  @Get("/listByPage")
  findAll(@AuthUser() user: JwtUserType, @Query() query: PageQueryType) {
    return this.projectService.findAll(query, user.userId);
  }

  @Get("/detail/:id")
  findOne(@Param("id") id: string) {
    return this.projectService.findOne(id);
  }

  @Post("/update")
  @UseInterceptors(FilterFieldsInterceptor)
  @FilterFields()
  update(
    @AuthUser() user: JwtUserType,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(
      +updateProjectDto.id,
      updateProjectDto,
      user,
    );
  }

  @Delete("/delete/:id")
  remove(@Param("id") id: string) {
    return this.projectService.remove(+id);
  }
}
