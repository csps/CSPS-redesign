import type { UserRequest } from "../user/UserRequest";

export interface StudentRequest {
  studentId: number;
  yearLevel: number;
  userProfile: UserRequest;
}
