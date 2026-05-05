import type { GameModel } from "../models/GameModel";

export const discoverCache = {
  hasCachedData: false,
  games: [] as GameModel[],
  searchQuery: "",
  sortBy: "popular",
  gameType: "",
  platform: "",
  year: "",
  genre: "",
  studio: "",
  offset: 0,
  scrollY: 0,
};
