import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRegistrationDto } from './dto/user-registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: UserRegistrationDto) {
    return this.usersService.register(user);
  }

  async userHasPermission(
    userId: number,
    permissionName: string,
  ): Promise<boolean> {
    console.log(userId);
    if (!userId) {
      throw new Error('Invalid user ID');
    }
    const user = await this.usersService.findOneUser({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    console.log(user);

    return user.roles.some((role) =>
      role.permissions.some((permission) => permission.name === permissionName),
    );
  }
}
