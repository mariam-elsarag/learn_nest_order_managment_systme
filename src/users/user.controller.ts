import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterDto } from "./dto/auth.dto";

@Controller("/api")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/auth/register")
  register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }
}
