// Finance Dashboard API Types and Functions
// Based on: GET /api/dashboard/finance

import api from "./api";

// ==================== Interfaces ====================

export interface InventorySummaryDTO {
  id: number;
  name: string;
  stock: number;
  s3ImageKey: string;
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

export interface OrderSummaryDTO {
  orderItemId: number;
  orderId: number;
  studentName: string;
  referenceNumber: string;
  productName: string;
  s3ImageKey: string;
  status: string;
  price: number;
  createdAt: string;
}

export interface StudentMembershipDTO {
  studentId: string;
  fullName: string;
  idNumber: string;
  isPaid: boolean;
}

export interface MembershipRatioDTO {
  totalStudents: number;
  paidMembersCount: number;
  nonMembersCount: number;
  memberPercentage: number;
}

export interface ChartDataDTO {
  weeklyOrders: number[];
  weeklyRevenue: number[];
  days: string[];
}

export interface FinanceDashboardDTO {
  inventory: InventorySummaryDTO[];
  recentOrders: OrderSummaryDTO[];
  recentMemberships: StudentMembershipDTO[];
  membershipRatio: MembershipRatioDTO;
  chartData: ChartDataDTO;
}

export interface FinanceDashboardResponse {
  success: boolean;
  message: string;
  data: FinanceDashboardDTO;
  timestamp: string;
}

// ==================== API Function ====================

/**
 * Fetches all finance dashboard data in a single request.
 * This endpoint aggregates inventory, orders, memberships, and chart data.
 *
 * @returns Promise<FinanceDashboardDTO> The aggregated dashboard data
 * @throws Error if the request fails or user lacks ADMIN_FINANCE role
 */
export const getFinanceDashboard = async (): Promise<FinanceDashboardDTO> => {
  const response = await api.get<FinanceDashboardResponse>(
    "/dashboard/finance"
  );
  return response.data.data;
};
