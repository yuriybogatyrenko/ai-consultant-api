import { Injectable } from '@nestjs/common';
import { AccountTeamMember } from './entity/account-team-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountTeamMemberDto } from './dto/create-account-team-member.dto';

@Injectable()
export class AccountTeamService {
  constructor(
    @InjectRepository(AccountTeamMember)
    private teamMembersRepository: Repository<AccountTeamMember>,
  ) {}

  async addTeamMember(
    createTeamMemberDto: CreateAccountTeamMemberDto,
  ): Promise<AccountTeamMember> {
    const teamMember = this.teamMembersRepository.create(createTeamMemberDto);
    return this.teamMembersRepository.save(teamMember);
  }

  async findAllByAccount(accountId: string): Promise<AccountTeamMember[]> {
    return this.teamMembersRepository.find({
      where: { account: { account_id: accountId } },
    });
  }

  async updatePermissions(
    memberId: number,
    permissions: Record<string, any>,
  ): Promise<void> {
    await this.teamMembersRepository.update(memberId, { permissions });
  }
}
