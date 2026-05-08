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

  public async getPopularMovies(page: number = 1): Promise<MovieModel[]> {
    try {
      const response = await fetch(
        `${this.apiConfig.getApiUrl()}discover/movie?api_key=${this.apiConfig.getApiKey()}&sort_by=vote_count.desc&language=en-US&page=${page}`,
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
  public async discoverMovies(
    options: {
      page?: number;
      sortBy?: string;
      year?: string;
      genre?: string;
    } = {},
  ): Promise<MovieModel[]> {
    const { page = 1, sortBy = "popular", year, genre } = options;
    try {
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
          sort_by = "original_title.asc";
          break;
        default:
          sort_by = "popularity.desc";
      }

      const params = new URLSearchParams({
        api_key: this.apiConfig.getApiKey(),
        page: String(page),
        sort_by,
      });

      if (year) params.set("primary_release_year", String(year));

      if (genre) {
        const genreId = this.GENRE_NAME_TO_ID[genre.toLowerCase()];
        if (genreId) params.set("with_genres", String(genreId));
      }

      console.log(
        `${this.apiConfig.getApiUrl()}discover/movie?${params.toString()}`,
      );

      const response = await fetch(
        `${this.apiConfig.getApiUrl()}discover/movie?${params.toString()}`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const rawData = await response.json();
      return this.mapResponseToMovieModel(rawData.results || []);
    } catch (error) {
      console.error("Discover Movies error:", error);
      throw error;
    }
  }

  public async getMovieById(id: number | string): Promise<MovieModel | null> {
    try {
      // Request additional related data (videos, credits, similar movies) in one call
      const response = await fetch(
        `${this.apiConfig.getApiUrl()}movie/${id}?api_key=${this.apiConfig.getApiKey()}&append_to_response=videos,credits,similar`,
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
        `${this.apiConfig.getApiUrl()}movie/${id}/watch/providers?api_key=${this.apiConfig.getApiKey()}`,
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

  public async searchMovies(
    query: string,
    page: number = 1,
  ): Promise<MovieModel[]> {
    try {
      const response = await fetch(
        `${this.apiConfig.getApiUrl()}search/movie?api_key=${this.apiConfig.getApiKey()}&query=${encodeURIComponent(query)}&page=${page}`,
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
  public GENRE_MAP: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  public GENRE_NAME_TO_ID: Record<string, number> = Object.fromEntries(
    Object.entries(this.GENRE_MAP).map(([id, name]) => [
      name.toLowerCase(),
      Number(id),
    ]),
  );

  private mapResponseToMovieModel(rawData: any[]): MovieModel[] {
    // Image base can be configured via env, fallback to TMDB default size
    const imageBase =
      (import.meta.env.VITE_MOVIES_IMAGE_BASE as string) ||
      "https://image.tmdb.org/t/p/w500";

    return rawData.map((m) => {
      const posterPath = m.poster_path ?? m.backdrop_path ?? null;
      const posterUrl = posterPath ? `${imageBase}${posterPath}` : undefined;

      const releaseYear = m.release_date
        ? String(m.release_date).split("-")[0]
        : undefined;

      // vote_average is usually 0-10 float, convert to percentage (0-100)
      const rating =
        typeof m.vote_average === "number"
          ? Math.round(m.vote_average * 10)
          : undefined;

      // Genres: details endpoint returns array of objects with name; list endpoints provide genre_ids
      const genres =
        Array.isArray(m.genres) && m.genres.length > 0
          ? m.genres.map((g: any) => g.name).filter(Boolean)
          : Array.isArray(m.genre_ids)
            ? m.genre_ids
                .map((id: number) => this.GENRE_MAP[id])
                .filter(Boolean) // ← map ids to names
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
        const yt = videos.find(
          (v: any) =>
            v.type === "Trailer" && String(v.site).toLowerCase() === "youtube",
        );
        if (yt && yt.key) {
          trailerUrl = `https://www.youtube.com/watch?v=${yt.key}`;
        }
      }

      // Build credits (cast) - compute a profileUrl for the cast members if profile_path exists
      const profileBase =
        (import.meta.env.VITE_MOVIES_IMAGE_PROFILE_BASE as string) ||
        "https://image.tmdb.org/t/p/w185";
      const credits = m.credits
        ? {
            cast: Array.isArray(m.credits.cast)
              ? m.credits.cast.map((c: any) => ({
                  id: c.id,
                  name: c.name,
                  character: c.character,
                  profile_path: c.profile_path,
                  profileUrl: c.profile_path
                    ? `${profileBase}${c.profile_path}`
                    : undefined,
                }))
              : [],
          }
        : undefined;

      // Similar movies: map similar.results through the same mapper so they become MovieModel entries
      const similar =
        m.similar && Array.isArray(m.similar.results)
          ? this.mapResponseToMovieModel(m.similar.results)
          : undefined;

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
