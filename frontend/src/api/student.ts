import type { PaginationParams } from "../interfaces/pagination_params";
import type {
  PaginatedStudentsResponse,
  StudentResponse,
} from "../interfaces/student/StudentResponse";
import api from "./api";

export const getStudents = async (
  paginationParams?: PaginationParams,
  filters?: { search?: string; yearLevel?: string },
) => {
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

    if (filters?.search) {
      params.append("search", filters.search);
    }

    if (filters?.yearLevel && filters.yearLevel !== "All") {
      // Extract number from "1st Year" -> 1
      const year = parseInt(filters.yearLevel);
      if (!isNaN(year)) {
        params.append("yearLevel", year.toString());
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

export const getAllStudents = async (filters?: { search?: string; yearLevel?: string }) => {
  try {
    const params = new URLSearchParams();
    params.append("page", "0");
    params.append("size", "10000"); // Fetch all (large limit)

    if (filters?.search) {
      params.append("search", filters.search);
    }

    if (filters?.yearLevel && filters.yearLevel !== "All") {
      const year = parseInt(filters.yearLevel);
      if (!isNaN(year)) {
        params.append("yearLevel", year.toString());
      }
    }

    const response = await api.get<PaginatedStudentsResponse>(
      `/students?${params.toString()}`,
    );

    return response.data.content;
  } catch (err) {
    console.error("Error fetching all students:", err);
    throw err;
  }
};

export interface UserRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
}

export interface StudentRequest {
  studentId: string;
  yearLevel: number;
  userRequestDTO: UserRequest;
}

export const createStudent = async (student: StudentRequest) => {
  try {
    const response = await api.post("/students", student);
    return response.data;
  } catch (err) {
    console.error("Error creating student:", err);
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
