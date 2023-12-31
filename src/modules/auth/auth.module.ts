import { Module } from "@nestjs/common";
import { AuthController } from "@/modules/auth/auth.controller";
import { AuthService } from "@/modules/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CommonService } from "@/common/services/common.service";
import { ScheduleService } from "@/common/services/schedule.service";

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
  controllers: [AuthController],
  providers: [AuthService, CommonService, ScheduleService],
})
export class AuthModule {}
