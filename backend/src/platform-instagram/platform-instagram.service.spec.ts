import { Test, TestingModule } from '@nestjs/testing';
import { PlatformInstagramService } from './platform-instagram.service';

describe('PlatformInstagramService', () => {
  let service: PlatformInstagramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformInstagramService],
    }).compile();

    service = module.get<PlatformInstagramService>(PlatformInstagramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
