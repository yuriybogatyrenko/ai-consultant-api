import { Body, Controller, Post } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly service: ChatGptService) {}

  @Post('message')
  async getGPTResponse(@Body() body: { message: string; threadId: string }) {
    if (!body.threadId) {
      return this.createThread(body.message).then(async (thread: any) => {
        const assistant_run = await this.runAssistant({ thread_id: thread.id });

        const run = this.retrieveRun(thread, assistant_run);

        return { thread, run: assistant_run };
      });
      //   return;
    }

    return this.service
      .generateResponse(body.message, body.threadId)
      .then((res) => {
        //   tap(async () => {
        // console.log('hi');
        console.log(res);
        return this.runAssistant({ thread_id: body.threadId });
        //   }),
      });
    /* .subscribe((res) => {
        this.runAssistant({ thread_id: body.threadId });
        return res;
      }); */
  }

  async createThread(message: string) {
    return this.service.createThread([message]);
  }

  async runAssistant(thread) {
    return this.service.runAssistantByThread(thread);
  }

  async retrieveRun(thread: any, run: any) {
    return this.service.retrieveRun(thread.id, run.id);
  }
}
