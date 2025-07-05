import { Role } from "./enum";

export type JwtTypePayload = {
  id: number;
  role: Role;
};

export type JwtReturnTypePayload = {
  id: number;
  role: string;
  iat: number;
};

export type EmailType = {
  type: "activate" | "forget";
};
