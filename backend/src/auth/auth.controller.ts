import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CustomValidationPipe } from 'src/pipes/custom-validation.pipe';
import { AuthService } from './auth.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @UsePipes(new CustomValidationPipe())
  async register(@Body() req: UserRegistrationDto) {
    return this.authService.register(req);
  }

  @Get('facebook')
  async facebookLogin(@Res() res: Response) {
    console.log('facebook login', res);
    const redirect_uri = `${this.configService.get('BACKEND_APP_URL')}/auth/facebook/callback`;
    const client_id = this.configService.get('FACEBOOK_APP_ID');

    // Redirect to Facebook's OAuth dialog
    res.redirect(
      'https://www.facebook.com/v20.0/dialog/oauth?client_id=' +
        client_id +
        '&redirect_uri=' +
        redirect_uri +
        '&state=email',
    );
  }

  @Get('facebook/callback')
  async facebookCallback(@Query('code') code: string, @Res() res: Response) {
    const redirect_uri = 'https://localhost:3000/auth/facebook/callback';
    const client_id = 'your-facebook-app-id';
    const client_secret = 'your-facebook-app-secret';

    // Exchange code for access token
    const tokenResponse = await firstValueFrom(
      this.httpService.get(
        `https://graph.facebook.com/v3.2/oauth/access_token`,
        {
          params: {
            client_id,
            redirect_uri,
            client_secret,
            code,
          },
        },
      ),
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch user information
    const userResponse = await firstValueFrom(
      this.httpService.get(`https://graph.facebook.com/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,email',
        },
      }),
    );

    // Handle user login or registration here

    // Redirect or respond to your frontend
    res.redirect(
      `https://localhost:8080?user=${JSON.stringify(userResponse.data)}`,
    );
  }
}
