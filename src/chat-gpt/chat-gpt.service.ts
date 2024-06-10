import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  Message,
  MessageCreateParams,
} from 'openai/resources/beta/threads/messages';
import {
  RunCreateParamsBase,
  RunCreateParamsNonStreaming,
} from 'openai/resources/beta/threads/runs/runs';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { Observable, catchError, map, of, tap } from 'rxjs';

interface IGPTMessage {
  id: string;
  object: string;
  created_at: number;
  thread_id: string;
  role: string;
  content: [
    {
      type: string;
      text: {
        value: string;
        annotations: Array<any>;
      };
    },
  ];
  file_ids: Array<any>;
  assistant_id: string;
  run_id: string;
  metadata: any;
}

@Injectable()
export class ChatGptService {
  private readonly logger = new Logger(ChatGptService.name);
  private gptApiKey: string;
  private headers;
  private openAI: OpenAI;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.gptApiKey = this.configService.get<string>('GPT_API');

    this.openAI = new OpenAI({ apiKey: this.gptApiKey });

    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.gptApiKey}`,
      'OpenAI-Beta': 'assistants=v2',
    };
  }

  generateResponse(content: string, threadId: string): Promise<any> {
    const data: MessageCreateParams = {
      role: 'user',
      content: content,
    };

    return this.openAI.beta.threads.messages.create(threadId, data);

    /*return this.httpService
      .post<IGPTMessage>(
        `https://api.openai.com/v1/threads/${threadId}/messages`,
        data,
        { headers: this.headers },
      )
      .pipe(
        map(({ data }) => data.content[0].text.value),
        catchError((err) => {
          this.handleError(err);
          return of('Произошла ошибка');
        }),
      )
      .toPromise();*/
  }

  createThread(): Promise<any> {
    return this.openAI.beta.threads.create();

    /*return this.httpService
      .post(`https://api.openai.com/v1/threads`, body, {
        headers: this.headers,
      })
      .pipe(
        map(({ data }) => data),
        catchError((err) => {
          this.handleError(err);
          return of('Произошла ошибка');
        }),
      )
      .toPromise();*/
  }

  async runAssistantByThread(payload: { thread_id: string }): Promise<any> {
    const data: RunCreateParamsBase = {
      assistant_id: process.env.ASSISTANT_ID,
    };

    return this.openAI.beta.threads.runs.create(payload.thread_id, { ...data });

    /* return this.httpService
      .post(
        `https://api.openai.com/v1/threads/${payload.thread_id}/runs`,
        data,
        { headers: this.headers },
      )
      .pipe(
        tap(() => this.logger.log('Run Assistant initiated')),
        map(({ data }) => data),
        catchError((err) => {
          this.handleError(err);
          return of('Произошла ошибка');
        }),
      )
      .toPromise(); */
  }

  async retrieveRun(thread_id: string, run_id: string): Promise<any> {
    return this.openAI.beta.threads.runs.retrieve(thread_id, run_id);

    /* return this.httpService
      .get(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`, {
        headers: this.headers,
      })
      .pipe(
        map((res) => res.data),
        tap((res) => this.logger.log('Run retrieved', res)),
        catchError((err) => {
          this.handleError(err);
          return of('Произошла ошибка');
        }),
      )
      .toPromise(); */
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
