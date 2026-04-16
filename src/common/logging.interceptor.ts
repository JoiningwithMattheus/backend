import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.originalUrl;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAt;
          this.logger.log(`${method} ${url} -> ${durationMs}ms`);
        },
        error: (error) => {
          const durationMs = Date.now() - startedAt;
          const status = error?.status ?? 500;
          this.logger.warn(`${method} ${url} -> ${status} in ${durationMs}ms`);
        },
      }),
    );
  }
}
