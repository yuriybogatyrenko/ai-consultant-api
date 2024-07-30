import { Module } from '@nestjs/common';
import { PlatformWhatsappController } from './platform-whatsapp.controller';
import { PlatformWhatsappService } from './platform-whatsapp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformWhatsAppSetting } from './entity/platform-whatsapp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformWhatsAppSetting])],
  controllers: [PlatformWhatsappController],
  providers: [PlatformWhatsappService],
  exports: [PlatformWhatsappService],
})
export class PlatformWhatsappModule {}
