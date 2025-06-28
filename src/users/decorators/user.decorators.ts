import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { CURETNT_USER_KEY } from "src/utils/constant";
import { Role } from "src/utils/enum";
import { jwtTypePayload } from "src/utils/types";

// currentUser parameter Decorator
export const currentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user: jwtTypePayload = req[CURETNT_USER_KEY];
    return user;
  },
);

// Roles method decrator
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
