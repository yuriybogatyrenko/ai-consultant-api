import { Module } from '@nestjs/common';
import { PlatformTelegramController } from './platform-telegram.controller';
import { PlatformTelegramService } from './platform-telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformTelegramSetting } from './entity/platform-telegram.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformTelegramSetting])],
  controllers: [PlatformTelegramController],
  providers: [PlatformTelegramService],
})
export class PlatformTelegramModule {}
