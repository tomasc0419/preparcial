/* eslint-disable prettier/prettier */

import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  role_name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}