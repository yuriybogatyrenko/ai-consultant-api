import { Test, TestingModule } from '@nestjs/testing';
import { ContactCustomFieldsController } from './contact-custom-fields.controller';

describe('ContactCustomFieldsController', () => {
  let controller: ContactCustomFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactCustomFieldsController],
    }).compile();

    controller = module.get<ContactCustomFieldsController>(ContactCustomFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
