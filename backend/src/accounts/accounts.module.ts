import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { PlatformInstagramModule } from 'src/platform-instagram/platform-instagram.module';
import { PlatformTelegramModule } from 'src/platform-telegram/platform-telegram.module';
import { PlatformWhatsappModule } from 'src/platform-whatsapp/platform-whatsapp.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    PlatformInstagramModule,
    PlatformTelegramModule,
    PlatformWhatsappModule,
    UsersModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
