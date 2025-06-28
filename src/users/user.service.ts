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
import { UserResponseDto } from "./dto/user.dto";

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

  //______________________________________________
  /**
   *
   * @param id user id
   * @returns (id,full_name,email,role,createdAt)
   */
  async userDetails(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return new UserResponseDto(user);
  }

  //______________________________________________
  /**
   * Delete user by id
   * @description CASCADE products when delete user
   * @param id user id
   *
   */
  async delete(id: number): Promise<void> {
    await this.userDetails(id);
    await this.userRepository.delete(id);
  }

  //______________________________________________
  /**
   * Update user data
   * @param id User id
   * @param body can be (full_name, email)
   * @returns id, full_name, role,createdAt
   */
  async updaterUserData<T extends Partial<User>>(
    id: number,
    body: T,
  ): Promise<UserResponseDto> {
    const user = await this.userDetails(id);
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined) {
        user[key] = value;
      }
    });

    const updatedUser = await this.userRepository.save(user);
    return new UserResponseDto(updatedUser);
  }

  //______________________________________________
  /**
   * Get all users (admin)
   * @returns [{full_name,email,role,createdAt}]
   */
  async usersList() {
    const users = await this.userRepository.find();
    return users.map((user) => new UserResponseDto(user));
  }

  //______________________________________________
  /**
   * Generate JWT token
   * @param payload (id,role)
   * @returns toke
   */
  private generateJWT(payload: jwtTypePayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
