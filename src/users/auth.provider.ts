import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import * as bcrypt from "bcryptjs";
import { JwtTypePayload } from "src/utils/types";
import { MailService } from "src/mail/mail.service";
import { EmailType } from "./../utils/types";
import { SendOtpDto, VerifyOtpDto } from "./dto/verify-otp.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}

  /**
   * Create new user
   * @param body data for creating new users
   * @returns (full_name,role,email)
   */
  async register(body: RegisterDto): Promise<RegisterResponseDto> {
    const { email, password, full_name } = body;
    const user = await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase() },
    });
    if (user) {
      throw new BadRequestException("Email already exist");
    }

    const hashedPassword = await this.hashPassword(password);

    let newUser = this.userRepository.create({
      email: email.toLocaleLowerCase(),
      full_name,
      password: hashedPassword,
    });
    newUser = await this.userRepository.save(newUser);
    const otp = await this.generateOtp(3, newUser);
    await this.mailerService.activateAccountEmail(email, full_name, otp);
    return new RegisterResponseDto(newUser);
  }
  /**
   * Login
   * @param body (email,passwrod)
   * @returns (id,token,full_name,email,role)
   */
  async login(body: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = body;
    const user = await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase() },
    });
    if (!user) {
      throw new BadRequestException(
        "The email or password you entered is incorrect.",
      );
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException(
        "The email or password you entered is incorrect.",
      );
    }
    const payload: JwtTypePayload = { id: user.id, role: user.role };
    const token = await this.generateJWT(payload);

    return new LoginResponseDto({ ...user, token });
  }

  //======================
  //Send otp
  //======================
  /**
   *Send otp
   * @param email
   * @param type (forget, activate)
   * @returns
   */
  async sendOtp(body: SendOtpDto, type: EmailType) {
    const { email } = body;
    // find this user
    const user = await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase() },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const otp = await this.generateOtp(3, user);
    console.log(type.type, "ty");
    if (type.type === "forget") {
      await this.mailerService.forgetPasswordEmail(email, user.full_name, otp);
    } else {
      await this.mailerService.activateAccountEmail(email, user.full_name, otp);
    }
    return { message: "OTP sent successfully" };
  }
  //======================
  //verify otp
  //======================

  async verify(body: VerifyOtpDto, type: EmailType) {
    const { email, otp } = body;
    // find this user
    const user = await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase() },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // check if he has otp
    if (!user.otp || !user.otpExpiredAt) {
      throw new BadRequestException("No OTP was generated for this user");
    }
    // check expire
    if (user.otpExpiredAt.getTime() < Date.now()) {
      throw new BadRequestException("OTP expired");
    }

    // verify otp
    if (!(await bcrypt.compare(otp, user.otp))) {
      throw new BadRequestException("Invalid Otp");
    }
    if (type.type === "forget") {
      user.isForgetPassword = true;
    } else {
      user.isAccountVerify = true;
      user.otpExpiredAt = null;
    }
    user.otp = null;
    await this.userRepository.save(user);
    return { message: "OTP sent successfully" };
  }

  //======================
  //change password
  //======================
  async changePassword(body: ChangePasswordDto) {
    const { email, password } = body;
    // find this user
    const user = await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase() },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // check if her verify otp first
    if (!user.isForgetPassword && !user.otp) {
      throw new BadRequestException(
        "Please verify the OTP before changing your password",
      );
    }
    const newPassword = await this.hashPassword(password);
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.isForgetPassword = false;
    await this.userRepository.save(user);
    return { message: "Password changed successfully" };
  }
  //______________________________________________

  /**
   *Hashing password
   * @param password plain text password
   * @returns hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Generate JWT token
   * @param payload (id,role)
   * @returns toke
   */
  private generateJWT(payload: JwtTypePayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   * Generate otp
   * @param expire  time when otp will be expired
   * @param user  to set user has otp and expire otp time for this otp
   * @returns  otp
   */
  private async generateOtp(expire: number, user: User) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await this.hashPassword(otp);
    user.otp = hashedOtp;
    user.otpExpiredAt = new Date(Date.now() + expire * 60 * 1000);
    await this.userRepository.save(user);
    return otp;
  }
}
