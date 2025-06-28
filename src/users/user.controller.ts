import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Controller("/api")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/auth/register")
  register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }
  @Post("/auth/login")
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }
}
