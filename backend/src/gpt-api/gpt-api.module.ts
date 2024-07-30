import { Module } from '@nestjs/common';
import { GptApiController } from './gpt-api.controller';
import { GptApiService } from './gpt-api.service';
import { UsersModule } from 'src/users/users.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [UsersModule, AccountsModule],
  controllers: [GptApiController],
  providers: [GptApiService],
})
export class GptApiModule {}
