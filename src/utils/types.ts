import { Role } from "./enum";

export type jwtTypePayload = {
  id: number;
  role: Role;
};

export type JwtReturnTypePayload = {
  id: number;
  role: string;
  iat: number;
};
