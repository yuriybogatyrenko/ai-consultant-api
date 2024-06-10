import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly service: ChatGptService) {}

  @Post('message')
  async getGPTResponse(@Body() body: { message: string; threadId: string }) {
    if (!body.threadId) {
      console.error('Invalid thread');
      throw new HttpException(
        'Invalid thread',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.service
      .generateResponse(body.message, body.threadId)
      .then(async (response) => {
        const assistantRun = await this.runAssistant({
          thread_id: body.threadId,
        });
        return { message: response, assistantRun };
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
  async createThread(@Body() message: ThreadCreateParams.Message) {
    return this.service.createThread().catch((error) => {
      console.error('Error creating thread:', error);
      throw new HttpException(
        'Произошла ошибка при создании треда',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  @Post('check')
  async retrieveRun(@Body() body: { threadId: string; runId: string }) {
    let counter = 0;
    while (counter < 9) {
      const run = await this.service
        .retrieveRun(body.threadId, body.runId)
        .catch((error) => {
          console.error('Error retrieving run:', error);
          throw new HttpException(
            'Произошла ошибка при получении выполнения',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      console.dir(run);

      if (run.status === 'completed') {
        const message = await this.getThreadLastMessage(body.threadId);

        console.log('Action completed');
        return { status: 'completed', response: message };
      }

      if (run.status === 'requires_action') {
        run.required_action.submit_tool_outputs.tool_calls.forEach(
          (tool_call) => {
            if (tool_call.function.name === 'get_phone_and_name') {
              const data = [
                {
                  toll_call_id: tool_call.id,
                  output: JSON.parse(tool_call.function.arguments),
                },
              ];

              this.submitToolOuputs(body.threadId, body.runId, data);
            }
          },
        );

        console.log('Action in progress...');
        console.dir(run.required_action.submit_tool_outputs.tool_calls);
        console.dir(run.tools[0].function);
      }

      await this.sleep(1000);
      counter = counter + 1;
    }
  }

  async runAssistant(payload: { thread_id: string }) {
    return this.service.runAssistantByThread(payload).catch((error) => {
      console.error('Error running assistant:', error);
      throw new HttpException(
        'Произошла ошибка при запуске ассистента',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  async submitToolOuputs(threadId: string, runId: string, toolOuputs: any) {
    return this.service.submitToolOuputs(threadId, runId, toolOuputs);
  }

  async getThreadLastMessage(threadId: string) {
    return this.service
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

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
