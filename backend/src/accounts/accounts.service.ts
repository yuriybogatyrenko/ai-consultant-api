import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entity/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UsersService } from 'src/users/users.service';
import { PlatformTelegramSetting } from 'src/platform-telegram/entity/platform-telegram.entity';
import { PlatformWhatsAppSetting } from 'src/platform-whatsapp/entity/platform-whatsapp.entity';
import { PlatformInstagramSetting } from 'src/platform-instagram/entity/platform-instagram.entity';
import { PlatformTelegramService } from 'src/platform-telegram/platform-telegram.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(PlatformTelegramSetting)
    private telegramSettingsRepository: Repository<PlatformTelegramSetting>,
    @InjectRepository(PlatformWhatsAppSetting)
    private whatsappSettingsRepository: Repository<PlatformWhatsAppSetting>,
    @InjectRepository(PlatformInstagramSetting)
    private instagramSettingsRepository: Repository<PlatformInstagramSetting>,
    private usersService: UsersService,
    private telegramSettingsService: PlatformTelegramService,
  ) {}

  findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  async findOne(accountId: string): Promise<Account> {
    const account = await this.accountsRepository.findOneBy({
      account_id: accountId,
    });
    if (!account) {
      throw new NotFoundException(`Account not found`);
    }
    return account;
  }

  async create(
    createAccountDto: CreateAccountDto,
    userId: string,
  ): Promise<Account> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const account = this.accountsRepository.create({
      ...createAccountDto,
      owner: user,
    });
    return this.accountsRepository.save(account);
  }

  async update(
    accountId: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.accountsRepository.preload({
      account_id: accountId,
      ...updateAccountDto,
    });
    if (!account) {
      throw new NotFoundException(`Account not found`);
    }

    return this.accountsRepository.save(account);
  }

  async remove(accountId: string): Promise<void> {
    const account = await this.findOne(accountId);
    await this.accountsRepository.remove(account);
  }

  async saveTelegramSettings(
    userId: string,
    accountId: string,
    settings: { [key: string]: any },
  ): Promise<Account> {
    const account = await this.accountsRepository.findOneBy({
      account_id: accountId,
      owner: { id: userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    let telegramSettings = this.telegramSettingsRepository.create({
      ...settings,
      account,
    });

    const telegramSettingsItem =
      await this.telegramSettingsRepository.save(telegramSettings);

    account.telegram_settings = telegramSettingsItem;
    await this.accountsRepository.save(account);

    this.telegramSettingsService.initializeBot(telegramSettingsItem);

    return account;
  }

  async saveGptApiKey(userId: string, accountId: string, apiKey: string) {
    const account = await this.accountsRepository.findOneBy({
      account_id: accountId,
      owner: { id: userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.gpt_api_key = apiKey;
    return this.accountsRepository.save(account);
  }
}
