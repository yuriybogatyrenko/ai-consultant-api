import { forwardRef, Module } from '@nestjs/common';
import { GptApiController } from './gpt-api.controller';
import { GptApiService } from './gpt-api.service';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [forwardRef(() => AccountsModule)],
  controllers: [GptApiController],
  providers: [GptApiService],
  exports: [GptApiService],
})
export class GptApiModule {}
