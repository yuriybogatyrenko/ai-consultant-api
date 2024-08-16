import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import {
  Assistant,
  AssistantCreateParams,
} from 'openai/resources/beta/assistants';
import sleep from 'src/_helpers/sleep';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entity/account.entity';
import { ContactsService } from 'src/contacts/contacts.service';
import { ContactMessage } from 'src/contacts/entity/contact-message.entity';
import {
  ContactThread,
  ThreadStatus,
} from 'src/contacts/entity/contact-thread.entity';
import { PlatformTelegramSetting } from 'src/platform-telegram/entity/platform-telegram.entity';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Message } from 'telegraf/typings/core/types/typegram';
import {
  MessageContentPartParam,
  MessageCreateParams,
} from 'openai/resources/beta/threads/messages';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { Contact } from 'src/contacts/entity/contact.entity';

@Injectable()
export class GptApiService {
  private threadRuns = new Map<
    string,
    { gptThreadId: string; gptRunId: string }
  >();
  private threadMessages = new Map<string, string[]>();
  private openAiClients = new Map<string, OpenAI>();

  constructor(
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
    private readonly contactService: ContactsService,
    @InjectRepository(ContactThread)
    private readonly threadRepository: Repository<ContactThread>,
    private readonly httpService: HttpService,
  ) {}

  async getAssistants(userId: string, accountId: string) {
    const account = await this.validateAccountOwnership(userId, accountId);
    const openai = this.getOrCreateOpenAiClient(account);
    return (await openai.beta.assistants.list()).data;
  }

  private async validateAccountOwnership(
    userId: string,
    accountId: string,
  ): Promise<Account> {
    const account = await this.accountsService.findOne(accountId);
    if (account.owner.id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    if (!account.gpt_api_key) {
      throw new UnauthorizedException('GPT API key not set');
    }
    return account;
  }

  private getOrCreateOpenAiClient(account: Account): OpenAI {
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
    const account = await this.validateAccountOwnership(userId, accountId);
    const openai = this.getOrCreateOpenAiClient(account);
    return await openai.beta.assistants.create(assistant);
  }

  async updateAssistant(
    userId: string,
    accountId: string,
    assistant: Assistant,
  ) {
    const account = await this.validateAccountOwnership(userId, accountId);
    const openai = this.getOrCreateOpenAiClient(account);

    const updatedAssistant = {
      ...assistant,
      description: assistant.description ?? '',
    };
    delete updatedAssistant.id;
    delete updatedAssistant.object;
    delete updatedAssistant.created_at;

    return await openai.beta.assistants.update(assistant.id, updatedAssistant);
  }

  async sendMessageToGpt(
    bot: PlatformTelegramSetting,
    message: ContactMessage,
    thread: ContactThread,
    chatId: string,
    contact: Contact,
  ) {
    try {
      const openai = this.getOrCreateOpenAiClient(bot.account);
      let innerThread = await this.ensureGptThreadExists(openai, thread);

      await this.cancelActiveThreadRunIfNeeded(
        openai,
        chatId,
        innerThread.gpt_thread_id,
      );

      if (this.threadMessages.has(chatId)) {
        const pendingMessages = this.threadMessages.get(chatId);
        this.threadMessages.delete(chatId);
        await openai.beta.threads.messages.create(innerThread.gpt_thread_id, {
          role: 'user',
          content: pendingMessages.map((msg) => {
            return { text: msg, type: 'text' };
          }),
        });
      }

      console.log(this.threadRuns.get(chatId));
      if (this.threadRuns.has(chatId) && this.threadRuns.get(chatId) === null) {
        const gptRun = await this.startGptRun(
          openai,
          chatId,
          innerThread.gpt_thread_id,
          bot.account.gpt_assistant_id,
        );
        this.threadRuns.set(chatId, {
          gptRunId: gptRun.id,
          gptThreadId: innerThread.gpt_thread_id,
        });
        return await this.processGptRun(
          openai,
          innerThread,
          gptRun,
          bot,
          chatId,
          contact,
        );
      }
    } catch (err) {
      console.error('Failed to send message to GPT:', err);
      throw err;
    }
  }

  private async ensureGptThreadExists(
    openai: OpenAI,
    thread: ContactThread,
  ): Promise<ContactThread> {
    if (!thread.gpt_thread_id) {
      return await this.createThread(openai, thread);
    }

    try {
      await openai.beta.threads.retrieve(thread.gpt_thread_id);
    } catch (err) {
      if (err.status === 404) {
        return await this.createThread(openai, thread);
      }
      throw err;
    }

    return thread;
  }

  private async cancelActiveThreadRunIfNeeded(
    openai: OpenAI,
    chatId: string,
    gptThreadId: string,
  ): Promise<void> {
    const activeThreadRun = this.threadRuns.get(chatId);
    if (activeThreadRun && activeThreadRun.gptRunId) {
      try {
        // Cancel the active thread run
        this.threadRuns.set(chatId, null);
        await openai.beta.threads.runs.cancel(
          activeThreadRun.gptThreadId,
          activeThreadRun.gptRunId,
        );
      } catch (err) {
        console.error('Failed to cancel active thread run:', err);
      }
    }
  }

  private async startGptRun(
    openai: OpenAI,
    chatId: string,
    gptThreadId: string,
    assistantId: string,
  ): Promise<any> {
    const gptRun = await openai.beta.threads.runs.create(gptThreadId, {
      assistant_id: assistantId,
    });
    this.threadRuns.set(chatId, { gptRunId: gptRun.id, gptThreadId });
    return gptRun;
  }

  private async processGptRun(
    openai: OpenAI,
    thread: ContactThread,
    gptRun: Run,
    bot: PlatformTelegramSetting,
    chatId: string,
    contact: Contact,
  ): Promise<ContactMessage> {
    for (let i = 0; i < 20; i++) {
      console.log('platform chat id:', thread.platform_chat_id);
      if (!this.threadRuns.has(chatId)) return;

      const runResult = await openai.beta.threads.runs.retrieve(
        thread.gpt_thread_id,
        gptRun.id,
      );

      /* console.info(runResult.status);

      console.log(
        'check is canceled of failed',
        ['cancelled', 'failed'].includes(runResult.status),
      ); */

      if (runResult.status === 'expired') {
        this.threadRuns.delete(chatId);
        throw new BadRequestException('GPT run expired');
      } else if (runResult.status === 'completed') {
        this.threadRuns.delete(chatId);
        const messages = await openai.beta.threads.messages.list(
          thread.gpt_thread_id,
        );
        const gptResponseMessage = this.getThreadLastMessage(messages);
        return await this.contactService.createSystemMessage(
          gptResponseMessage,
          thread,
        );
      } else if (runResult.status === 'requires_action') {
        const accountWithCustomFields =
          await this.accountsService.getAccountCustomFields(bot.account);

        await this.handleRequiredActions(
          runResult,
          bot,
          thread.gpt_thread_id,
          gptRun.id,
          accountWithCustomFields,
          contact,
        );
      } else if (['cancelled', 'failed'].includes(runResult.status)) {
        console.log('GPT run cancelled or failed:', runResult.status);
        this.threadRuns.delete(chatId);
        // throw new BadRequestException('GPT run cancelled or failed');
      }

      await sleep(1000);
    }

    throw new Error('GPT run did not complete within the expected timeframe');
  }

  private async handleRequiredActions(
    runResult,
    bot: PlatformTelegramSetting,
    gptThreadId: string,
    gptRunId: string,
    accountWithCustomFields: any,
    contact: Contact,
  ): Promise<void> {
    const toolOutputs = await Promise.all(
      runResult.required_action.submit_tool_outputs.tool_calls.map(
        async (toolCall) => {
          if (toolCall.function?.name && accountWithCustomFields.webhookUrl) {
            return await this.processToolCall(
              toolCall,
              accountWithCustomFields.webhookUrl,
              contact,
            );
          }
          return {
            tool_call_id: toolCall.id,
            output: `Can't proceed data`,
          };
        },
      ),
    );

    await this.submitToolOutputs(bot, gptThreadId, gptRunId, toolOutputs);
  }

  private async processToolCall(
    toolCall: any,
    webhookUrl: string,
    contact: Contact,
  ): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(webhookUrl, {
          functionObject: toolCall.function,
          clientData: contact,
        }),
      );

