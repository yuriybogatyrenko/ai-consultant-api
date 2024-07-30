import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './entity/account.entity';
import { GetUser } from 'src/users/decoratorts/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  async findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Account> {
    return this.accountsService.findOne(id);
  }

  @Post()
  async create(
    @GetUser('userId') user_id: string,
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return this.accountsService.create(createAccountDto, user_id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.accountsService.remove(id);
  }

  @Post(':accountId/telegram-settings')
  async saveTelegramSettings(
    @GetUser('userId') userId: string,
    @Param('accountId') accountId: string,
    @Body() settings: any,
  ): Promise<Account> {
    return this.accountsService.saveTelegramSettings(
      userId,
      accountId,
      settings,
    );
  }
}
