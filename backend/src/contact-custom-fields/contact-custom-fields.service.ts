import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactCustomField } from './entity/contact-custom-field.entity';
import { Repository } from 'typeorm';
import { Account } from 'src/accounts/entity/account.entity';
import { CreateContactCustomFieldDto } from './dto/create-contact-custom-field-value.dto';

@Injectable()
export class ContactCustomFieldsService {
  constructor(
    @InjectRepository(ContactCustomField)
    private readonly contactCustomFieldRepository: Repository<ContactCustomField>,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async getContactCustomFields(userId: string, accountId: string) {
    const account = await this.checkOwnerAndReturnContact(userId, accountId);
    return this.contactCustomFieldRepository.find();
  }

  async getContactCustomField(userId: string, accountId: string, id: number) {
    const account = await this.checkOwnerAndReturnContact(userId, accountId);
    return this.contactCustomFieldRepository.find({
      where: { custom_field_id: id },
    });
  }

  async createContactCustomField(
    userId: string,
    accountId: string,
    customField: CreateContactCustomFieldDto,
  ): Promise<ContactCustomField> {
    const account = await this.checkOwnerAndReturnContact(userId, accountId);

    const contactCustomField =
      this.contactCustomFieldRepository.create(customField);
    contactCustomField.account = account;

    return this.contactCustomFieldRepository.save(contactCustomField);
  }

  async updateContactCustomField(
    userId: string,
    accountId: string,
    id: number,
    customFieldData: Partial<ContactCustomField>,
  ): Promise<ContactCustomField> {
    const account = await this.checkOwnerAndReturnContact(userId, accountId);

    const customField = await this.contactCustomFieldRepository.findOneBy({
      custom_field_id: id,
      account: { account_id: accountId },
    });

    await this.contactCustomFieldRepository.update(
      customField.custom_field_id,
      customFieldData,
    );

    return this.contactCustomFieldRepository.findOne({
      where: { custom_field_id: id },
    });
  }

  async deleteContactCustomField(
    userId: string,
    accountId: string,
    id: number,
  ): Promise<void> {
    const account = await this.checkOwnerAndReturnContact(userId, accountId);

    const customField = await this.contactCustomFieldRepository.findOne({
      where: { custom_field_id: id, account: { account_id: accountId } },
    });

    await this.contactCustomFieldRepository.delete(customField.custom_field_id);
  }

  private async checkOwnerAndReturnContact(
    userId: string,
    accountId: string,
  ): Promise<Account> {
    const account = await this.accountsRepository.findOneBy({
      account_id: accountId,
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.owner.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return account;
  }
}
