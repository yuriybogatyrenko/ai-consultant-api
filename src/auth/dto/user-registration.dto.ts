import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { IsUserAlreadyExist } from 'src/users/validators/is-user-already-exist.validator';

export class UserRegistrationDto {
  @IsEmail()
  @IsNotEmpty()
  @IsUserAlreadyExist({ message: 'Username $value already exists' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
