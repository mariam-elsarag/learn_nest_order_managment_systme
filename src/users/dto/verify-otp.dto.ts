import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
  Length,
} from "class-validator";

export class SendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6, { message: "OTP must be exactly 6 digits" })
  otp: string;
}
