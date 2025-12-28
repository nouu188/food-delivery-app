import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { setupHMR } from '@backend/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.MICROSERVICE_PORT || '4007'),
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();

  const port = process.env.PORT || 3024;
  await app.listen(port);

  Logger.log(`🚀 Review Service is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 Review Microservice is listening on TCP port 3007`);

  if (process.env.HMR === 'true') {
    Logger.log(`🔥 Hot Module Replacement is enabled`);
    setupHMR(app);
  }
}

bootstrap();
