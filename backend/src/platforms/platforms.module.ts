import { Module } from '@nestjs/common';
import { PlatformsController } from './platforms.controller';
import { PlatformsService } from './platforms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './entity/platform.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { InstagramSetting } from './entity/platform-instagram.entity';
import { WhatsAppSetting } from './entity/platform-whatsapp-settings.entity';
import { TelegramSetting } from './entity/platform-telegram.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Platform,
      InstagramSetting,
      WhatsAppSetting,
      TelegramSetting,
    ]),
    UsersModule,
    AuthModule,
  ],
  controllers: [PlatformsController],
  providers: [PlatformsService],
})
export class PlatformsModule {}
