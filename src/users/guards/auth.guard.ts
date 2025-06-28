import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { JwtReturnTypePayload } from "src/utils/types";
import { User } from "../user.entity";
import { Repository } from "typeorm";
import { CURETNT_USER_KEY } from "src/utils/constant";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException("Access denied. No token provided.");
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtReturnTypePayload>(
        token,
        {
          secret: this.configService.get<string>("JWT_SECRET"),
        },
      );

      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      // check if user exist
      if (!user) {
        throw new UnauthorizedException("User not found.");
      }
      // check password change after change IAT
      if (this.isTokenBeforePasswordChange(user, payload.iat)) {
        throw new UnauthorizedException("Invalid or expired token.");
      }

      req[CURETNT_USER_KEY] = { id: user.id, role: user.role };
      return true;
    } catch (error) {
      console.error("AuthGuard error:", error);
      throw new UnauthorizedException("Invalid or expired token.");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  private isTokenBeforePasswordChange(user: User, iat: number): boolean {
    return (
      user.passwordChangedAt &&
      Math.floor(new Date(user.passwordChangedAt).getTime() / 1000) > iat
    );
  }
}
