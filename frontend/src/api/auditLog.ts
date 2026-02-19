import api from "./api";
import type { AuditLogResponse } from "../interfaces/audit/AuditLogResponse";
import type { AuditAction } from "../enums/AuditAction";

const AUDIT_LOGS = "audit-logs";

/**
 * Get audit logs by admin ID.
 * @security Requires ADMIN_EXECUTIVE role
 */
export const getAuditLogsByAdmin = async (
  adminId: number
): Promise<AuditLogResponse[]> => {
  const response = await api.get<{ data: AuditLogResponse[] }>(
    `${AUDIT_LOGS}/admin/${adminId}`
  );
  return response.data.data;
};

/**
 * Get audit logs by action.
 * @security Requires ADMIN_EXECUTIVE role
 */
export const getAuditLogsByAction = async (
  action: AuditAction
): Promise<AuditLogResponse[]> => {
  const response = await api.get<{ data: AuditLogResponse[] }>(
    `${AUDIT_LOGS}/action/${action}`
  );
  return response.data.data;
};

/**
 * Get audit logs by resource.
 * @security Requires ADMIN_EXECUTIVE role
 */
export const getAuditLogsByResource = async (
  resourceType: string,
  resourceId: string
): Promise<AuditLogResponse[]> => {
  const response = await api.get<{ data: AuditLogResponse[] }>(
    `${AUDIT_LOGS}/resource/${resourceType}/${resourceId}`
  );
  return response.data.data;
};

/**
 * Get audit logs by time range.
 * @security Requires ADMIN_EXECUTIVE role
 */
export const getAuditLogsByTimeRange = async (
  startTime: string,
  endTime: string
): Promise<AuditLogResponse[]> => {
  const response = await api.get<{ data: AuditLogResponse[] }>(
    `${AUDIT_LOGS}/range`,
    { params: { startTime, endTime } }
  );
  return response.data.data;
};

/**
 * Get audit logs by admin and time range.
 * @security Requires ADMIN_EXECUTIVE role
 */
export const getAuditLogsByAdminAndTimeRange = async (
  adminId: number,
  startTime: string,
  endTime: string
): Promise<AuditLogResponse[]> => {
  const response = await api.get<{ data: AuditLogResponse[] }>(
    `${AUDIT_LOGS}/admin/${adminId}/range`,
    { params: { startTime, endTime } }
  );
  return response.data.data;
};
