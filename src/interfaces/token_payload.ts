import type { UserRole } from "../enums/UserRole";

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
