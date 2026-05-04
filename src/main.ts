import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const isDev = process.env.NODE_ENV !== 'production';

  app.useGlobalPipes(new ValidationPipe());

  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('NestJS')
      .setDescription('API description')
      .setVersion('1.0')
      .addTag('nestjs')
      .build();
    SwaggerModule.setup('openapi', app, () =>
      SwaggerModule.createDocument(app, config),
    );
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
