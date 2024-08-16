import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    HttpModule,
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
    ApiKeysModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, FacebookStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
