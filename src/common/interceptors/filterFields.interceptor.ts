import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";

@Injectable()
export class FilterFieldsInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    // 获取控制器方法上定义的需要过滤的字段
    const fieldsToRemove: string[] =
      this.reflector.get("fieldsToRemove", handler) || [];
    // 如果有需要过滤的字段，删除它们
    if (fieldsToRemove.length > 0) {
      fieldsToRemove.forEach(field => {
        delete request.body[field]; // 删除不需要的字段
      });
    }
    return next.handle();
  }
}
