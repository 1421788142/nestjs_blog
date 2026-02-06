import { Module } from "@nestjs/common";
import { DirectoryService } from "./directory.service";
import { DirectoryController } from "./directory.controller";
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
  controllers: [DirectoryController],
  providers: [DirectoryService, AuthService, CommonService],
})
export class DirectoryModule {}
