import { Controller, Get } from '@nestjs/common';
import { DriverServiceService } from './driver-service.service';

@Controller()
export class DriverServiceController {
  constructor(private readonly driverServiceService: DriverServiceService) {}

  @Get()
  getHello(): string {
    return this.driverServiceService.getHello();
  }
}
