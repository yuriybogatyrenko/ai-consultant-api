import { Test, TestingModule } from '@nestjs/testing';
import { PlatformWhatsappService } from './platform-whatsapp.service';

describe('PlatformWhatsappService', () => {
  let service: PlatformWhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformWhatsappService],
    }).compile();

    service = module.get<PlatformWhatsappService>(PlatformWhatsappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
