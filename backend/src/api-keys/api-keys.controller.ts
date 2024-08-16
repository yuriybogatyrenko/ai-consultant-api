import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiKeysService } from './api-keys.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createApiKey(@Request() req: any): Promise<any> {
    const user = req.user;
    const key = uuidv4();
    const apiKey = await this.apiKeysService.createApiKey(user.userId, key);
    return { apiKey: apiKey.key };
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getApiKeys(@Request() req: any): Promise<any> {
    return this.apiKeysService.getApiKeys(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke')
  async revokeApiKey(@Request() req: any): Promise<any> {
    // console.log(req.user);
    return this.apiKeysService.revokeApiKey(req.user.userId, req.body.apiKeyId);
  }
}
