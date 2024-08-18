import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CustomValidationPipe } from 'src/pipes/custom-validation.pipe';
import { AuthService } from './auth.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<void> {
    console.log('Facebook login');
    // Facebook login redirects to this method, but we don't need to handle anything here
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginCallback(@Req() req: any) {
    // Successful authentication, redirect or respond with JWT
    return {
      message: 'Facebook authentication successful',
      user: req.user,
    };
  }
}
