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

export const clearDiscoverCache = () => {
  discoverCache.hasCachedData = false;
  discoverCache.games = [];
  discoverCache.searchQuery = "";
  discoverCache.sortBy = "popular";
  discoverCache.gameType = "";
  discoverCache.platform = "";
  discoverCache.year = "";
  discoverCache.genre = "";
  discoverCache.studio = "";
  discoverCache.offset = 0;
  discoverCache.scrollY = 0;
};
