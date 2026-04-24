export const GameImageSize = {
  CoverSmall: "cover_small",
  CoverBig: "cover_big",
  FHD: "1080p",
  HD: "720p",
  Micro: "micro",
  Thumb: "thumb"
} as const;

export type GameImageSizeType =
  (typeof GameImageSize)[keyof typeof GameImageSize];
