import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { CURETNT_USER_KEY } from "src/utils/constant";
import { currentUser, Roles } from "./decorators/user.decorators";
import { jwtTypePayload } from "src/utils/types";
import { Role } from "src/utils/enum";
import { RegisterDto } from "./dto/register.dto";

@Controller("/api")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/auth/register")
  @SerializeOptions({ strategy: "excludeAll" })
  register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }
  @Post("/auth/login")
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ strategy: "excludeAll" })
  login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @Get("/user")
  @UseGuards(AuthGuard)
  currentUserDetails(@currentUser() payload: jwtTypePayload) {
    const { id } = payload;
    return this.userService.userDetails(id);
  }
  @Get("/user/list")
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @SerializeOptions({ strategy: "excludeAll" })
  allUsers() {
    return this.userService.usersList();
  }
}
