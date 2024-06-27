import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MessageCreateParams } from 'openai/resources/beta/threads/messages';
import { RunCreateParamsBase } from 'openai/resources/beta/threads/runs/runs';

@Injectable()
export class ChatGptService {
  private readonly logger = new Logger(ChatGptService.name);
  private gptApiKey: string;
  private openAI: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.gptApiKey = this.configService.get<string>('GPT_API');

    this.openAI = new OpenAI({ apiKey: this.gptApiKey });
  }

  generateResponse(content: string, threadId: string): Promise<any> {
    const data: MessageCreateParams = {
      role: 'user',
      content: content,
    };

    return this.openAI.beta.threads.messages.create(threadId, data);
  }

  createThread(): Promise<any> {
    return this.openAI.beta.threads.create();
  }

  async runAssistantByThread(payload: {
    thread_id: string;
    assistant_id: string;
  }): Promise<any> {
    const data: RunCreateParamsBase = {
      assistant_id: payload.assistant_id,
    };

    return this.openAI.beta.threads.runs.create(payload.thread_id, { ...data });
  }

  async retrieveRun(thread_id: string, run_id: string): Promise<any> {
    return this.openAI.beta.threads.runs.retrieve(thread_id, run_id);
  }

  async getThreadLastMessages(threadId: string) {
    return this.openAI.beta.threads.messages.list(threadId);
  }

  async submitToolOuputs(threadId: string, runId: string, toolOutputs: any) {
    return this.openAI.beta.threads.runs.submitToolOutputs(threadId, runId, {
      tool_outputs: toolOutputs,
    });
  }

  private handleError(err: any): void {
    if (err.response) {
      this.logger.error(
        `Error ${err.response.status}: ${JSON.stringify(
          err.response.data,
          this.getCircularReplacer(),
        )}`,
      );
    } else {
      this.logger.error(`Error: ${err.message}`);
    }
  }

  private getCircularReplacer(): (key: string, value: any) => any {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }
}
