import type { GameModel } from "../models/GameModel";

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

  public async getPopularGames(): Promise<GameModel[]> {
    try {
      const response = await fetch(this.apiConfig.getApiUrl() + "games", {
        method: "POST",
        headers: this.apiConfig.getHeaders(),
        body: this.getPopularGamesQuery(),
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
      summary: game.summary || "No description available.",
    }));
  }

  private getPopularGamesQuery() {
    const query = `fields id, name, cover.image_id, rating, first_release_date, genres.name, summary; where total_rating_count > 500;
    sort total_rating_count desc;
    limit 50;`;

    return query;
  }
}

export default GamesAPI;
