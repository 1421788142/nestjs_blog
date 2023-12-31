import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseSuccess } from "./type";

@Injectable()
export class ResponseInterceptor<T>
  implements
    NestInterceptor<T, ResponseSuccess<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseSuccess<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          code: HttpStatus.OK,
          data,
          message: "成功",
        };
      }),
    );
  }
}
