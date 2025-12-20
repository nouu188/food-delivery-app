import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { setupHMR } from '@backend/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservicePort = parseInt(process.env.MICROSERVICE_PORT || '4001', 10);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: microservicePort,
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();

  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);

  Logger.log(`🚀 Auth Service is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 Auth Microservice is listening on TCP port ${microservicePort}`);

  if (process.env.HMR === 'true') {
    Logger.log(`🔥 Hot Module Replacement is enabled`);
    setupHMR(app);
  }
}

bootstrap();
