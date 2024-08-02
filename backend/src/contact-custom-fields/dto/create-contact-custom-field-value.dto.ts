import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';

export class CreateContactCustomFieldDto {
  @IsOptional()
  @IsNumber()
  custom_field_id?: number;

  @IsString()
  field_name: string;

  @IsEnum(['text', 'number', 'date', 'boolean'])
  type: string;

  @IsOptional()
  @IsString()
  description?: string;
}
