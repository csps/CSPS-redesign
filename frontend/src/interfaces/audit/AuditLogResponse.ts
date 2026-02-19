import { AuditAction } from "../../enums/AuditAction";

export interface AuditLogResponse {
  id: number;
  adminId: number;
  adminName: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  description: string;
  timestamp: string;
}
