import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersService: UsersService) {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    console.log(`Validating user: ${email}`);
    const user = await this.usersService.findOneByEmail(email);
    return !user; // If user does not exist, validation passes
  }

  defaultMessage(args: ValidationArguments): string {
    return 'User with username $value already exists';
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  console.log('IsUserAlreadyExist');
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
