import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GptApiService } from './gpt-api.service';
import { GetUser } from 'src/users/decoratorts/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('gpt-api')
export class GptApiController {
  constructor(private gptApiService: GptApiService) {}

  @Get()
  getAssistants(
    @GetUser('userId') userId: string,
    @Query('accountId') accountId: string,
  ) {
    if (!userId || !accountId) {
      throw new NotFoundException('Missing required parameters');
    }
    return this.gptApiService.getAssistants(userId, accountId);
  }
}
