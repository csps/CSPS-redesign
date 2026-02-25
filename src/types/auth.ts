import type { StudentResponse } from "../interfaces/student/StudentResponse";
import type { UserResponse } from "../interfaces/user/UserResponse";

export type AuthUser =
  | (StudentResponse & { role: "STUDENT" })
  | (UserResponse & { role: "ADMIN" });
