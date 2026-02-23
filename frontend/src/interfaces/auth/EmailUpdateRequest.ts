/**
 * Request to initiate email update process
 */
export interface InitiateEmailUpdateRequest {
  newEmail: string;
}

/**
 * Request to confirm email update with verification code
 */
export interface ConfirmEmailUpdateRequest {
  newEmail: string;
  verificationCode: string;
}
