import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyEntity } from './api-keys.entity';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private apiKeysRepository: Repository<ApiKeyEntity>,
  ) {}

  async createApiKey(accountId: string, key: string): Promise<ApiKeyEntity> {
    const apiKey: ApiKeyEntity[] = this.apiKeysRepository.create([
      { key, account: { account_id: accountId } },
    ]);

    // console.log(apiKey);

    return this.apiKeysRepository.save(apiKey[0]);
  }

  async getApiKeys(accountId: string) {
    return this.apiKeysRepository.findBy({
      account: { account_id: accountId },
    });
  }

  async validateApiKey(key: string): Promise<ApiKeyEntity | null> {
    return this.apiKeysRepository.findOne({
      where: { key },
      relations: { account: true },
    });
  }

  async revokeApiKey(accountId: string, apiKey: string) {
    return this.apiKeysRepository.delete({
      account: { account_id: accountId },
      id: apiKey,
    });
  }
}
