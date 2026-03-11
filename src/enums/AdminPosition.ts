// Admin positions as defined in the backend
export const AdminPosition = {
  // Executive positions (ROLE_ADMIN_EXECUTIVE)
  PRESIDENT: "PRESIDENT",
  VP_INTERNAL: "VP_INTERNAL",
  VP_EXTERNAL: "VP_EXTERNAL",
  SECRETARY: "SECRETARY",

  // Finance positions (ROLE_ADMIN_FINANCE)
  TREASURER: "TREASURER",
  ASSISTANT_TREASURER: "ASSISTANT_TREASURER",
  AUDITOR: "AUDITOR",

  PIO: "PIO",
  PRO: "PRO",
  CHIEF_VOLUNTEER: "CHIEF_VOLUNTEER",
  FIRST_YEAR_REPRESENTATIVE: "FIRST_YEAR_REPRESENTATIVE",
  SECOND_YEAR_REPRESENTATIVE: "SECOND_YEAR_REPRESENTATIVE",
  THIRD_YEAR_REPRESENTATIVE: "THIRD_YEAR_REPRESENTATIVE",
  FOURTH_YEAR_REPRESENTATIVE: "FOURTH_YEAR_REPRESENTATIVE",
  DEVELOPER: "DEVELOPER",
} as const;

export type AdminPosition = (typeof AdminPosition)[keyof typeof AdminPosition];

// Executive positions have full admin access
export const EXECUTIVE_POSITIONS: AdminPosition[] = [
  AdminPosition.PRESIDENT,
  AdminPosition.VP_INTERNAL,
  AdminPosition.VP_EXTERNAL,
  AdminPosition.SECRETARY,
];

// Finance positions have admin + finance-specific access
export const FINANCE_POSITIONS: AdminPosition[] = [
  AdminPosition.TREASURER,
  AdminPosition.ASSISTANT_TREASURER,
  AdminPosition.AUDITOR,
];

// Helper functions to check position category
export const isExecutivePosition = (
  position?: AdminPosition | string,
): boolean => {
  if (!position) return false;
  return EXECUTIVE_POSITIONS.includes(position as AdminPosition);
};

export const isFinancePosition = (
  position?: AdminPosition | string,
): boolean => {
  if (!position) return false;
  return FINANCE_POSITIONS.includes(position as AdminPosition);
};
