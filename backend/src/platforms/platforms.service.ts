import { Injectable } from '@nestjs/common';
import { Platform } from './entity/platform.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platform)
    private platformRepository: Repository<Platform>,
    private usersService: UsersService,
  ) {}

  async createPlatform(
    platformName: string,
    description?: string,
  ): Promise<Platform> {
    const platform = this.platformRepository.create({
      platform_name: platformName,
      description,
    });
    return this.platformRepository.save(platform);
  }

  async updatePlatform(
    id: string,
    platformName: string,
    description?: string,
    isActive?: boolean,
  ) {
    const platform = await this.platformRepository.findOneBy({ id });
    platform.platform_name = platformName;
    platform.description = description;
    if (isActive) platform.isActive = isActive;
    return this.platformRepository.save(platform);
  }

  async deletePlatform(id: string) {
    return this.platformRepository.delete({ id });
  }
}
