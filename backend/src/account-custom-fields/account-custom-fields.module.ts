import { Module } from '@nestjs/common';
import { AccountCustomFieldsController } from './account-custom-fields.controller';
import { AccountCustomFieldsService } from './account-custom-fields.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountCustomField } from './entity/account-custom-field.entity';
import { Account } from 'src/accounts/entity/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountCustomField, Account])],
  controllers: [AccountCustomFieldsController],
  providers: [AccountCustomFieldsService],
})
export class AccountCustomFieldsModule {}
