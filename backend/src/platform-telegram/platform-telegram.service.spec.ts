import { Test, TestingModule } from '@nestjs/testing';
import { PlatformTelegramService } from './platform-telegram.service';

describe('PlatformTelegramService', () => {
  let service: PlatformTelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformTelegramService],
    }).compile();

    service = module.get<PlatformTelegramService>(PlatformTelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
