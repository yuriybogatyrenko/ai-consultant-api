import { Test, TestingModule } from '@nestjs/testing';
import { AccountCustomFieldsService } from './account-custom-fields.service';

describe('AccountCustomFieldsService', () => {
  let service: AccountCustomFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountCustomFieldsService],
    }).compile();

    service = module.get<AccountCustomFieldsService>(AccountCustomFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
