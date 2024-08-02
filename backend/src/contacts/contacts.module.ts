import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './entity/contact-message.entity';
import { ContactThread } from './entity/contact-thread.entity';
import { Contact } from './entity/contact.entity';
import { ContactCustomField } from 'src/contact-custom-fields/entity/contact-custom-field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContactMessage,
      ContactThread,
      Contact,
      ContactCustomField,
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
