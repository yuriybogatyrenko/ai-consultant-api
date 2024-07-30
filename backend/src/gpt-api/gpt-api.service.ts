import { Injectable, UnauthorizedException } from '@nestjs/common';
import OpenAI from 'openai';
import { AccountsService } from 'src/accounts/accounts.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GptApiService {
  constructor(private accountsService: AccountsService) {}
  async getAssistants(userId: string, accountId: string) {
    console.log('userId', userId);
    const account = await this.accountsService.findOne(accountId);
    console.log('account', account);

    if (account.owner.id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    const openai = new OpenAI({ apiKey: account.gpt_api_key });

    return account;
  }

  createAssistant() {}

  updateAssistant() {}
}
