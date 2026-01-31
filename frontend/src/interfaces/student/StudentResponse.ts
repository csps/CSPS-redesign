import type { PaginatedResponse } from "../paginated";
import type { UserResponse } from "../user/UserResponse";

export interface StudentResponse {
  studentId: string;
  yearLevel: number;
  user: UserResponse;
}
export interface PaginatedStudentsResponse extends PaginatedResponse {
  content: StudentResponse[];
}
