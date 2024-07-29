import { Test, TestingModule } from '@nestjs/testing';
import { PlatformInstagramController } from './platform-instagram.controller';

describe('PlatformInstagramController', () => {
  let controller: PlatformInstagramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformInstagramController],
    }).compile();

    controller = module.get<PlatformInstagramController>(PlatformInstagramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
