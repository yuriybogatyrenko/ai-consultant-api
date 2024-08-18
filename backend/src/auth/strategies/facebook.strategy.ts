// src/auth/strategies/facebook.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: `${configService.get('BACKEND_APP_URL')}/auth/facebook/callback`,
      scope: 'email',
      profileFields: ['id', 'name', 'emails', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { id, name, emails } = profile;
    const user = {
      facebookId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };

    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
