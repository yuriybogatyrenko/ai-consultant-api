import { IsBoolean, IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class ActivatePlatformDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  access_token: string;

  @IsJSON()
  additional_settings: Record<string, any>;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
