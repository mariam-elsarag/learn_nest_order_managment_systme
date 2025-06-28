import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from "class-validator";
import { Role } from "src/utils/enum";

class UserType {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  full_name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(250)
  email?: string;
}

export class UpdateUserDto extends UserType {
  @IsOptional()
  @IsStrongPassword()
  password?: string;
}

export class AdminUpdateUserDataDto extends UserType {
  @IsOptional()
  role?: Role;
}
