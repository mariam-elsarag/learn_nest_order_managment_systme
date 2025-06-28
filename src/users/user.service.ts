import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { jwtTypePayload } from "src/utils/types";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { UserListResponseDto } from "./dto/user.dto";

@Injectable()
export class UserService {
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
    const payload: jwtTypePayload = { id: user.id, role: user.role };
    const token = await this.generateJWT(payload);

    return new LoginResponseDto({ ...user, token });
  }
  async userDetails(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return { id: user.id, full_name: user.full_name, role: user.role };
  }

  /**
   * Get all users (admin)
   * @returns [{full_name,role}]
   */
  async usersList() {
    const users = await this.userRepository.find();
    return users.map((user) => new UserListResponseDto(user));
  }
  /**
   * Generate JWT token
   * @param payload (id,role)
   * @returns toke
   */
  private generateJWT(payload: jwtTypePayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
