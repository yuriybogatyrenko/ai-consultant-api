import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
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
import sleep from 'src/_helpers/sleep';
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
    private readonly httpService: HttpService,
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
    try {
      // console.log('sendMessageToGpt', args);
      const openai = this.getOrCreateOpenAiClient(bot.account);
      // const threadId = bot.thread_id;
      if (!thread.gpt_thread_id) {
        const openAiThread = await openai.beta.threads.create();
        thread.gpt_thread_id = openAiThread.id;
        await this.threadRepository.save(thread);
      }

      await openai.beta.threads.messages.create(thread.gpt_thread_id, {
        role: 'user',
        content: message.content,
      });

      const gptRun = await openai.beta.threads.runs.create(
        thread.gpt_thread_id,
        {
          assistant_id: bot.account.gpt_assistant_id,
        },
      );

      const accountWithCustomFields =
        await this.accountsService.getAccountCustomFields(bot.account);

      let i = 0;
      while (i < 20) {
        const runResult = await openai.beta.threads.runs.retrieve(
          thread.gpt_thread_id,
          gptRun.id,
        );

        if (runResult.status === 'expired') {
          throw new BadRequestException('GPT run expired');
        }

        if (runResult.status === 'completed') {
          const messages = await openai.beta.threads.messages.list(
            thread.gpt_thread_id,
          );
          console.log('run completed');
          // console.log('message', messages);
          return this.getThreadLastMessage(messages);
        }

        if (runResult.status === 'requires_action') {
          console.log('Actions in progress...');
          // const output = [];
          const output = await Promise.all(
            runResult.required_action.submit_tool_outputs.tool_calls.map(
              async (tool_call) => {
                if (
                  tool_call.function?.name &&
                  accountWithCustomFields.custom_fields['webhookUrl']
                ) {
                  console.log('action name: ', tool_call);
                  try {
                    const response = await this.httpService
                      .post(
                        accountWithCustomFields.custom_fields['webhookUrl'],
                        {
                          //   ...body,
                          functionObject: tool_call.function,
                        },
                      )
                      .toPromise();

                    // console.log(responsea);
                    if (response) {
                      console.log('######### response from backend #########');
                      console.log(response);
                      return {
                        tool_call_id: tool_call.id,
                        output: response ? JSON.stringify(response) : '',
                      };
                    } else {
                      return {
                        tool_call_id: tool_call.id,
                        output: `Can't procceed data`,
                      };
                    }
                  } catch (err) {
                    console.error(err);
                    return {
                      tool_call_id: tool_call.id,
                      output: err.message,
                    };
                  }
                }
                return {};
              },
            ),
          );

          this.submitToolOuputs(
            bot,
            thread.gpt_thread_id,
            runResult.id,
            output,
          );
          console.log('Actions done');
        }

        await sleep(2000);
        i++;
      }
    } catch (err) {
      console.log(err);
    }
  }

  private getThreadLastMessage(
    messages: OpenAI.Beta.Threads.Messages.MessagesPage,
  ) {
    let messageContent = messages.data[0].content[0]['text'];

    const annotations = messageContent.annotations;

    annotations.forEach((annotation) => {
      messageContent.value.replace(annotation.text, '');
    });

    return messageContent.value;
  }

  submitToolOuputs(
    bot: PlatformTelegramSetting,
    threadId: string,
    runId: string,
    toolOutputs: any,
  ) {
    const openai = this.getOrCreateOpenAiClient(bot.account);
    return openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
      tool_outputs: toolOutputs,
    });
  }
}
