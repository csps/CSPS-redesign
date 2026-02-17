import api from "./api";
import type {
  StudentMembershipRequest,
  StudentMembershipResponse,
} from "../interfaces/student/StudentMembership";
import type { PaginatedResponse } from "../interfaces/paginated";

/**
 * Create a new student membership
 * Endpoint: POST /api/student-memberships
 */
export const createStudentMembership = async (
  data: StudentMembershipRequest
): Promise<StudentMembershipResponse> => {
  const response = await api.post<StudentMembershipResponse>(
    "/student-memberships",
    data
  );
  return response.data;
};

/**
 * Get all student memberships
 * Endpoint: GET /api/student-memberships
 */
export const getAllStudentMemberships = async (): Promise<
  StudentMembershipResponse[]
> => {
  const response = await api.get<StudentMembershipResponse[]>(
    "/student-memberships"
  );
  return response.data;
};

/**
 * Get all student memberships (Paginated)
 * Endpoint: GET /api/student-memberships/paginated
 */
export const getPaginatedStudentMemberships = async (
  page: number = 0,
  size: number = 7
): Promise<PaginatedResponse<StudentMembershipResponse>> => {
  const response = await api.get<PaginatedResponse<StudentMembershipResponse>>(
    "/student-memberships/paginated",
    {
      params: { page, size },
    }
  );
  return response.data;
};

/**
 * Get membership by ID
 * Endpoint: GET /api/student-memberships/{membershipId}
 */
export const getStudentMembershipById = async (
  membershipId: number
): Promise<StudentMembershipResponse> => {
  const response = await api.get<StudentMembershipResponse>(
    `/student-memberships/${membershipId}`
  );
  return response.data;
};

/**
 * Get all memberships for a specific student
 * Endpoint: GET /api/student-memberships/student/{studentId}
 */
export const getStudentMembershipsByStudentId = async (
  studentId: string
): Promise<StudentMembershipResponse[]> => {
  const response = await api.get<StudentMembershipResponse[]>(
    `/student-memberships/student/${studentId}`
  );
  return response.data;
};

/**
 * Get student memberships by student ID (Paginated)
 * Endpoint: GET /api/student-memberships/student/{studentId}/paginated
 */
export const getPaginatedStudentMembershipsByStudentId = async (
  studentId: string,
  page: number = 0,
  size: number = 7
): Promise<PaginatedResponse<StudentMembershipResponse>> => {
  const response = await api.get<PaginatedResponse<StudentMembershipResponse>>(
    `/student-memberships/student/${studentId}/paginated`,
    {
      params: { page, size },
    }
  );
  return response.data;
};
