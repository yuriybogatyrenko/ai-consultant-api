import { Test, TestingModule } from '@nestjs/testing';
import { AccountTeamService } from './account-team.service';

describe('AccountTeamService', () => {
  let service: AccountTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountTeamService],
    }).compile();

    service = module.get<AccountTeamService>(AccountTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
