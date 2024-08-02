import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAccountCustomFieldDto {
  @IsString()
  @IsNotEmpty()
  field_name: string;

  @IsString()
  field_value: string;

  @IsEnum(['text', 'number', 'date', 'boolean'])
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;
}
