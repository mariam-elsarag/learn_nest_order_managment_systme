import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CURETNT_USER_KEY } from "src/utils/constant";
import { currentUser } from "./decorators/user.decorators";
import { jwtTypePayload } from "src/utils/types";

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

  @Get("/user")
  @UseGuards(AuthGuard)
  currentUserDetails(@currentUser() payload: jwtTypePayload) {
    const { id } = payload;
    return this.userService.userDetails(id);
  }
}
