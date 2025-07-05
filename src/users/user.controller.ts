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
  Query,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./guards/auth.guard";

import { currentUser, Roles } from "./decorators/user.decorators";
import { EmailType, JwtTypePayload } from "src/utils/types";
import { Role } from "src/utils/enum";
import { RegisterDto } from "./dto/register.dto";
import { AdminUpdateUserDataDto, UpdateUserDto } from "./dto/update-user.dto";
import { LoggerInterceptor } from "src/utils/interceptors/logger.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthProvider } from "./auth.provider";
import { SendOtpDto, VerifyOtpDto } from "./dto/verify-otp.dto";
import { AcceptFormData } from "src/common/decorators/accept-form-data.decorator";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Controller("/api")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authProvider: AuthProvider,
  ) {}

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
  // Post : send otp
  @Post("/auth/otp")
  @AcceptFormData()
  @HttpCode(HttpStatus.OK)
  sendOtp(@Body() body: SendOtpDto, @Query() query: EmailType) {
    return this.authProvider.sendOtp(body, query);
  }

  //post : verify otp
  @Post("/auth/verify-otp")
  @AcceptFormData()
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() body: VerifyOtpDto, @Query() query: EmailType) {
    return this.authProvider.verify(body, query);
  }
  //patch: reset password
  @Patch("/auth/reset-password")
  @AcceptFormData()
  resetPassword(@Body() body: ChangePasswordDto) {
    return this.authProvider.changePassword(body);
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
  @UseInterceptors(FileInterceptor("avatar"))
  updateUserData(
    @currentUser() payload: JwtTypePayload,
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id } = payload;
    return this.userService.updaterUserData<UpdateUserDto>(id, body, file);
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
