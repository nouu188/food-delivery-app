import { Module } from '@nestjs/common';
import { DriverServiceController } from './driver-service.controller';
import { DriverServiceService } from './driver-service.service';

@Module({
  imports: [],
  controllers: [DriverServiceController],
  providers: [DriverServiceService],
})
export class DriverServiceModule {}
