import { Exclude, Expose } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from "class-validator";
import { Role } from "src/utils/enum";

export class LoginDto {
  @IsEmail()
  @MaxLength(250)
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

@Exclude()
export class LoginResponseDto {
  @Expose()
  id: number;

  @Expose()
  token: string;

  @Expose()
  role: Role;

  @Expose()
  email: string;
  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
