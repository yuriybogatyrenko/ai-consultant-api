import {
  Body,
  Controller,
  Get,
  Post,
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
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async facebookLoginCallback(@Req() req: any, @Res() res: Response) {
    // Successful authentication, redirect or respond with JWT or user info
    const user = req.user;
    console.log('Facebook login callback', user);

    // For example, you could redirect the user to your frontend with a JWT in the query params
    return res.redirect(
      `https://stage1.ai.myassistants.app/auth/login?token=${user.accessToken}`,
    );
  }
}
