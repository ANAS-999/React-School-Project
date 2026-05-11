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

export interface GameWebsiteTypeModel {
  type: number;
  title: string;
  iconClass: string;
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

export const GameWebsite = {
  Official: 1,
  Wikia: 2,
  Wikipedia: 3,
  Facebook: 4,
  Twitter: 5,
  Twitch: 6,
  Instagram: 8,
  YouTube: 9,
  iPhone: 10,
  iPad: 11,
  Android: 12,
  Steam: 13,
  Reddit: 14,
  Itchio: 15,
  EpicGames: 16,
  GOG: 17,
  Discord: 18,
  Bluesky: 19,
} as const;

export type GameImageSizeType =
  (typeof GameImageSize)[keyof typeof GameImageSize];
export type GameTypeType = (typeof GameType)[keyof typeof GameType];
export type GameGenreType = (typeof GameGenre)[keyof typeof GameGenre];
export type GamesPopularStudiosType =
  (typeof GamesPopularStudios)[keyof typeof GamesPopularStudios];

export type GameWebsiteType = (typeof GameWebsite)[keyof typeof GameWebsite];

export const GAME_WEBSITES_DATA: Record<number, GameWebsiteTypeModel> = {
  [GameWebsite.Official]: {
    type: GameWebsite.Official,
    title: "Official",
    iconClass: "fa-solid fa-globe",
  },
  [GameWebsite.Wikia]: {
    type: GameWebsite.Wikia,
    title: "Fandom",
    iconClass: "fa-solid fa-book-open",
  },
  [GameWebsite.Wikipedia]: {
    type: GameWebsite.Wikipedia,
    title: "Wikipedia",
    iconClass: "fa-brands fa-wikipedia-w",
  },
  [GameWebsite.Facebook]: {
    type: GameWebsite.Facebook,
    title: "Facebook",
    iconClass: "fa-brands fa-facebook",
  },
  [GameWebsite.Twitter]: {
    type: GameWebsite.Twitter,
    title: "Twitter (X)",
    iconClass: "fa-brands fa-x-twitter",
  },
  [GameWebsite.Twitch]: {
    type: GameWebsite.Twitch,
    title: "Twitch",
    iconClass: "fa-brands fa-twitch",
  },
  [GameWebsite.Instagram]: {
    type: GameWebsite.Instagram,
    title: "Instagram",
    iconClass: "fa-brands fa-instagram",
  },
  [GameWebsite.YouTube]: {
    type: GameWebsite.YouTube,
    title: "YouTube",
    iconClass: "fa-brands fa-youtube",
  },
  [GameWebsite.iPhone]: {
    type: GameWebsite.iPhone,
    title: "iPhone",
    iconClass: "fa-brands fa-apple",
  },
  [GameWebsite.iPad]: {
    type: GameWebsite.iPad,
    title: "iPad",
    iconClass: "fa-solid fa-tablet-screen-button",
  },
  [GameWebsite.Android]: {
    type: GameWebsite.Android,
    title: "Android",
    iconClass: "fa-brands fa-android",
  },
  [GameWebsite.Steam]: {
    type: GameWebsite.Steam,
    title: "Steam",
    iconClass: "fa-brands fa-steam",
  },
  [GameWebsite.Reddit]: {
    type: GameWebsite.Reddit,
    title: "Reddit",
    iconClass: "fa-brands fa-reddit",
  },
  [GameWebsite.Itchio]: {
    type: GameWebsite.Itchio,
    title: "Itch.io",
    iconClass: "fa-brands fa-itch-io",
  },
  [GameWebsite.EpicGames]: {
    type: GameWebsite.EpicGames,
    title: "Epic Games",
    iconClass: "fa-solid fa-gamepad",
  },
  [GameWebsite.GOG]: {
    type: GameWebsite.GOG,
    title: "GOG",
    iconClass: "fa-solid fa-g",
  },
  [GameWebsite.Discord]: {
    type: GameWebsite.Discord,
    title: "Discord",
    iconClass: "fa-brands fa-discord",
  },
  [GameWebsite.Bluesky]: {
    type: GameWebsite.Bluesky,
    title: "Bluesky",
    iconClass: "fa-brands fa-bluesky",
  },
};
