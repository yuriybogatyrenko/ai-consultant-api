import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomValidationPipe } from 'src/pipes/custom-validation.pipe';
import { AuthService } from './auth.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { LocalAuthGuard } from './local-auth.guard';

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
}
