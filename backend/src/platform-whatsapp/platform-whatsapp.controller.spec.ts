import { Test, TestingModule } from '@nestjs/testing';
import { PlatformWhatsappController } from './platform-whatsapp.controller';

describe('PlatformWhatsappController', () => {
  let controller: PlatformWhatsappController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformWhatsappController],
    }).compile();

    controller = module.get<PlatformWhatsappController>(PlatformWhatsappController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
