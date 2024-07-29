import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entity/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    private usersService: UsersService,
  ) {}

  findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  async findOne(accountId: string): Promise<Account> {
    const account = await this.accountsRepository.findOneBy({
      account_id: accountId,
    });
    if (!account) {
      throw new NotFoundException(`Account not found`);
    }
    return account;
  }

  async create(
    createAccountDto: CreateAccountDto,
    userId: string,
  ): Promise<Account> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const account = this.accountsRepository.create({
      ...createAccountDto,
      owner: user,
    });
    return this.accountsRepository.save(account);
  }

  async update(
    accountId: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.accountsRepository.preload({
      account_id: accountId,
      ...updateAccountDto,
    });
    if (!account) {
      throw new NotFoundException(`Account not found`);
    }

    return this.accountsRepository.save(account);
  }

  async remove(accountId: string): Promise<void> {
    const account = await this.findOne(accountId);
    await this.accountsRepository.remove(account);
  }
}
