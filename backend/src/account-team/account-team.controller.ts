import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AccountTeamService } from './account-team.service';
import { CreateAccountTeamMemberDto } from './dto/create-account-team-member.dto';
import { UpdateAccountTeamMemberPermissionsDto } from './dto/update-account-team-member-permissions.dto';

@Controller('account-team')
export class AccountTeamController {
  constructor(private readonly accountTeamService: AccountTeamService) {}

  @Post()
  addTeamMember(@Body() createTeamMemberDto: CreateAccountTeamMemberDto) {
    return this.accountTeamService.addTeamMember(createTeamMemberDto);
  }

  @Get('account/:accountId')
  findAllByAccount(@Param('accountId', ParseIntPipe) accountId: string) {
    return this.accountTeamService.findAllByAccount(accountId);
  }

  @Patch(':memberId/permissions')
  updatePermissions(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() updatePermissionsDto: UpdateAccountTeamMemberPermissionsDto,
  ) {
    return this.accountTeamService.updatePermissions(
      memberId,
      updatePermissionsDto.permissions,
    );
  }
}
