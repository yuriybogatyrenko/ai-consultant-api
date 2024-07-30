import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  isString,
} from 'class-validator';

export class CreateTelegramSettingsDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly accessToken: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly botUsername: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly isActive: boolean;
}
