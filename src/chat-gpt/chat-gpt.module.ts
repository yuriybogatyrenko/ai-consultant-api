import { Module } from '@nestjs/common';
import { ChatGptController } from './chat-gpt.controller';
import { ChatGptService } from './chat-gpt.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ChatGptController],
  providers: [ChatGptService],
  imports: [HttpModule, ConfigModule],
})
export class ChatGptModule {}
