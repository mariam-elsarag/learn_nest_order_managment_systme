import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Role } from "src/utils/enum";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  full_name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(250)
  email?: string;
}

export class AdminUpdateUserDataDto extends UpdateUserDto {
  @IsOptional()
  role?: Role;
}
