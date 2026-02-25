import type { AdminPosition } from "../../enums/AdminPosition";
import type { PaginatedResponse } from "../paginated";
import type { UserResponse } from "../user/UserResponse";

export interface StudentResponse {
  studentId: string;
  yearLevel: number;
  user: UserResponse;
  adminName?: string; // For admin dashboard display
  adminPosition?: AdminPosition
}
export interface PaginatedStudentsResponse extends PaginatedResponse {
  content: StudentResponse[];
}
