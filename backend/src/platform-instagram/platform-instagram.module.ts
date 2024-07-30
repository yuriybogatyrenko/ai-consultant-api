import { Module } from '@nestjs/common';
import { PlatformInstagramController } from './platform-instagram.controller';
import { PlatformInstagramService } from './platform-instagram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformInstagramSetting } from './entity/platform-instagram.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformInstagramSetting])],
  controllers: [PlatformInstagramController],
  providers: [PlatformInstagramService],
  exports: [PlatformInstagramService],
})
export class PlatformInstagramModule {}
