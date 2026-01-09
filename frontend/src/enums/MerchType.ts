export const MerchType = {
  CLOTHING: "CLOTHING",
  PIN: "PIN",
  STICKER: "STICKER",
  KEYCHAIN: "KEYCHAIN",
} as const;

export type MerchType = typeof MerchType[keyof typeof MerchType];
