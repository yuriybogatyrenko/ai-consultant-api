import { Test, TestingModule } from '@nestjs/testing';
import { GptApiService } from './gpt-api.service';

describe('GptApiService', () => {
  let service: GptApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GptApiService],
    }).compile();

    service = module.get<GptApiService>(GptApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
