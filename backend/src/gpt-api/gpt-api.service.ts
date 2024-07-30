import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class GptApiService {
  openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  getAssistants() {}

  createAssistant() {}

  updateAssistant() {}
}
