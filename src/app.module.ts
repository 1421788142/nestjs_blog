import { Module } from "@nestjs/common";
import { AuthModule } from "@/modules/auth/auth.module";
import { PrismaModule } from "@/common/prisma/prisma.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SystemModule } from "@/modules/system/system.module";
import { BaseModule } from "@/modules/base/base.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@/common/guards/auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "@/common/strategy/jwt.strategy";
import { UploadModule } from "@/upload/upload.module";
import { CommonService } from "@/common/services/common.service";
import { ScheduleModule } from "@nestjs/schedule";
import { I18nModule, QueryResolver, HeaderResolver } from "nestjs-i18n";
import { join } from "path";

@Module({
  imports: [
    // 数据库
    PrismaModule,
    ThrottlerModule.forRoot([
      //请求频率限制
      { limit: 100, ttl: 60 }, //1分钟 请求10次
    ]),
    //jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>("TOKEN_SECRET"), //自定义加密
          signOptions: {
            expiresIn: config.get<string>("JWT_EXPIRE"), //自定义过期
          },
        };
      },
    }),
    //全局配置
    ConfigModule.forRoot({ isGlobal: true }),
    // 定时清除文件
    ScheduleModule.forRoot(),
    AuthModule, //用户权限模块
    SystemModule, //系统模块
    BaseModule, //基础模块
    UploadModule, //文件上传
    I18nModule.forRoot({
      fallbackLanguage: "zh-CN",
      loaderOptions: {
        path:
          process.env.NODE_ENV === "production"
            ? "./i18n"
            : join(process.cwd(), "src/i18n"),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        new HeaderResolver(["accept-language"]),
      ],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    JwtStrategy,
    CommonService,
  ],
  exports: [JwtModule, CommonService],
})
export class AppModule {}
