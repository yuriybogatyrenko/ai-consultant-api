import { Module } from '@nestjs/common';
import { GptApiController } from './gpt-api.controller';
import { GptApiService } from './gpt-api.service';

@Module({
  controllers: [GptApiController],
  providers: [GptApiService]
})
export class GptApiModule {}
