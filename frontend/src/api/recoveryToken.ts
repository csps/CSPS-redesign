import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface RecoveryTokenResponse {
  recoveryTokenId: number;
  userAccountId: number;
  token: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt: string | null;
}

/**
 * Request a password recovery email.
 * Public endpoint — no authentication required.
 */
export const requestPasswordRecovery = async (email: string) => {
  const response = await publicApi.post("/recovery-token/request", {
    email,
  });
  return response.data;
};

/**
 * Validate a recovery token.
 * Public endpoint — no authentication required.
 */
export const validateRecoveryToken = async (token: string) => {
  const response = await publicApi.post("/recovery-token/validate", {
    token,
  });
  return response.data;
};

/**
 * Reset password using a recovery token.
 * Public endpoint — no authentication required.
 */
export const resetPasswordWithToken = async (
  token: string,
  newPassword: string,
  confirmPassword: string,
) => {
  const response = await publicApi.post("/recovery-token/reset-password", {
    token,
    newPassword,
    confirmPassword,
  });
  return response.data;
};
