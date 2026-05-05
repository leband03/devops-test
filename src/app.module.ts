import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { hostname } from 'node:os';

const isDev = process.env.NODE_ENV !== 'production';

@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
        transport: isDev
          ? {
              target: 'pino-pretty',
              options: { singleLine: true, translateTime: 'SYS:HH:MM:ss.l' },
            }
          : undefined,
        base: {
          service: 'devops-test',
          env: process.env.NODE_ENV ?? 'development',
          version: process.env.APP_VERSION ?? '0.0.1',
          pid: process.pid,
          hostname: hostname(),
        },
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.headers["set-cookie"]',
            'res.headers["set-cookie"]',
          ],
          remove: true,
        },
        autoLogging: {
          ignore: (req: IncomingMessage) => req.url === '/health',
        },
        genReqId: (req: IncomingMessage, res: ServerResponse) => {
          const incoming = req.headers['x-request-id'];
          const id =
            (Array.isArray(incoming) ? incoming[0] : incoming) ?? randomUUID();
          res.setHeader('X-Request-Id', id);
          return id;
        },
        customLogLevel: (_req, res, err) => {
          if (res.statusCode >= 500 || err) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
        customSuccessMessage: (req: IncomingMessage, res, responseTime) =>
          `${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`,
        customErrorMessage: (req: IncomingMessage, res, err) =>
          `${req.method} ${req.url} ${res.statusCode} ${err?.message ?? 'error'}`,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
