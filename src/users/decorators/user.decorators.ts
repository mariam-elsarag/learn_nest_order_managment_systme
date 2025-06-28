import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CURETNT_USER_KEY } from "src/utils/constant";
import { jwtTypePayload } from "src/utils/types";

// currentUser parameter Decorator
export const currentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user: jwtTypePayload = req[CURETNT_USER_KEY];
    return user;
  },
);
