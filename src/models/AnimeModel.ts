export interface AnimeModel {
  id: number;
  title: string;
  imageId: string | null;
  rating: number | null;
  releaseYear: string | null;
  genres: string[];
  summary: string;
  episodes?: number;
  status?: string;
  source?: string;
  studio?: string;
  
  // Extended Details
  storyline?: string | null;
  images?: string[];
  trailer?: { url: string; embedUrl: string } | null;
  similarAnime?: { id: number; title: string; imageId: string | null }[];
  
  // Additional Info
  type?: string;
  duration?: string;
  ratingValue?: string;
  season?: string;
  broadcast?: string;
  producers?: string[];
  licensors?: string[];
  studios?: string[];
  themes?: string[];
  demographics?: string[];
  background?: string;
  titleJapanese?: string;
  titleSynonyms?: string[];
  openings?: string[];
  endings?: string[];
  externalLinks?: { name: string; url: string }[];
  streaming?: { name: string; url: string }[];
}