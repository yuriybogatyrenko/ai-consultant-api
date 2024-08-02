import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateContactCustomFieldValueDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  custom_field_id: number;

  @IsNumber()
  contact_id: number;

  @IsOptional()
  @IsString()
  value?: string;
}
