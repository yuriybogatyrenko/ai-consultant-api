import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role, UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { IsUserAlreadyExistConstraint } from './validators/is-user-already-exist.validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Role, Permission])],
  controllers: [UsersController],
  providers: [UsersService, IsUserAlreadyExistConstraint],
  exports: [UsersService, IsUserAlreadyExistConstraint],
})
export class UsersModule {}
