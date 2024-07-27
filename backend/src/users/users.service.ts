import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegistrationDto } from 'src/auth/dto/user-registration.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async register(data: UserRegistrationDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.email = data.email;
    user.password = data.password; // Password will be hashed automatically
    return this.usersRepository.save(user);
  }

  async findOne(email: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async findOneUser(options: any): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne(options);
  }

  async findOneById(id: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
