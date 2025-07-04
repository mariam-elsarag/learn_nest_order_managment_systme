import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

import { JwtTypePayload } from "src/utils/types";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { UserResponseDto } from "./dto/user.dto";
import { Role } from "src/utils/enum";
import { AuthProvider } from "./auth.provider";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) {}

  /**
   * Create new user
   * @param body data for creating new users
   * @returns (full_name,role,email)
   */
  async register(body: RegisterDto): Promise<RegisterResponseDto> {
    return this.authProvider.register(body);
  }
  /**
   * Login
   * @param body (email,passwrod)
   * @returns (id,token,full_name,email,role)
   */
  async login(body: LoginDto): Promise<LoginResponseDto> {
    return this.authProvider.login(body);
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
   * Delete user
   * @description CASCADE products when delete user
   * @param id user id
   *
   */
  async delete(userId: number, payload: JwtTypePayload): Promise<void> {
    const user = await this.userDetails(userId);
    if (user.id === payload.id || payload.role === Role.ADMIN) {
      await this.userRepository.delete(userId);
    } else {
      throw new ForbiddenException(
        "Access denied,you are not allow to preform this action",
      );
    }
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
    file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const user = await this.userDetails(id);
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && key !== "password") {
        user[key] = value;
      }
    });
    if (body.password) {
      user.password = await this.authProvider.hashPassword(body.password);
      user.passwordChangedAt = new Date();
    }
    if (file && file.fieldname === "avatar") {
      if (user.avatar) {
        const imagePath = join(
          process.cwd(),
          `./mediaFiles/user/${user.avatar}`,
        );
        // this will delete image
        if (existsSync(imagePath)) {
          unlinkSync(imagePath);
        }
      }

      user.avatar = file.filename ?? null;
    }
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
}
