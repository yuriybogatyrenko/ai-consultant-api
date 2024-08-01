import { forwardRef, Module } from '@nestjs/common';
import { GptApiController } from './gpt-api.controller';
import { GptApiService } from './gpt-api.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactThread } from 'src/contacts/entity/contact-thread.entity';
import { Contact } from 'src/contacts/entity/contact.entity';
import { ContactMessage } from 'src/contacts/entity/contact-message.entity';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    TypeOrmModule.forFeature([ContactThread, ContactMessage, Contact]),
    ContactsModule,
  ],
  controllers: [GptApiController],
  providers: [GptApiService],
  exports: [GptApiService],
})
export class GptApiModule {}
