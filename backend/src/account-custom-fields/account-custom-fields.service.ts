import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountCustomField } from './entity/account-custom-field.entity';
import { CreateAccountCustomFieldDto } from './dto/create-account-custom-field.dto';
import { Account } from 'src/accounts/entity/account.entity';

@Injectable()
export class AccountCustomFieldsService {
  constructor(
    @InjectRepository(AccountCustomField)
    private readonly accountCustomFieldRepository: Repository<AccountCustomField>,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  getAccountCustomFields(
    userId: string,
    accountId: string,
  ): Promise<AccountCustomField[]> {
    const account = this.checkOwnerAndReturnAccount(userId, accountId);

    return this.accountCustomFieldRepository.find({
      where: { account: { account_id: accountId } },
    });
  }

  getAccountCustomField(
    userId: string,
    accountId: string,
    id: number,
  ): Promise<AccountCustomField[]> {
    const account = this.checkOwnerAndReturnAccount(userId, accountId);

    return this.accountCustomFieldRepository.find({
      where: { custom_field_id: id, account: { account_id: accountId } },
    });
  }

  async createAccountCustomField(
    userId: string,
    accountId: string,
    customField: CreateAccountCustomFieldDto,
  ): Promise<AccountCustomField> {
    const account = await this.checkOwnerAndReturnAccount(userId, accountId);

    const accountCustomField =
      this.accountCustomFieldRepository.create(customField);

    accountCustomField.account = account;
    return this.accountCustomFieldRepository.save(accountCustomField);
  }

  async updateAccountCustomField(
    userId: string,
    accountId: string,
    id: number,
    customFieldData: Partial<AccountCustomField>,
  ): Promise<AccountCustomField> {
    const account = await this.checkOwnerAndReturnAccount(userId, accountId);

    console.log(account);

    const accountCustomField = await this.accountCustomFieldRepository.findOne({
      where: { custom_field_id: id, account: { account_id: accountId } },
    });

    if (!accountCustomField) {
      throw new NotFoundException('Account Custom Field not found');
    }

    await this.accountCustomFieldRepository.update(
      { custom_field_id: accountCustomField.custom_field_id },
      customFieldData,
    );

    return this.accountCustomFieldRepository.findOne({
      where: { custom_field_id: id },
    });
  }

  async deleteAccountCustomField(
    userId: string,
    accountId: string,
    id: number,
  ): Promise<void> {
    const account = await this.checkOwnerAndReturnAccount(userId, accountId);
    await this.accountCustomFieldRepository.delete({
      custom_field_id: id,
    });
  }

  private async checkOwnerAndReturnAccount(
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
