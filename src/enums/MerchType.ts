export const MerchType = {
  CLOTHING: "CLOTHING",
  PIN: "PIN",
  STICKER: "STICKER",
  KEYCHAIN: "KEYCHAIN",
  MEMBERSHIP: "MEMBERSHIP",
} as const;

export type MerchType = (typeof MerchType)[keyof typeof MerchType];
