import { NestFactory } from '@nestjs/core';
import { DriverServiceModule } from './driver-service.module';

async function bootstrap() {
  const app = await NestFactory.create(DriverServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
