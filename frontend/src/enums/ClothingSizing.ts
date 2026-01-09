export const ClothingSizing = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "XXL",
  XXXL: "XXXL",
  XXXXL: "XXXXL",
} as const;

export type ClothingSizing =
  (typeof ClothingSizing)[keyof typeof ClothingSizing];
