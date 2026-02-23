import api from "./api";

export interface EmailVerificationResponse {
  emailVerificationId: number;
  userAccountId: number;
  createdAt: string;
  expiresAt: string;
  isVerified: boolean;
  verifiedAt: string | null;
  attemptCount: number;
  maxAttempts: number;
  remainingAttempts: number;
}

export const sendVerificationCode = async () => {
  const response = await api.post("/email-verification/send");
  return response.data;
};

export const verifyEmailCode = async (code: string) => {
  const response = await api.post("/email-verification/verify", { code });
  return response.data;
};

export const resendVerificationCode = async () => {
  const response = await api.post("/email-verification/resend");
  return response.data;
};

export const getActiveVerification = async () => {
  const response = await api.get("/email-verification/active");
  return response.data;
};

export const checkIsVerified = async (): Promise<boolean> => {
  const response = await api.get("/email-verification/is-verified");
  return response.data.data;
};
