// my.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export type someParameterType = Array<{
  names: Array<string>;
  type: "string" | "number";
}>;

@Injectable()
export class ResetParameterInterceptor implements NestInterceptor {
  constructor(private readonly someParameter: someParameterType) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 获取请求对象
    const request = context.switchToHttp().getRequest();

    // 修改参数类型
    if (request.body) {
      if (!(this.someParameter instanceof Array)) return;
      this.someParameter.forEach(f => {
        if (!(f.names instanceof Array)) return;
        if (f.type === "number") {
          f.names.forEach(x => {
            if (!request.body[x]) return;
            request.body[x] = Number(request.body[x]);
          });
        } else if (f.type === "string") {
          f.names.forEach(x => {
            if (!request.body[x]) return;
            request.body[x] = String(request.body[x]);
          });
        }
      });
    }

    // 继续处理请求
    return next.handle().pipe(map(data => data));
  }
}
/**
 * @description 自定义装饰器 转换参数
 * 例如[{ name: ['a','b'], type: 'number' }, { name: ['c','d'], type: 'string' }]
 * 则会将a,b 转换成number类型 c,d转换成string类型
 * @param someParameter
 * @returns
 */
export function ResetParameterFactory(
  someParameter: someParameterType,
): ResetParameterInterceptor {
  return new ResetParameterInterceptor(someParameter);
}
