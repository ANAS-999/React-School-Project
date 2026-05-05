export interface MovieModel {
  // Raw fields from API
  adult: boolean;
  backdrop_path?: string | null;
  genre_ids?: number[];
  id: number | string;
  title: string;
  original_language?: string;
  original_title?: string;
  overview?: string | null;
  popularity?: number;
  release_date?: string | null;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;

  // Convenience fields for the UI
  posterUrl?: string; // full URL to poster/backdrop
  summary?: string; // same as overview
  releaseYear?: string; // derived from release_date
  rating?: number; // 0-100 derived from vote_average
  genres?: string[]; // genre names when available

  // Videos returned from the details endpoint (e.g. trailers, teasers)
  videos?: {
    results: {
      id?: string;
      key?: string; // YouTube/Vimeo id
      name?: string;
      type?: string; // Trailer, Teaser, Clip
      site?: string; // YouTube, Vimeo
      official?: boolean;
      published_at?: string;
    }[];
  };

  // Convenience direct URL to a primary trailer (YouTube) when available
  trailerUrl?: string;

  // Credits (cast) - profileUrl is a derived full image URL when profile_path exists
  credits?: {
    cast: {
      id: number;
      name: string;
      character?: string;
      profile_path?: string | null;
      profileUrl?: string | undefined;
    }[];
  };

  // Similar movies as nested MovieModel entries (may be partial)
  similar?: MovieModel[];

  // Watch/providers data (raw shape from the API) - optional
  watchProviders?: any;
}
