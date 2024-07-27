import { Module } from '@nestjs/common';
import { AccountTeamController } from './account-team.controller';
import { AccountTeamService } from './account-team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTeamMember } from './entity/account-team-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountTeamMember])],
  controllers: [AccountTeamController],
  providers: [AccountTeamService],
})
export class AccountTeamModule {}
