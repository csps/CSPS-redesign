import type { PaginationParams } from "../interfaces/pagination_params";
import type {
  PaginatedStudentsResponse,
  StudentResponse,
} from "../interfaces/student/StudentResponse";
import api from "./api";

export const getStudents = async (paginationParams?: PaginationParams) => {
  try {
    const params = new URLSearchParams();

    if (paginationParams) {
      if (paginationParams.page !== undefined) {
        params.append("page", paginationParams.page.toString());
      }
      if (paginationParams.size !== undefined) {
        params.append("size", paginationParams.size.toString());
      }
    }

    console.log(`Fetching students with params: ${params.toString()}`);

    const response = await api.get<PaginatedStudentsResponse>(
      `/students?${params.toString()}`,
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching students:", err);
    throw err;
  }
};

interface ProfileCompletionData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  birthDate: string; // ISO format: YYYY-MM-DD
  email: string;
}

interface ProfileCompletionResponse {
  success: boolean;
  message: string;
  data?: {
    studentId: string;
    firstName: string;
    lastName: string;
    yearLevel: number;
    user: StudentResponse["user"];
  };
  validationErrors?: Record<string, string>;
}

export const completeStudentProfile = async (
  studentId: string,
  profileData: ProfileCompletionData,
) => {
  try {
    const response = await api.put<ProfileCompletionResponse>(
      `/students/${studentId}/complete-profile`,
      profileData,
    );
    return response.data;
  } catch (err) {
    console.error("Error completing student profile:", err);
    throw err;
  }
};
