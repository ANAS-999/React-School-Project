export const GameImageSize = {
  CoverSmall: "cover_small",
  CoverBig: "cover_big",
  FHD: "1080p",
  HD: "720p",
  Micro: "micro",
  Thumb: "thumb",
  ScreenshotMed: "screenshot_med",
} as const;

export interface GameFilter {
  title?: string;
  type?: GameTypeType | null;
  platform?: string | null;
  year?: string | null;
  genre?: GameGenreType | null;
  studio?: GamesPopularStudiosType | null;
  offset?: number;
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

export const GameGenre = {
  PointAndClick: 2,
  Fighting: 4,
  Shooter: 5,
  Music: 7,
  Platform: 8,
  Puzzle: 9,
  Racing: 10,
  RealTimeStrategy: 11,
  RolePlaying: 12,
  Simulator: 13,
  Sport: 14,
  Strategy: 15,
  TurnBasedStrategy: 16,
  Tactical: 24,
  HackAndSlash: 25,
  QuizTrivia: 26,
  Pinball: 30,
  Adventure: 31,
  Indie: 32,
  Arcade: 33,
  VisualNovel: 34,
  CardAndBoardGame: 35,
  Moba: 36,
  Family: 37,
} as const;

export const GamesPopularStudios = {
  ElectronicArts: 1,
  BethesdaSoftworks: 26,
  EpicGames: 28,
  RockstarGames: 29,
  Valve: 30,
  Nintendo: 70,
  CDProjektRed: 72,
  Ubisoft: 104,
  Capcom: 248,
  SquareEnix: 263,
  FromSoftware: 287,
  NaughtyDog: 401,
  InsomniacGames: 834,
  GuerrillaGames: 1843,
} as const;

export type GameImageSizeType =
  (typeof GameImageSize)[keyof typeof GameImageSize];
export type GameTypeType = (typeof GameType)[keyof typeof GameType];
export type GameGenreType = (typeof GameGenre)[keyof typeof GameGenre];
export type GamesPopularStudiosType =
  (typeof GamesPopularStudios)[keyof typeof GamesPopularStudios];
