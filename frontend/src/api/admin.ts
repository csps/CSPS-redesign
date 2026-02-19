import api from "./api";
import type { AdminPosition } from "../enums/AdminPosition";

/**
 * User response structure from admin endpoints
 */
export interface UserResponseDTO {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  email: string;
  role: "ADMIN" | "STUDENT";
}

/**
 * Admin response structure
 */
export interface AdminResponseDTO {
  adminId: number;
  position: AdminPosition;
  user: UserResponseDTO;
}

/**
 * Fetches all available admin positions that can be assigned.
 * DEVELOPER position can be assigned multiple times.
 * Other positions are unique (one per position).
 * 
 * @returns Promise<AdminPosition[]> - List of available positions
 * @security Requires ADMIN_EXECUTIVE role
 */
export const getAvailablePositions = async (): Promise<AdminPosition[]> => {
  const response = await api.get<{ data: AdminPosition[] }>("/admin/available-positions");
  return response.data.data;
};

/**
 * Grants admin access to a student by creating a new admin account.
 * The student account remains unchanged - a separate admin account is created.
 * 
 * @param studentId - The student ID to grant access to
 * @param position - The admin position to assign
 * @returns Promise<AdminResponseDTO> - The created admin record
 * @throws StudentNotFoundException - If student doesn't exist
 * @throws IllegalArgumentException - If student is already an admin
 * @throws PositionAlreadyTakenException - If position is taken (except DEVELOPER)
 * @security Requires ADMIN_EXECUTIVE role
 */
export const grantAdminAccess = async (
  studentId: string,
  position: AdminPosition
): Promise<AdminResponseDTO> => {
  const response = await api.post<{ data: AdminResponseDTO }>(
    "/admin/grant-access",
    null,
    { params: { studentId, position } }
  );
  return response.data.data;
};

/**
 * Revokes admin access from an admin user.
 * Deletes the admin record and admin user account.
 * Student account remains untouched.
 * 
 * @param adminId - The admin ID to revoke access from
 * @returns Promise<AdminResponseDTO> - The deleted admin record
 * @throws AdminNotFoundException - If admin doesn't exist
 * @security Requires ADMIN_EXECUTIVE role
 */
export const revokeAdminAccess = async (adminId: number): Promise<AdminResponseDTO> => {
  const response = await api.delete<{ data: AdminResponseDTO }>(
    `/admin/revoke-access/${adminId}`
  );
  return response.data.data;
};

/**
 * Get all admins.
 * Endpoint: GET /api/admin/all
 * @security Requires ADMIN_EXECUTIVE role
 */
export const getAllAdmins = async (): Promise<AdminResponseDTO[]> => {
  const response = await api.get<{ data: AdminResponseDTO[] }>("/admin/all");
  return response.data.data;
};
