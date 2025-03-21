import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { logger } from '../logger/logger.config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;

    logger.info(
      `Incoming Request - Method: ${method}, URL: ${url}, IP: ${ip}, User-Agent: ${userAgent}`,
      {
        body,
        query,
        params,
      },
    );

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          logger.info(
            `Outgoing Response - Status: ${response.statusCode}, Duration: ${
              Date.now() - now
            }ms`,
            {
              data,
            },
          );
        },
        error: (error) => {
          logger.error('Request Error', {
            error: error.message,
            stack: error.stack,
            duration: Date.now() - now,
          });
        },
      }),
    );
  }
}
