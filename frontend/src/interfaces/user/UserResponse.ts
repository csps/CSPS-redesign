import type { UserRole } from "../../enums/UserRole";
import type { AdminPosition } from "../../enums/AdminPosition";

// User Response DTO
export interface UserResponse {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string; // ISO format date string
  email: string;
  role: UserRole;
  position?: AdminPosition; // Admin position for role-based access
}
