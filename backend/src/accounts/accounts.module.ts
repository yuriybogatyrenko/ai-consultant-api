import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { PlatformInstagramModule } from 'src/platform-instagram/platform-instagram.module';
import { PlatformTelegramModule } from 'src/platform-telegram/platform-telegram.module';
import { PlatformWhatsappModule } from 'src/platform-whatsapp/platform-whatsapp.module';
import { UsersModule } from 'src/users/users.module';
import { PlatformInstagramSetting } from 'src/platform-instagram/entity/platform-instagram.entity';
import { PlatformTelegramSetting } from 'src/platform-telegram/entity/platform-telegram.entity';
import { PlatformWhatsAppSetting } from 'src/platform-whatsapp/entity/platform-whatsapp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      PlatformInstagramSetting,
      PlatformTelegramSetting,
      PlatformWhatsAppSetting,
    ]),
    PlatformInstagramModule,
    PlatformTelegramModule,
    PlatformWhatsappModule,
    UsersModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
