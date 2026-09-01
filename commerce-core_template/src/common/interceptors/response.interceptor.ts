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
        // A handler returning a raw array (instead of { data: [...] }) would
        // silently turn into { success: true, 0: ..., 1: ... } if we spread
        // it directly, since {...array} keys arrays by numeric index. Wrap
        // it under `data` instead so the shape always stays JSON-array-safe.
        if (Array.isArray(response)) {
          return {
            success: true,
            data: response,
          };
        }

        if (
          response &&
          typeof response === 'object' &&
          response.success !== undefined
        ) {
          return response;
        }

        return {
          success: true,
          ...response,
        };
      }),
    );
  }
}
