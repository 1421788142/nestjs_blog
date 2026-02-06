import { Module } from "@nestjs/common";
import { ProjectModule } from "./project/project.module";
import { DirectoryModule } from "./directory/directory.module";

@Module({
  imports: [ProjectModule, DirectoryModule],
})
export class BaseModule {}
