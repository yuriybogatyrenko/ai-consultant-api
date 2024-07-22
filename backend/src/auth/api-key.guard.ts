import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from 'src/api-keys/api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const apiKeyRecord = await this.apiKeysService.validateApiKey(apiKey);
    if (!apiKeyRecord) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Attach user to request
    request.user = apiKeyRecord.user;
    return true;
  }
}
