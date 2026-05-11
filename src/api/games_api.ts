import type { GameModel } from "../models/GameModel";
import type { GameFilter } from "../types";

interface GamesAPIHeaders {
  clientId: string;
  authorization: string;
}

class GamesAPIConfig {
  private apiUrl: string;
  private headers: GamesAPIHeaders;

  constructor() {
    this.apiUrl = import.meta.env.VITE_GAMES_API_URL;
    this.headers = {
      clientId: import.meta.env.VITE_GAMES_CLIENT_ID,
      authorization: import.meta.env.VITE_GAMES_AUTHORIZATION,
    };
  }

  getApiUrl() {
    return this.apiUrl;
  }

  getHeaders() {
    return {
      Accept: "application/json",
      "Client-ID": this.headers.clientId,
      Authorization: this.headers.authorization,
    };
  }
}

class GamesAPI {
  private apiConfig: GamesAPIConfig;

  constructor() {
    this.apiConfig = new GamesAPIConfig();
  }

  public async getPopularGames(offset: number = 0): Promise<GameModel[]> {
    try {
      const response = await fetch(this.apiConfig.getApiUrl() + "games", {
        method: "POST",
        headers: this.apiConfig.getHeaders(),
        body: this.getPopularGamesQuery(50, offset),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      if (!Array.isArray(rawData)) {
        console.error("API Error:", rawData);
        return [];
      }

      const listGames: GameModel[] = this.mapResponseToGameModel(rawData);
      return listGames;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  public async getFilteredGames(gameFilter: GameFilter): Promise<GameModel[]> {
    try {
      const response = await fetch(this.apiConfig.getApiUrl() + "games", {
        method: "POST",
        headers: this.apiConfig.getHeaders(),
        body: this.getFilteredGamesQuery(gameFilter),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      if (!Array.isArray(rawData)) {
        console.error("API Error:", rawData);
        return [];
      }

      const listGames: GameModel[] = this.mapResponseToGameModel(rawData);
      console.log(listGames.length);

      return listGames;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  public async getGameById(id: number): Promise<GameModel | null> {
    try {
      const response = await fetch(this.apiConfig.getApiUrl() + "games", {
        method: "POST",
        headers: this.apiConfig.getHeaders(),
        body: this.getGameByIdQuery(id),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      if (!Array.isArray(rawData) || rawData.length === 0) {
        return null;
      }

      const listGames: GameModel[] = this.mapResponseToGameModel(rawData);
      return listGames[0];
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  //! Utils Methods
  private mapResponseToGameModel(rawData: any[]): GameModel[] {
    return rawData.map((game) => ({
      id: game.id,
      title: game.name,
      imageId: game.cover?.image_id || null,
      rating: game.rating ? Math.round(game.rating) : null,
      releaseYear: game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear().toString()
        : null,
      genres: game.genres ? game.genres.map((g: any) => g.name) : [],
      platforms: game.platforms ? game.platforms.map((p: any) => p.name) : [],
      summary: game.summary || "No description available.",
      category: typeof game.category === "number" ? game.category : null,
      type: typeof game.type === "number" ? game.type : null,

      // Detail fields
      storyline: game.storyline || null,
      screenshots: game.screenshots
        ? game.screenshots.map((s: any) => s.image_id)
        : [],
      websites: game.websites
        ? game.websites.map((w: any) => ({ type: w.type, url: w.url, trusted: w.trusted }))
        : [],
      videos: game.videos
        ? game.videos.map((v: any) => ({ name: v.name, videoId: v.video_id }))
        : [],
      developers: game.involved_companies
        ? game.involved_companies
            .filter((c: any) => c.developer)
            .map((c: any) => c.company.name)
        : [],
      publishers: game.involved_companies
        ? game.involved_companies
            .filter((c: any) => c.publisher)
            .map((c: any) => c.company.name)
        : [],
      similarGames: game.similar_games
        ? game.similar_games.map((sg: any) => ({
            id: sg.id,
            title: sg.name,
            imageId: sg.cover?.image_id || null,
          }))
        : [],
    }));
  }

  private getPopularGamesQuery(limit: number = 50, offset: number = 0) {
    const query = `fields id, name, cover.image_id, rating, first_release_date, genres.name, platforms.name, summary, category; where total_rating_count > 500;
    sort total_rating_count desc;
    limit ${limit}; offset ${offset};`;

    return query;
  }

  private getFilteredGamesQuery(gameFilter: GameFilter) {
    const limit = "limit 50;";
    const offset = `offset ${gameFilter.offset || 0};`;
    const sort = "sort total_rating_count desc;";
    const whereParts: string[] = ["cover != null"];

    if (gameFilter.title) {
      whereParts.push(`name ~ *"${gameFilter.title}"*`);
    }

    if (gameFilter.type !== null && gameFilter.type !== undefined) {
      whereParts.push(`game_type = ${gameFilter.type}`);
    }

    if (gameFilter.platform) {
      whereParts.push(`platforms.name ~ *"${gameFilter.platform}"*`);
    }

    if (gameFilter.genre !== null && gameFilter.genre !== undefined) {
      whereParts.push(`genres = ${gameFilter.genre}`);
    }

    if (gameFilter.studio !== null && gameFilter.studio !== undefined) {
      whereParts.push(`involved_companies.company = ${gameFilter.studio}`);
    }

    if (gameFilter.year) {
      const startOfYear = Math.floor(
        new Date(`${gameFilter.year}-01-01T00:00:00Z`).getTime() / 1000,
      );
      const endOfYear = Math.floor(
        new Date(`${gameFilter.year}-12-31T23:59:59Z`).getTime() / 1000,
      );
      whereParts.push(`first_release_date >= ${startOfYear}`);
      whereParts.push(`first_release_date <= ${endOfYear}`);
    }

    const where = `where ${whereParts.join(" & ")};`;
    const fields =
      "fields id, name, cover.image_id, rating, first_release_date, genres.name, platforms.name, summary, category;";
    const query = where + fields + sort + limit + offset;

    console.log(query);

    return query;
  }

  private getGameByIdQuery(id: number) {
    return `fields name, summary, storyline, first_release_date, rating, cover.image_id, screenshots.image_id, videos.name, videos.video_id, genres.name, platforms.name, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, similar_games.name, similar_games.cover.image_id, category, websites.url, websites.type, websites.trusted; where id = ${id};`;
  }
}

export default GamesAPI;
