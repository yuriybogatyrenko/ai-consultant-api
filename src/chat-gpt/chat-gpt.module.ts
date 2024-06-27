import { Module } from '@nestjs/common';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { ChatGptController } from './chat-gpt.controller';
import { ChatGptService } from './chat-gpt.service';

@Module({
  controllers: [ChatGptController],
  providers: [ChatGptService],
  imports: [ApiKeysModule],
})
export class ChatGptModule {}
