import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Validate } from "./common/validate/validate";
import { ResponseInterceptor } from "./common/interceptors/response.inteceptor";
import { NestExpressApplication } from "@nestjs/platform-express";
import { HttpExceptionsFilter } from "@/common/filters/exceptions.filter";
import helmet from "helmet";
import csurf from "csurf";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 定义前缀
  app.setGlobalPrefix("dev");

  //cors：跨域资源共享，方式一：允许跨站访问
  app.enableCors();

  //防止跨站脚本攻击
  app.use(
    helmet({
      crossOriginResourcePolicy: false, //图片不跨域
    }),
  );

  //CSRF保护：跨站点请求伪造
  // app.use(csurf());

  // 挂载全局自定义管道 错误拦截
  app.useGlobalPipes(new Validate());

  // 挂载请求拦截器 响应拦截器 定义包裹体
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 挂载全局过滤器
  app.useGlobalFilters(new HttpExceptionsFilter());

  // 使用静态目录。项目的public文件夹下的所有文件都可以直接访问
  app.useStaticAssets("public/upload", {
    prefix: "/upload",
    extensions: ["png", "jpg", "jpeg", "gif"],
  });
  // 启动
  await app.listen(5555);
}
bootstrap();
