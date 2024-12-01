import { IsString, IsEmail, IsNotEmpty, IsEnum, IsPhoneNumber } from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  carrier: string;

  @IsPhoneNumber(null) 
  @IsNotEmpty()
  phone: string;

  @IsEnum(Role) 
  @IsNotEmpty()
  role: Role;
}