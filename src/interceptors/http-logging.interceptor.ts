import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log(`Incoming ${request.method} request to ${request.url}`);
    console.log('Request Body:', request.body);

    return next.handle().pipe(
      tap(() => {
        console.log(
          `Outgoing response for ${request.method} request to ${request.url}`,
        );
      }),
    );
  }
}
