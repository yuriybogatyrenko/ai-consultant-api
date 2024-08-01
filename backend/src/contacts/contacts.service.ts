import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entity/contact.entity';
import { Repository } from 'typeorm';
import { ContactThread } from './entity/contact-thread.entity';
import { ContactMessage } from './entity/contact-message.entity';
import TelegramBot from 'node-telegram-bot-api';
import { PlatformsEnum } from 'src/enums/platforms.enum';
import { Account } from 'src/accounts/entity/account.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    @InjectRepository(ContactThread)
    private readonly threadRepository: Repository<ContactThread>,
    @InjectRepository(ContactMessage)
    private readonly messageRepository: Repository<ContactMessage>,
  ) {}

  async getContacts() {
    return this.contactRepository.find();
  }

  async getContactById(id: string) {
    return this.contactRepository.findOneBy({ contact_id: id });
  }

  async createContact(contactData: Partial<Contact>, account: Account) {
    const contact = this.contactRepository.create(contactData);
    contact.account = account;
    return this.contactRepository.save(contact);
  }

  async updateContact(id: string, contactData: Partial<Contact>) {
    await this.contactRepository.update(id, contactData);
    return this.contactRepository.findOneBy({ contact_id: id });
  }

  async createMessageFromTelegram(
    message: TelegramBot.Message,
    account: Account,
  ) {
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    let contact = await this.contactRepository.findOneBy({
      platform_user_id: message.chat.id.toString(),
    });

    if (!contact) {
      contact = await this.createContact(
        {
          platform: PlatformsEnum.TELEGRAM,
          name: message.chat.first_name,
          language_code: message.from.language_code,
          platform_user_id: message.chat.id.toString(),
          platform_username: message.chat.username,
        },
        account,
      );
    }

    let thread = await this.threadRepository.findOneBy({
      contact: contact,
    });

    if (!thread) {
      thread = this.threadRepository.create({
        contact: contact,
      });

      thread = await this.threadRepository.save(thread);
    }

    const dbMessage = this.messageRepository.create({
      platoform_message_id: message.message_id.toString(),
      content: message.text,
      platform: PlatformsEnum.TELEGRAM,
      thread: thread,
      contact: contact,
    });

    return this.messageRepository.save(dbMessage);
  }
}
