/**
 * Email verification response from the backend
 */
export interface EmailVerificationResponse {
  emailVerificationId: number;
  userAccount: Record<string, unknown>; // Partial UserAccount object from backend
  verificationCode: string;
  createdAt: string;
  expiresAt: string;
  isVerified: boolean;
  verifiedAt: string | null;
  attemptCount: number;
  maxAttempts: number;
  newEmail: string;
}

/**
 * API response wrapper for email verification
 */
export interface EmailUpdateApiResponse {
  message: string;
  data: EmailVerificationResponse;
  status: string;
}
