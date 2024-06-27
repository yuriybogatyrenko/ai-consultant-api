import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { ApiKeyGuard } from 'src/auth/api-key.guard';
import { ChatGptService } from './chat-gpt.service';

@UseGuards(ApiKeyGuard)
@Controller('chat-gpt')
export class ChatGptController {
  constructor(
    private readonly gptService: ChatGptService,
    private readonly httpService: HttpService,
  ) {}

  @Post('message')
  async getGPTResponse(
    @Body()
    body: {
      message: string;
      threadId: string;
      assistantId: string;
      clientId: string;
      insta_source: string;
      telegram_source: string;
      webhook: string;
    },
  ) {
    if (!body.threadId) {
      console.error('Invalid thread');
      throw new HttpException(
        'Invalid thread',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.gptService
      .generateResponse(body.message, body.threadId)
      .then(async (response) => {
        const assistantRun = await this.runAssistant({
          thread_id: body.threadId,
          assistant_id: body.assistantId,
        });
        return {
          threadId: response.thread_id,
          messageId: response.id,
          runId: assistantRun.id,
        };
      })
      .catch((error) => {
        console.error('Error generating response:', error);
        throw new HttpException(
          'Произошла ошибка при получении ответа GPT',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  @Post('start')
  async createThread() {
    return this.gptService.createThread().catch((error) => {
      console.error('Error creating thread:', error);
      throw new HttpException(
        'Произошла ошибка при создании треда',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  @Post('check')
  async retrieveRun(
    @Body()
    body: {
      threadId: string;
      runId: string;
      webhookUrl: string;
      clientId: string;
    },
  ) {
    if (!body.threadId || !body.runId) {
      console.error('Error: Missing thread_id or run_id in /check');
      return { response: 'error' };
    }

    let counter = 0;
    while (counter < 9) {
      const run = await this.gptService
        .retrieveRun(body.threadId, body.runId)
        .catch((error) => {
          console.error('Error retrieving run:', error);
          throw new HttpException(
            'Произошла ошибка при получении выполнения',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      // console.dir(run);

      if (run.status === 'expired') {
        return { status: 'expired', response: 'Error expired' };
      }

      if (run.status === 'completed') {
        const message = await this.getThreadLastMessage(body.threadId);

        console.log('run completed');
        return { status: 'completed', response: message };
      }

      if (run.status === 'requires_action') {
        console.log('Actions in progress...');
        await run.required_action.submit_tool_outputs.tool_calls.forEach(
          async (tool_call) => {
            if (tool_call.function.name) {
              console.log('action name: ', tool_call.function.name);
              const response = this.httpService
                .post(body.webhookUrl, {
                  body: body,
                  function_name: tool_call.function.name,
                  output: tool_call.function.arguments,
                })
                .subscribe({
                  next: (next) => {
                    const output = [
                      {
                        tool_call_id: tool_call.id,
                        output: tool_call.function.arguments,
                      },
                    ];

                    if (next.data.success) {
                      this.submitToolOuputs(body.threadId, body.runId, output);
                    }
                  },
                  error: (err) => console.log(err),
                  complete: () => {
                    console.log('request completed');
                  },
                });

              console.log(response);
            }
            /* console.log('action name', tool_call.function.name);
            if (tool_call.function.name === 'get_phone_and_name') {
              
            } */
          },
        );
        console.log('Actions done');

        // console.dir(run.required_action.submit_tool_outputs.tool_calls);
        // console.dir(run.tools[0].function);
      }

      await this.sleep(1000);
      console.log('timer', counter);
      counter = counter + 1;
    }

    console.log('timeout');
    return { response: 'timeout' };
  }

  async runAssistant(payload: { thread_id: string; assistant_id: string }) {
    return this.gptService.runAssistantByThread(payload).catch((error) => {
      console.error('Error running assistant:', error);
      throw new HttpException(
        'Произошла ошибка при запуске ассистента',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  private async submitToolOuputs(
    threadId: string,
    runId: string,
    toolOuputs: any,
  ) {
    return this.gptService.submitToolOuputs(threadId, runId, toolOuputs);
  }

  private async getThreadLastMessage(threadId: string) {
    return this.gptService
      .getThreadLastMessages(threadId)
      .then((messages: any) => {
        let messageContent = messages.data[0].content[0].text;

        const annotations = messageContent.annotations;

        annotations.forEach((annotation) => {
          messageContent.value.replace(annotation.text, '');
        });

        return messageContent.value;
      });
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
