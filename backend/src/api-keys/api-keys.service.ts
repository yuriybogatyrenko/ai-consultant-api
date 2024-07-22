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

  async createApiKey(userId: string, key: string): Promise<ApiKeyEntity> {
    const apiKey: ApiKeyEntity[] = this.apiKeysRepository.create([
      { key, user: { id: userId } },
    ]);

    console.log(apiKey);

    return this.apiKeysRepository.save(apiKey[0]);
  }

  async getApiKeys(userId: string) {
    return this.apiKeysRepository.findBy({ user: { id: userId } });
  }

  async validateApiKey(key: string): Promise<ApiKeyEntity | null> {
    return this.apiKeysRepository.findOne({
      where: { key },
      relations: ['user'],
    });
  }

  async revokeApiKey(userId: string, apiKey: string) {
    return this.apiKeysRepository.delete({
      user: { id: userId },
      id: apiKey,
    });
  }
}
