export const GameImageSize = {
  CoverSmall: "cover_small",
  CoverBig: "cover_big",
  FHD: "1080p",
  HD: "720p",
  Micro: "micro",
  Thumb: "thumb",
} as const;

export type GameImageSizeType =
  (typeof GameImageSize)[keyof typeof GameImageSize];

export interface GameFilter {
  title?: string;
  type?: GameTypeType | null;
}

export const GameType = {
  MainGame: 0,
  DLC: 1,
  Expansion: 2,
  Bundle: 3,
  StandaloneExpansion: 4,
  Mod: 5,
  Episode: 6,
  Season: 7,
  Remake: 8,
  Remaster: 9,
  ExpandedGame: 10,
  Port: 11,
  Fork: 12,
  PackAddon: 13,
  Update: 14,
} as const;

export type GameTypeType = typeof GameType[keyof typeof GameType];
