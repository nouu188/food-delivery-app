import { Module } from '@nestjs/common';
import { SharedDtosService } from './shared-dtos.service';

@Module({
  providers: [SharedDtosService],
  exports: [SharedDtosService],
})
export class SharedDtosModule {}
