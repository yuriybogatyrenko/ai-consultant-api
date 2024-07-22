import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeyEntity } from './api-keys.entity';
import { ApiKeysService } from './api-keys.service';

@Module({
  controllers: [ApiKeysController],
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
