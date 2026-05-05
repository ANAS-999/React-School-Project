import type { MovieModel } from "../models/MovieModel";

class MoviesAPIConfig {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    const rawUrl = import.meta.env.VITE_MOVIES_API_URL;
    const apiKey = import.meta.env.VITE_MOVIES_API_KEY;

    if (!rawUrl) {
      throw new Error("VITE_MOVIES_API_URL is not defined");
    }

    if (!apiKey) {
      throw new Error("VITE_MOVIES_API_KEY is not defined");
    }

    this.apiUrl = rawUrl.endsWith("/") ? rawUrl : rawUrl + "/";
    this.apiKey = apiKey;
  }

  getApiUrl() {
    return this.apiUrl;
  }

  getApiKey() {
    return this.apiKey;
  }
}

class MoviesAPI {
  private apiConfig: MoviesAPIConfig;

  constructor() {
    this.apiConfig = new MoviesAPIConfig();
  }

  public async getPopularMovies(page: number =1 ): Promise<MovieModel[]> {
    try {
      const response = await fetch(
        `${this.apiConfig.getApiUrl()}movie/popular?api_key=${this.apiConfig.getApiKey()}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      return this.mapResponseToMovieModel(rawData.results || []);
    } catch (error) {
      console.error("Fetch Popular Movies error:", error);
      throw error;
    }
  }

  /**
   * Discover movies endpoint wrapper.
   * Accepts optional filters: sortBy ("popular" | "rating" | ...), year, genre (name)
   * Uses TMDB discover endpoint to search across all movies (not only popular list).
   */
  public async discoverMovies(options: { page?: number; sortBy?: string; year?: string; genre?: string } = {}): Promise<MovieModel[]> {
    const { page = 1, sortBy = "popular", year, genre } = options;
    try {
      // Map our sortBy to TMDB discover sort_by values
      let sort_by = "popularity.desc";
      switch (sortBy) {
        case "rating":
          sort_by = "vote_average.desc";
          break;
        case "newest":
          sort_by = "release_date.desc";
          break;
        case "oldest":
          sort_by = "release_date.asc";
          break;
        case "az":
          // There's no direct A-Z sort; fallback to title.asc which TMDB supports
          sort_by = "original_title.asc";
          break;
        default:
          sort_by = "popularity.desc";
      }

      const params = new URLSearchParams({ api_key: this.apiConfig.getApiKey(), page: String(page), sort_by });
      if (year) params.set("year", String(year));
      // TMDB discover expects with_genres as genre ids; we don't have a genre id mapping here,
      // so attempt to use 'with_keywords' or include a simple query filter via 'with_original_language' is not appropriate.
      // To keep changes minimal, if a genre name is provided we will attempt a basic search by that genre using the search endpoint instead.

      // If no genre provided, use discover endpoint
      if (!genre) {
        const response = await fetch(`${this.apiConfig.getApiUrl()}discover/movie?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const rawData = await response.json();
        return this.mapResponseToMovieModel(rawData.results || []);
      }

      // If a genre name is provided we will combine discover + client-side genre filtering by fetching multiple pages
      // Simple approach: call discover without genre, then filter client-side by matching genre name in mapped genres
      const response = await fetch(`${this.apiConfig.getApiUrl()}discover/movie?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const rawData = await response.json();
      let mapped = this.mapResponseToMovieModel(rawData.results || []);
      const genreLower = genre.toLowerCase();
      mapped = mapped.filter((m) => Array.isArray(m.genres) && m.genres.map((g) => g.toLowerCase()).includes(genreLower));
      return mapped;
    } catch (error) {
      console.error("Discover Movies error:", error);
      throw error;
    }
  }

  public async getMovieById(id: number | string): Promise<MovieModel | null> {
    try {
      // Request additional related data (videos, credits, similar movies) in one call
      const response = await fetch(
        `${this.apiConfig.getApiUrl()}movie/${id}?api_key=${this.apiConfig.getApiKey()}&append_to_response=videos,credits,similar`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      return this.mapResponseToMovieModel([rawData])[0] || null;
    } catch (error) {
      console.error("Fetch Movie Details error:", error);
      throw error;
    }
  }

  // Fetch watch/providers info for a movie (returns provider regions and offers)
  public async getWatchProviders(id: number | string): Promise<any | null> {
    try {
      const response = await fetch(
        `${this.apiConfig.getApiUrl()}movie/${id}/watch/providers?api_key=${this.apiConfig.getApiKey()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      return rawData || null;
    } catch (error) {
      console.error("Fetch Watch Providers error:", error);
      return null;
    }
  }

  public async searchMovies(query: string, page: number = 1): Promise<MovieModel[]> {
    try {
      const response = await fetch(
        `${this.apiConfig.getApiUrl()}search/movie?api_key=${this.apiConfig.getApiKey()}&query=${encodeURIComponent(query)}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      return this.mapResponseToMovieModel(rawData.results || []);
    } catch (error) {
      console.error("Search Movies error:", error);
      throw error;
    }
  }

  private mapResponseToMovieModel(rawData: any[]): MovieModel[] {
    // Image base can be configured via env, fallback to TMDB default size
    const imageBase = (import.meta.env.VITE_MOVIES_IMAGE_BASE as string) || "https://image.tmdb.org/t/p/w500";

      return rawData.map((m) => {
        const posterPath = m.poster_path ?? m.backdrop_path ?? null;
        const posterUrl = posterPath ? `${imageBase}${posterPath}` : undefined;

        const releaseYear = m.release_date ? String(m.release_date).split("-")[0] : undefined;

      // vote_average is usually 0-10 float, convert to percentage (0-100)
      const rating = typeof m.vote_average === "number" ? Math.round(m.vote_average * 10) : undefined;

      // Genres: details endpoint returns array of objects with name; list endpoints provide genre_ids
        const genres = Array.isArray(m.genres)
          ? m.genres.map((g: any) => g.name).filter(Boolean)
          : Array.isArray(m.genre_ids)
          ? []
          : [];

        // Build videos info (if present). Keep original shape plus convenience trailerUrl for YouTube trailers
        const videos = m.videos?.results
          ? m.videos.results.map((v: any) => ({
              id: v.id,
              key: v.key,
              name: v.name,
              type: v.type,
              site: v.site,
              official: v.official,
              published_at: v.published_at,
            }))
          : undefined;

        let trailerUrl: string | undefined = undefined;
        if (videos && videos.length) {
          const yt = videos.find((v: any) => v.type === "Trailer" && String(v.site).toLowerCase() === "youtube");
          if (yt && yt.key) {
            trailerUrl = `https://www.youtube.com/watch?v=${yt.key}`;
          }
        }

        // Build credits (cast) - compute a profileUrl for the cast members if profile_path exists
        const profileBase = (import.meta.env.VITE_MOVIES_IMAGE_PROFILE_BASE as string) || "https://image.tmdb.org/t/p/w185";
        const credits = m.credits
          ? {
              cast: Array.isArray(m.credits.cast)
                ? m.credits.cast.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    character: c.character,
                    profile_path: c.profile_path,
                    profileUrl: c.profile_path ? `${profileBase}${c.profile_path}` : undefined,
                  }))
                : [],
            }
          : undefined;

        // Similar movies: map similar.results through the same mapper so they become MovieModel entries
        const similar = m.similar && Array.isArray(m.similar.results) ? this.mapResponseToMovieModel(m.similar.results) : undefined;

        return {
        // original raw fields
        adult: m.adult,
        backdrop_path: m.backdrop_path,
        genre_ids: m.genre_ids,
        id: m.id,
        title: m.title,
        original_language: m.original_language,
        original_title: m.original_title,
        overview: m.overview,
        popularity: m.popularity,
        release_date: m.release_date,
        video: m.video,
        vote_average: m.vote_average,
        vote_count: m.vote_count,

        // derived / convenience fields used by UI
        posterUrl,
        summary: m.overview,
        releaseYear,
        rating,
        genres,
          // include nested/related data
          videos: videos ? { results: videos } : undefined,
          trailerUrl,
          credits,
          similar,
        } as MovieModel;
      });
    }
  }

export default MoviesAPI;
