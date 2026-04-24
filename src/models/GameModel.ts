export interface GameModel {
  id: number;
  title: string;
  imageId: string | null;
  rating: number | null;
  releaseYear: string | null;
  genres: string[];
  summary: string;
}
