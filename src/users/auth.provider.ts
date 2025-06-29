import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import * as bcrypt from "bcryptjs";
import { JwtTypePayload } from "src/utils/types";
@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
}