      return {
        tool_call_id: toolCall.id,
        output: response ? JSON.stringify(response.data) : '',
      };
    } catch (err) {
      console.error('Failed to process tool call:', err);
      return {
        tool_call_id: toolCall.id,
        output: err.message,
      };
    }
  }

  private async createThread(
    openai: OpenAI,
    thread: ContactThread,
  ): Promise<ContactThread> {
    const openAiThread = await openai.beta.threads.create();
    thread.gpt_thread_id = openAiThread.id;
    return await this.threadRepository.save(thread);
  }

  private getThreadLastMessage(
    messages: OpenAI.Beta.Threads.Messages.MessagesPage,
  ): string {
    const lastMessage = messages.data[0].content[0]['text'];
    const annotations = lastMessage.annotations ?? [];

    annotations.forEach((annotation) => {
      lastMessage.value = lastMessage.value.replace(annotation.text, '');
    });

    return lastMessage.value;
  }

  private async submitToolOutputs(
    bot: PlatformTelegramSetting,
    threadId: string,
    runId: string,
    toolOutputs: any,
  ): Promise<void> {
    try {
      const openai = this.getOrCreateOpenAiClient(bot.account);
      await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
        tool_outputs: toolOutputs,
      });
    } catch (err) {
      console.error('Failed to submit tool outputs:', err);
    }
  }

  async cancelActiveRun(
    bot: PlatformTelegramSetting,
    chatId: string,
  ): Promise<void> {
    if (this.threadRuns.has(chatId)) {
      const activeThreadRun = this.threadRuns.get(chatId);
      try {
        this.threadRuns.set(chatId, null);
        if (activeThreadRun !== null) {
          const openai = this.getOrCreateOpenAiClient(bot.account);
          await openai.beta.threads.runs.cancel(
            activeThreadRun.gptThreadId,
            activeThreadRun.gptRunId,
          );
        }
      } catch (err) {
        console.error('Failed to cancel active GPT run:', err);
      }
    }
  }

  async getActiveThread(
    bot: PlatformTelegramSetting,
    chatId: string,
  ): Promise<ContactThread | undefined> {
    const thread = await this.threadRepository.findOne({
      where: {
        platform_chat_id: chatId,
        status: ThreadStatus.ACTIVE,
      },
      relations: ['contact'],
    });

    return thread;
  }

  async startMessaging(
    bot: PlatformTelegramSetting,
    chatId: string,
    msg: Message.TextMessage,
  ) {
    this.threadMessages.set(chatId, [
      ...(this.threadMessages.get(chatId) || []),
      msg.text,
    ]);

    if (this.threadRuns.has(chatId)) {
      await this.cancelActiveRun(bot, chatId);
    } else {
      this.threadRuns.set(chatId, null);
    }

    console.log('thread runs:', this.threadRuns);
    console.log('thread messages:', this.threadMessages);
  }
}
