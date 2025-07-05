import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class ChangePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
