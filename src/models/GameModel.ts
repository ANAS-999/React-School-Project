export interface GameModel {
  id: number;
  title: string;
  imageId: string | null;
  rating: number | null;
  releaseYear: string | null;
  genres: string[];
  platforms: string[];
  summary: string;
  category?: number | null;
  type: number | null;

  // Extended Details
  storyline?: string | null;
  screenshots?: string[];
  videos?: { name: string; videoId: string }[];
  developers?: string[];
  publishers?: string[];
  websites?: { type: number; url: string; trusted?: boolean }[];
  similarGames?: { id: number; title: string; imageId: string | null }[];
}
