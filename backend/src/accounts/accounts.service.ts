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

  findOne(account_id: string): Promise<Account> {
    return this.accountsRepository.findOneBy({ account_id });
  }

  async create(
    createAccountDto: CreateAccountDto,
    user_id: string,
  ): Promise<Account> {
    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const account = this.accountsRepository.create(createAccountDto);
    account.owner = user;
    return this.accountsRepository.save(account);
  }

  async update(
    account_id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    await this.accountsRepository.update(account_id, updateAccountDto);
    return this.accountsRepository.findOneBy({ account_id });
  }

  async remove(account_id: string): Promise<void> {
    await this.accountsRepository.delete(account_id);
  }
}
