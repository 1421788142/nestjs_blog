import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { AuthService } from "@/modules/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CommonService } from "@/common/services/common.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>("TOKEN_SECRET"),
          signOptions: {
            expiresIn: config.get<string>("JWT_EXPIRE"),
          },
        };
      },
    }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, AuthService, CommonService],
})
export class ProjectModule {}
