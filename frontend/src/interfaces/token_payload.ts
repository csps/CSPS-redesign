import type { UserRole } from "../enums/UserRole";
import type { UserResponse } from "./user/UserResponse";

export interface TokenPayload {
  studentId: string;
  role: UserRole;
  yearLevel: number;
  profileId: number;
  username: string;
  sub: number;
  iat: number;
  exp: number;
}
