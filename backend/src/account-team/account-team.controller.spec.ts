import { Test, TestingModule } from '@nestjs/testing';
import { AccountTeamController } from './account-team.controller';

describe('AccountTeamController', () => {
  let controller: AccountTeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountTeamController],
    }).compile();

    controller = module.get<AccountTeamController>(AccountTeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
