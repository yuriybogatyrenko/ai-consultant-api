import { Test, TestingModule } from '@nestjs/testing';
import { GptApiController } from './gpt-api.controller';

describe('GptApiController', () => {
  let controller: GptApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptApiController],
    }).compile();

    controller = module.get<GptApiController>(GptApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
