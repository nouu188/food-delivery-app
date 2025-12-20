import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './app/filters/all-exceptions.filter';
import { LoggingInterceptor } from './app/interceptors/logging.interceptor';
import { setupHMR } from '@backend/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 API Gateway is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📝 CORS enabled for origin: ${process.env.CORS_ORIGIN || '*'}`);
  Logger.log(`🔐 JWT authentication is configured`);

  if (process.env.HMR === 'true') {
    Logger.log(`🔥 Hot Module Replacement is enabled`);
    setupHMR(app);
  }
}

bootstrap();
