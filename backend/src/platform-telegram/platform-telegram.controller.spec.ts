import { Test, TestingModule } from '@nestjs/testing';
import { PlatformTelegramController } from './platform-telegram.controller';

describe('PlatformTelegramController', () => {
  let controller: PlatformTelegramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformTelegramController],
    }).compile();

    controller = module.get<PlatformTelegramController>(PlatformTelegramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
