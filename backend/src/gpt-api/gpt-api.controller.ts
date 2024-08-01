import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GptApiService } from './gpt-api.service';
import { GetUser } from 'src/users/decoratorts/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  Assistant,
  AssistantCreateParams,
} from 'openai/resources/beta/assistants';

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

  @Post()
  createAssistant(
    @GetUser('userId') userId: string,
    @Query('accountId') accountId: string,
    @Body() assistant: AssistantCreateParams,
  ) {
    if (!userId || !assistant) {
      throw new NotFoundException('Missing required parameters');
    }
    return this.gptApiService.createAssistant(userId, accountId, assistant);
  }

  @Put(':id')
  updateAssistant(
    @GetUser('userId') userId: string,
    @Query('accountId') accountId: string,
    @Body() assistant: Assistant,
  ) {
    if (!userId || !accountId || !assistant) {
      throw new NotFoundException('Missing required parameters');
    }
    return this.gptApiService.updateAssistant(userId, accountId, assistant);
  }
}
