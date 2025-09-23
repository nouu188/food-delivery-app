import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
