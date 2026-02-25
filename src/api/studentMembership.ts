import api from "./api";
import type {
  StudentMembershipRequest,
  StudentMembershipResponse,
} from "../interfaces/student/StudentMembership";
import type { BulkStudentMembershipRequest } from "../interfaces/student/BulkStudentMembershipRequest";
import type { PaginatedResponse } from "../interfaces/paginated";
import type { StudentResponse } from "../interfaces/student/StudentResponse";
import type { MembershipRatioResponse } from "../interfaces/student/MembershipRatioResponse";

/**
 * Create a new student membership
 * Endpoint: POST /api/student-memberships
 */
export const createStudentMembership = async (
  data: StudentMembershipRequest,
): Promise<StudentMembershipResponse> => {
  const response = await api.post<StudentMembershipResponse>(
    "/student-memberships",
    data,
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
    "/student-memberships",
  );
  return response.data;
};

/**
 * Get all student memberships (Paginated)
 * Endpoint: GET /api/student-memberships/paginated
 */
export const getPaginatedStudentMemberships = async (
  page: number = 0,
  size: number = 7,
): Promise<PaginatedResponse<StudentMembershipResponse>> => {
  const response = await api.get<PaginatedResponse<StudentMembershipResponse>>(
    "/student-memberships/paginated",
    {
      params: { page, size },
    },
  );
  return response.data;
};

/**
 * Get membership by ID
 * Endpoint: GET /api/student-memberships/{membershipId}
 */
export const getStudentMembershipById = async (
  membershipId: number,
): Promise<StudentMembershipResponse> => {
  const response = await api.get<StudentMembershipResponse>(
    `/student-memberships/${membershipId}`,
  );
  return response.data;
};

/**
 * Get all memberships for a specific student
 * Endpoint: GET /api/student-memberships/student/{studentId}
 */
export const getStudentMembershipsByStudentId = async (
  studentId: string,
): Promise<StudentMembershipResponse[]> => {
  const response = await api.get<StudentMembershipResponse[]>(
    `/student-memberships/student/${studentId}`,
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
  size: number = 7,
): Promise<PaginatedResponse<StudentMembershipResponse>> => {
  const response = await api.get<PaginatedResponse<StudentMembershipResponse>>(
    `/student-memberships/student/${studentId}/paginated`,
    {
      params: { page, size },
    },
  );
  return response.data;
};

/**
 * Get paginated list of active members.
 * Endpoint: GET /api/student-memberships/active/paginated
 *
 * @param page - zero-based page index (default 0)
 * @param size - items per page (default 7)
 * @returns paginated active student memberships
 */
export const getActiveMembersPaginated = async (
  page: number = 0,
  size: number = 7,
): Promise<PaginatedResponse<StudentMembershipResponse>> => {
  const response = await api.get<PaginatedResponse<StudentMembershipResponse>>(
    "/student-memberships/active/paginated",
    { params: { page, size } },
  );
  return response.data;
};

/**
 * Get paginated list of non-members (students without active membership).
 * Endpoint: GET /api/student-memberships/inactive/paginated
 *
 * @param page - zero-based page index (default 0)
 * @param size - items per page (default 7)
 * @returns paginated student responses for inactive members
 */
export const getInactiveMembersPaginated = async (
  page: number = 0,
  size: number = 7,
): Promise<PaginatedResponse<StudentResponse>> => {
  const response = await api.get<PaginatedResponse<StudentResponse>>(
    "/student-memberships/inactive/paginated",
    { params: { page, size } },
  );
  return response.data;
};

/**
 * Get count of active members.
 * Endpoint: GET /api/student-memberships/active/count
 *
 * @returns object with count property
 */
export const getActiveMembersCount = async (): Promise<{ count: number }> => {
  const response = await api.get<{ count: number }>(
    "/student-memberships/active/count",
  );
  return response.data;
};

/**
 * Get membership ratio data for the dashboard.
 * Endpoint: GET /api/student-memberships/ratio
 *
 * @returns membership ratio with total, paid, non-member counts and percentage
 */
export const getMembershipRatio =
  async (): Promise<MembershipRatioResponse> => {
    const response = await api.get<MembershipRatioResponse>(
      "/student-memberships/ratio",
    );
    return response.data;
  };

/**
 * Search parameters for the membership search endpoint.
 * All fields are optional — only provided fields are sent as query params.
 *
 * @field studentName  - partial match, case-insensitive
 * @field studentId    - exact match
 * @field activeStatus - "ACTIVE" or "INACTIVE" string filter
 * @field yearStart    - filter by membership start year
 * @field yearEnd      - filter by membership end year
 * @field page         - zero-based page index
 * @field size         - items per page
 */
export interface MembershipSearchParams {
  studentName?: string;
  studentId?: string;
  activeStatus?: string;
  yearStart?: number;
  yearEnd?: number;
  page?: number;
  size?: number;
}

/**
 * Search student memberships with optional filters.
 * Endpoint: GET /api/student-memberships/search
 *
 * @param params - search query parameters (all optional)
 * @returns paginated student membership results
 */
export const searchStudentMemberships = async (
  params: MembershipSearchParams = {},
): Promise<PaginatedResponse<StudentMembershipResponse>> => {
  const response = await api.get<PaginatedResponse<StudentMembershipResponse>>(
    "/student-memberships/search",
    { params },
  );
  return response.data;
};

/**
 * Export full unpaginated list of active members (CSV export).
 * Endpoint: GET /api/student-memberships/active/export
 *
 * @returns full list of active student membership records
 */
export const exportActiveMemberships = async (): Promise<
  StudentMembershipResponse[]
> => {
  const response = await api.get<StudentMembershipResponse[]>(
    "/student-memberships/active/export",
  );
  return response.data;
};

/**
 * Export full unpaginated list of inactive/non-members (CSV export).
 * Endpoint: GET /api/student-memberships/inactive/export
 *
 * @returns full list of non-member student records
 */
export const exportInactiveMemberships = async (): Promise<
  StudentResponse[]
> => {
  const response = await api.get<StudentResponse[]>(
    "/student-memberships/inactive/export",
  );
  return response.data;
};

/**
 * Batch-create memberships for multiple students sharing the same academic year.
 * Uses saveAll() on the backend for a single batch INSERT — avoids N+1 queries.
 * Students who already have a membership for the given year range are silently skipped.
 * Endpoint: POST /api/student-memberships/bulk
 *
 * @param dto - bulk request with studentIds array and shared yearStart/yearEnd
 * @returns list of created membership responses (201 Created)
 */
export const bulkCreateMemberships = async (
  dto: BulkStudentMembershipRequest,
): Promise<StudentMembershipResponse[]> => {
  const response = await api.post<StudentMembershipResponse[]>(
    "/student-memberships/bulk",
    dto,
  );
  return response.data;
};

