import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PlatformTelegramService } from './platform-telegram.service';
import { GetUser } from 'src/users/decoratorts/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTelegramSettingsDto } from './dto/create-telegram-settings.dto';

@Controller('platform-telegram')
export class PlatformTelegramController {
  constructor(private readonly telegramService: PlatformTelegramService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/toggle')
  async togglePlatform(
    @GetUser('userId') userId: string,
    @Body() CreateTelegramSettingsDto: Partial<CreateTelegramSettingsDto>,
  ) {
    if (!CreateTelegramSettingsDto.id) {
      throw new BadRequestException('Bot ID is required');
    }
    return this.telegramService.togglePlatform(
      userId,
      CreateTelegramSettingsDto,
    );
  }

  @Post('webhook/:id')
  async handleWebhook(@Param('id') id: string, @Body() body: any) {
    console.log('webhook fire');
    return this.telegramService.handleUpdate(id, body);
  }
}
