import { Controller, Get } from '@nestjs/common';

@Controller('platform-instagram')
export class PlatformInstagramController {
  constructor() {}

  @Get('oauth/callback')
  oauthRedirect() {
    return 'Instagram OAuth Redirect';
  }
}
