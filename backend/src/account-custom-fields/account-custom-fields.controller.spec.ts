import { Test, TestingModule } from '@nestjs/testing';
import { AccountCustomFieldsController } from './account-custom-fields.controller';

describe('AccountCustomFieldsController', () => {
  let controller: AccountCustomFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountCustomFieldsController],
    }).compile();

    controller = module.get<AccountCustomFieldsController>(AccountCustomFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
