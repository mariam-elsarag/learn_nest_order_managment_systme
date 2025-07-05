import { Exclude, Expose } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  IsOptional,
  IsString,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  @MaxLength(250)
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsString()
  @MaxLength(150)
  full_name: string;
}

@Exclude()
export class RegisterResponseDto {
  @Expose()
  full_name: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  token: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
