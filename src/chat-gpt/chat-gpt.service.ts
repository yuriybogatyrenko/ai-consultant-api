import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
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
  private gptUrl: string;
  private gptApiKey: string;
  private headers;
  private openAI: OpenAI;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.gptApiKey = this.configService.get('GPT_API');

    this.openAI = new OpenAI({ apiKey: this.gptApiKey });

    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.gptApiKey}`,
      'OpenAI-Beta': 'assistants=v2',
    };
  }

  generateResponse(content: string, threadId: string): Promise<any> {
    const data = {
      // model: 'gpt-3.5-turbo',
      role: 'user',
      content,
    };

    return this.httpService
      .post<IGPTMessage>(
        `https://api.openai.com/v1/threads/${threadId}/messages`,
        data,
        { headers: this.headers },
      )
      .pipe(
        map(({ data }) => data.content[0].text.value),
        catchError((err) => {
          console.dir(err.response);
          this.logger.error(err);
          return of('Произошла ошибка');
        }),
      )
      .toPromise();
  }

  createThread(messages: string[]) {
    const body = {
      messages: messages.map((message) => {
        return {
          role: 'user',
          content: message,
        };
      }),
    };

    console.log(body);

    return this.httpService
      .post(`https://api.openai.com/v1/threads`, body, {
        headers: this.headers,
      })
      .pipe(
        map(({ data }) => {
          return data;
        }),
        catchError((err) => {
          console.dir(err.response);
          this.logger.error(err);
          return of('Произошла ошибка');
        }),
      )
      .toPromise();
  }

  async runAssistantByThread(thread) {
    const data = {
      assistant_id: 'asst_EHIgJXsOknU9rmXIYqcOJw6Q',
    };
    console.log('run activate', thread.thread_id);
    return this.httpService
      .post(
        `https://api.openai.com/v1/threads/${thread.thread_id}/runs`,
        data,
        { headers: this.headers },
      )
      .pipe(
        tap(() => {
          console.log('hi run tap');
        }),
        map(({ data }) => {
          console.log(data);
          return data;
        }),
        catchError((err) => {
          console.dir(err.response);
          this.logger.error(err);
          return of('Произошла ошибка');
        }),
      )
      .toPromise();
  }

  async retrieveRun(thread_id: string, run_id: string) {
    return this.httpService
      .get(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`, {
        headers: this.headers,
      })
      .pipe(
        tap(() => {
          console.log('hi retrieve run');
        }),
      )
      .toPromise();
  }
}
