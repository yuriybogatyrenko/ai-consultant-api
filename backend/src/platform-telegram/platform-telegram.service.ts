import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as TelegramBot from 'node-telegram-bot-api';
import { Repository } from 'typeorm';
import { PlatformTelegramSetting } from './entity/platform-telegram.entity';
import { CreateTelegramSettingsDto } from './dto/create-telegram-settings.dto';
import { ContactsService } from 'src/contacts/contacts.service';
import { GptApiService } from 'src/gpt-api/gpt-api.service';
import { PlatformsEnum } from 'src/enums/platforms.enum';
import { ContactMessage } from 'src/contacts/entity/contact-message.entity';

@Injectable()
export class PlatformTelegramService {
  private bots = new Map<string, TelegramBot>();

  constructor(
    @InjectRepository(PlatformTelegramSetting)
    private readonly telegramSettingsRepository: Repository<PlatformTelegramSetting>,
    private readonly contactService: ContactsService,
    @Inject(forwardRef(() => GptApiService))
    private readonly gptApiService: GptApiService,
  ) {}

  async onModuleInit() {
    const bots = await this.telegramSettingsRepository.find();
    bots.forEach((bot) => this.initializeBot(bot));
  }

  async initializeBot(bot: PlatformTelegramSetting) {
    if (!this.bots.has(bot.id)) {
      const telegramBot = new TelegramBot(bot.access_token, { polling: true });
      telegramBot.on('message', (msg) => this.handleMessage(bot.id, msg));
      this.bots.set(bot.id, telegramBot);
    }
  }

  async togglePlatform(
    userId: string,
    body: Partial<CreateTelegramSettingsDto>,
  ) {
    try {
      const bot = await this.telegramSettingsRepository.findOne({
        where: { id: body.id },
        relations: { account: true },
      });

      if (!bot || userId !== bot.account.owner.id) {
        throw new ForbiddenException(
          'You are not authorized to perform this action',
        );
      }

      if (body.isActive) {
        this.initializeBot(bot);
      } else {
        this.deactivateBot(body.id);
      }
      bot.is_active = body.isActive;
      this.telegramSettingsRepository.save(bot);
      return { success: true };
    } catch (err) {
      console.error(err);
    }
  }

  async deactivateBot(botId: string) {
    const bot = this.bots.get(botId);
    if (bot) {
      console.log('found TG bot and cancel subscription');
      await this.telegramSettingsRepository.update(botId, {
        is_active: false,
      });
      bot.stopPolling();
      this.bots.delete(botId);
    }
  }

  async addBot(userId: string, settings: CreateTelegramSettingsDto) {
    const newBot = this.telegramSettingsRepository.create({
      access_token: settings.accessToken,
      bot_username: settings.botUsername,
      is_active: settings.isActive,
    });
    const savedBot = await this.telegramSettingsRepository.save(newBot);
    this.initializeBot(savedBot);
    return savedBot;
  }

  private async handleMessage(botId: string, msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const text = msg.text;

    const botDb = await this.telegramSettingsRepository.findOne({
      where: { id: botId },
      relations: { account: true },
    });

    const { message, thread, contact } =
      await this.contactService.createMessageFromTelegram(msg, botDb.account);

    const messageDb: ContactMessage = await this.gptApiService.sendMessageToGpt(
      botDb,
      message,
      thread,
      contact,
    );

    console.log('GPT response:', messageDb);
    const bot = this.bots.get(botId);
    if (bot) {
      const telegramMesssage = await bot.sendMessage(chatId, messageDb.content);

      messageDb.platoform_message_id = telegramMesssage.message_id.toString();
      messageDb.platform = PlatformsEnum.TELEGRAM;
      await this.contactService.updateContactMessage(messageDb);
    }
  }

  async getAccountBots(accountId: string) {
    return this.telegramSettingsRepository.find({
      where: { account: { account_id: accountId } },
    });
  }
}
