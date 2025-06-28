import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { jwtTypePayload } from "src/utils/types";

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
  async register(body: RegisterDto) {
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
    return {
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
    };
  }
  /**
   * Login
   * @param body (email,passwrod)
   * @returns (id,token,full_name,email,role)
   */
  async login(body: LoginDto) {
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

    return {
      id: user.id,
      token: token,
      full_name: user.full_name,
      role: user.role,
      email: user.email,
    };
  }
  async userDetails(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return { id: user.id, full_name: user.full_name, role: user.role };
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
