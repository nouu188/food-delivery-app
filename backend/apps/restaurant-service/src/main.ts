import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { setupHMR } from '@backend/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservicePort = parseInt(process.env.MICROSERVICE_PORT || '4003', 10);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.MICROSERVICE_PORT || '4003'),
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();

  const port = parseInt(process.env.PORT || '3003', 10);
  await app.listen(port);

  Logger.log(`🚀 Restaurant Service is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🚀 Restaurant Microservice is listening on TCP port ${microservicePort}`);

  if (process.env.HMR === 'true') {
    Logger.log(`🔥 Hot Module Replacement is enabled`);
    setupHMR(app);
  }
}

bootstrap();
