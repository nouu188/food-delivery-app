import { Test, TestingModule } from '@nestjs/testing';
import { SharedDtosService } from './shared-dtos.service';

describe('SharedDtosService', () => {
  let service: SharedDtosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedDtosService],
    }).compile();

    service = module.get<SharedDtosService>(SharedDtosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
