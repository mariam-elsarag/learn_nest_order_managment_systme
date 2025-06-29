import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./guards/auth.guard";

import { currentUser, Roles } from "./decorators/user.decorators";
import { JwtTypePayload } from "src/utils/types";
import { Role } from "src/utils/enum";
import { RegisterDto } from "./dto/register.dto";
import { AdminUpdateUserDataDto, UpdateUserDto } from "./dto/update-user.dto";
import { LoggerInterceptor } from "src/utils/interceptors/logger.interceptor";

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
  @UseInterceptors(LoggerInterceptor)
  currentUserDetails(@currentUser() payload: JwtTypePayload) {
    const { id } = payload;
    console.log("Current user route handler called");
    return this.userService.userDetails(id);
  }
  @Patch("/user")
  @UseGuards(AuthGuard)
  updateUserData(
    @currentUser() payload: JwtTypePayload,
    @Body() body: UpdateUserDto,
  ) {
    const { id } = payload;
    return this.userService.updaterUserData<UpdateUserDto>(id, body);
  }
  @Delete("/user")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleterUser(@currentUser() payload: JwtTypePayload) {
    return this.userService.delete(payload.id, payload);
  }
  // admin
  // get all users list
  @Get("/admin/user/list")
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @SerializeOptions({ strategy: "excludeAll" })
  allUsers() {
    return this.userService.usersList();
  }

  // get user details
  @Get("/admin/user/:id")
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  getUserDetails(@Param("id", ParseIntPipe) id: number) {
    return this.userService.userDetails(id);
  }

  // update users data
  @Patch("/admin/user/:id")
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @SerializeOptions({ strategy: "excludeAll" })
  updateUserDetailsByAdmin(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: AdminUpdateUserDataDto,
  ) {
    return this.userService.updaterUserData<AdminUpdateUserDataDto>(id, body);
  }
  // delete user by id
  @Delete("/admin/user/:id")
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleterUserByAdmin(
    @Param("id", ParseIntPipe) id: number,
    @currentUser() payload: JwtTypePayload,
  ) {
    return this.userService.delete(id, payload);
  }
}
