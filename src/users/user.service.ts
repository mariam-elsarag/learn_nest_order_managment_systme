import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/auth.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
}
