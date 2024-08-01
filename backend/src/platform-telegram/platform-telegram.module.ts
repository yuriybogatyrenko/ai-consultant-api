import { forwardRef, Module } from '@nestjs/common';
import { PlatformTelegramController } from './platform-telegram.controller';
import { PlatformTelegramService } from './platform-telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformTelegramSetting } from './entity/platform-telegram.entity';
import { ContactsModule } from 'src/contacts/contacts.module';
import { GptApiModule } from 'src/gpt-api/gpt-api.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    forwardRef(() => GptApiModule),
    forwardRef(() => AccountsModule),
    TypeOrmModule.forFeature([PlatformTelegramSetting]),
    ContactsModule,
  ],
  controllers: [PlatformTelegramController],
  providers: [PlatformTelegramService],
  exports: [PlatformTelegramService],
})
export class PlatformTelegramModule {}
