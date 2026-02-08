import { useAuthStore } from "../store/auth_store";
import type { UserResponse } from "../interfaces/user/UserResponse";
import {
  isExecutivePosition,
  isFinancePosition,
} from "../enums/AdminPosition";

/**
 * Hook to check user permissions based on role and position.
 * Returns various permission flags for conditional rendering.
 */
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isStudent = user?.role === "STUDENT";

  // Get admin position (undefined for students)
  const position = isAdmin ? (user as UserResponse).position : undefined;

  // Check position categories
  const isExecutive = isExecutivePosition(position);
  const isFinance = isFinancePosition(position);
  const isGeneralAdmin = isAdmin && !isExecutive && !isFinance;

  // Permission flags for different actions
  const permissions = {
    // Can view finance dashboard
    canViewFinance: isExecutive || isFinance || isGeneralAdmin,
    
    // Can view sales page
    canViewSales: isExecutive || isFinance || isGeneralAdmin,
    
    // Can perform CRUD operations on finance/sales
    // Only executives and finance members can edit
    canEditFinance: isExecutive || isFinance,
    
    // Can manage students (add, edit, delete)
    canManageStudents: isExecutive,
    
    // Can manage events (create, update, delete)
    // Only executives can manage events - finance and general admins see read-only
    canManageEvents: isExecutive,
    
    // Can manage merchandise (add, edit, delete products, update orders)
    // Only executives and finance can edit - general admins see read-only
    canManageMerch: isExecutive || isFinance,
    
    // Can approve/reject transactions
    canApproveTransactions: isExecutive || isFinance,
    
    // Can view admin dashboard
    canViewDashboard: isExecutive || isGeneralAdmin,
  };

  return {
    isAuthenticated,
    isAdmin,
    isStudent,
    isExecutive,
    isFinance,
    isGeneralAdmin,
    position,
    ...permissions,
  };
};

export default usePermissions;
