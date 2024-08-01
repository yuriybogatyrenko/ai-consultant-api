import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TelegramBot from 'node-telegram-bot-api';
import OpenAI from 'openai';
import {
  Assistant,
  AssistantCreateParams,
} from 'openai/resources/beta/assistants';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entity/account.entity';
import { ContactsService } from 'src/contacts/contacts.service';
import { ContactMessage } from 'src/contacts/entity/contact-message.entity';
import { ContactThread } from 'src/contacts/entity/contact-thread.entity';
import { Contact } from 'src/contacts/entity/contact.entity';
import { PlatformTelegramSetting } from 'src/platform-telegram/entity/platform-telegram.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GptApiService {
  private openAiClients = new Map<string, OpenAI>();

  constructor(
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
    private readonly contactService: ContactsService,
    @InjectRepository(ContactThread)
    private readonly threadRepository: Repository<ContactThread>,
  ) {}
  async getAssistants(userId: string, accountId: string) {
    // console.log('userId', userId);
    const account = await this.accountsService.findOne(accountId);
    // console.log('account', account);

    if (account.owner.id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!account.gpt_api_key) {
      throw new UnauthorizedException('GPT API key not set');
    }

    const openai = this.getOrCreateOpenAiClient(account);
    return (await openai.beta.assistants.list()).data;
  }

  private getOrCreateOpenAiClient(account: Account): OpenAI {
    if (!account.gpt_api_key) {
      throw new UnauthorizedException('GPT API key not set');
    }

    if (!this.openAiClients.has(account.account_id)) {
      const openai = new OpenAI({ apiKey: account.gpt_api_key });
      this.openAiClients.set(account.account_id, openai);
    }
    return this.openAiClients.get(account.account_id);
  }

  async createAssistant(
    userId: string,
    accountId: string,
    assistant: AssistantCreateParams,
  ) {
    const account = await this.accountsService.findOne(accountId);
    if (account.owner.id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const openai = this.getOrCreateOpenAiClient(account);
    return await openai.beta.assistants.create(assistant);
  }

  async updateAssistant(
    userId: string,
    accountId: string,
    assistant: Assistant,
  ) {
    const account = await this.accountsService.findOne(accountId);
    if (account.owner.id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    const openai = this.getOrCreateOpenAiClient(account);
    assistant.description ??= '';
    const assistantId = assistant.id;
    delete assistant.id;
    delete assistant.object;
    delete assistant.created_at;
    return await openai.beta.assistants.update(assistantId, assistant);
  }

  async sendMessageToGpt(
    bot: PlatformTelegramSetting,
    message: ContactMessage,
    thread: ContactThread,
    contact: Contact,
  ) {
    // console.log('sendMessageToGpt', args);
    const openai = this.getOrCreateOpenAiClient(bot.account);
    // const threadId = bot.thread_id;
    if (!thread.gpt_thread_id) {
      const openAiThread = await openai.beta.threads.create();
      thread.gpt_thread_id = openAiThread.id;
      await this.threadRepository.save(thread);
    }
  }
}
