import type { UserResponse } from "../user/UserResponse";

export interface StudentResponse {
    studentId: string;
    yearLevel: number;
    user: UserResponse;
}