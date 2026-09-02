import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return { success: true, data: response };
        }

        if (
          response &&
          typeof response === 'object' &&
          response.success !== undefined
        ) {
          return response;
        }

        return { success: true, ...response };
      }),
    );
  }
}
