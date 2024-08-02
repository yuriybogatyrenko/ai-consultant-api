import { Module } from '@nestjs/common';
import { ContactCustomFieldsController } from './contact-custom-fields.controller';
import { ContactCustomFieldsService } from './contact-custom-fields.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactCustomField } from './entity/contact-custom-field.entity';
import { ContactCustomFieldValue } from './entity/contact-custom-field-value.entity';
import { Account } from 'src/accounts/entity/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContactCustomField,
      ContactCustomFieldValue,
      Account,
    ]),
  ],
  controllers: [ContactCustomFieldsController],
  providers: [ContactCustomFieldsService],
})
export class ContactCustomFieldsModule {}
