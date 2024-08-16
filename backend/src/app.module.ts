import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor } from './interceptors/http-logging.interceptor';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { typeOrmConfig } from 'db/orm.config';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { BillingModule } from './billing/billing.module';
import { AccountTeamModule } from './account-team/account-team.module';
import { ContactsModule } from './contacts/contacts.module';
import { PlatformTelegramModule } from './platform-telegram/platform-telegram.module';
import { PlatformWhatsappModule } from './platform-whatsapp/platform-whatsapp.module';
import { PlatformInstagramModule } from './platform-instagram/platform-instagram.module';
import { GptApiModule } from './gpt-api/gpt-api.module';
import { AccountCustomFieldsModule } from './account-custom-fields/account-custom-fields.module';
import { ContactCustomFieldsModule } from './contact-custom-fields/contact-custom-fields.module';

@Module({
  imports: [
    ChatGptModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET') || 'secretKey',
          signOptions: { expiresIn: '3600m' },
        };
      },
    }),
    HttpModule,
    ApiKeysModule,
    UsersModule,
    PassportModule,
    AuthModule,
    AccountsModule,
    BillingModule,
    AccountTeamModule,
    ContactsModule,
    PlatformTelegramModule,
    PlatformWhatsappModule,
    PlatformInstagramModule,
    GptApiModule,
    AccountCustomFieldsModule,
    ContactCustomFieldsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    AuthService,
    JwtStrategy,
  ],
})
export class AppModule {}
