import type { AnimeModel } from "../models/AnimeModel";

interface AnimeFilters {
  type?: string;
  status?: string;
  rating?: string;
  genre?: number;
}

class AnimeAPI {
  private baseUrl = "https://api.jikan.moe/v4";

  async getPopularAnime(
    page: number = 1,
    limit: number = 25,
    filters?: AnimeFilters,
  ): Promise<{ anime: AnimeModel[]; total: number; hasMore: boolean }> {
    try {
      let url = `${this.baseUrl}/anime?page=${page}&limit=${limit}&order_by=popularity&sort=asc`;

      if (filters?.type) url += `&type=${filters.type}`;
      if (filters?.status) url += `&status=${filters.status}`;
      if (filters?.rating) url += `&rating=${filters.rating}`;
      if (filters?.genre) url += `&genres=${filters.genre}`;

      let response = await fetch(url);

      if (response.status === 504) {
        url = `${this.baseUrl}/anime?page=${page}&limit=${limit}`;
        response = await fetch(url);
      }

      if (!response.ok) {
        throw new Error("Failed to fetch anime");
      }

      const data = await response.json();

      const cleanSynopsis = (text: string) => {
        return text
          ? text.replace(/\[Written by MAL Rewrite\]/g, "").trim()
          : "";
      };

      const anime: AnimeModel[] = data.data.map((item: any) => ({
        id: item.mal_id,
        title: item.title_english || item.title,
        imageId: item.images?.jpg?.large_image_url || null,
        rating: item.score ? Math.round(item.score * 10) : null,
        releaseYear: item.year ? String(item.year) : null,
        genres: item.genres ? item.genres.map((g: any) => g.name) : [],
        summary: cleanSynopsis(item.synopsis) || "No description available.",
        episodes: item.episodes,
        status: item.status,
        source: item.source,
        studio: item.studios?.[0]?.name || null,
      }));

      const total = data.pagination?.items?.total || 0;
      const hasMore = data.pagination?.has_next_page || false;

      return { anime, total, hasMore };
    } catch (error) {
      console.error("Error fetching anime:", error);
      throw error;
    }
  }

  async searchAnime(
    query: string,
    page: number = 1,
    limit: number = 25,
    filters?: AnimeFilters,
  ): Promise<{ anime: AnimeModel[]; total: number; hasMore: boolean }> {
    try {
      let url = `${this.baseUrl}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;

      if (filters?.type) url += `&type=${filters.type}`;
      if (filters?.status) url += `&status=${filters.status}`;
      if (filters?.rating) url += `&rating=${filters.rating}`;
      if (filters?.genre) url += `&genres=${filters.genre}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to search anime");
      }

      const data = await response.json();

      const cleanSynopsis = (text: string) => {
        return text
          ? text.replace(/\[Written by MAL Rewrite\]/g, "").trim()
          : "";
      };

      const anime: AnimeModel[] = data.data.map((item: any) => ({
        id: item.mal_id,
        title: item.title_english || item.title,
        imageId: item.images?.jpg?.large_image_url || null,
        rating: item.score ? Math.round(item.score * 10) : null,
        releaseYear: item.year ? String(item.year) : null,
        genres: item.genres ? item.genres.map((g: any) => g.name) : [],
        summary: cleanSynopsis(item.synopsis) || "No description available.",
        episodes: item.episodes,
        status: item.status,
        source: item.source,
        studio: item.studios?.[0]?.name || null,
      }));

      const total = data.pagination?.items?.total || 0;
      const hasMore = data.pagination?.has_next_page || false;

      return { anime, total, hasMore };
    } catch (error) {
      console.error("Error searching anime:", error);
      throw error;
    }
  }

  async getAnimeById(id: number): Promise<AnimeModel | null> {
    try {
      const response = await fetch(`${this.baseUrl}/anime/${id}/full`);

      if (!response.ok) {
        throw new Error("Failed to fetch anime details");
      }

      const data = await response.json();
      const item = data.data;

      const images: string[] = [];
      if (item.images?.jpg?.large_image_url) {
        images.push(item.images.jpg.large_image_url);
      }
      if (item.images?.jpg?.image_url) {
        images.push(item.images.jpg.image_url);
      }

      const similarAnime: {
        id: number;
        title: string;
        imageId: string | null;
      }[] = [];

      if (item.relations) {
        const related = item.relations
          .filter(
            (r: any) =>
              r.relation === "Sequel" ||
              r.relation === "Prequel" ||
              r.relation === "Spin-off" ||
              r.relation === "Side story" ||
              r.relation === "Adaptation",
          )
          .slice(0, 6);

        for (const rel of related) {
          for (const entry of rel.entry) {
            if (entry.type === "anime") {
              let imageId: string | null = null;

              if (entry.images?.jpg?.large_image_url) {
                imageId = entry.images.jpg.large_image_url;
              } else {
                try {
                  const detailResponse = await fetch(
                    `${this.baseUrl}/anime/${entry.mal_id}`,
                  );
                  if (detailResponse.ok) {
                    const detailData = await detailResponse.json();
                    imageId =
                      detailData.data?.images?.jpg?.large_image_url || null;
                  }
                } catch (e) {
                  console.warn(
                    "Failed to fetch related anime image:",
                    entry.mal_id,
                  );
                }
              }

              similarAnime.push({
                id: entry.mal_id,
                title: entry.name,
                imageId,
              });
            }
          }
        }
      }

      return {
        id: item.mal_id,
        title: item.title_english || item.title,
        imageId: item.images?.jpg?.large_image_url || null,
        rating: item.score ? Math.round(item.score * 10) : null,
        releaseYear: item.year ? String(item.year) : null,
        genres: item.genres ? item.genres.map((g: any) => g.name) : [],
        summary: item.synopsis || "No description available.",
        episodes: item.episodes,
        status: item.status,
        source: item.source,
        studio: item.studios?.[0]?.name || null,
        storyline: item.synopsis,
        images: images,
        trailer: item.trailer?.embed_url
          ? {
              url: item.trailer.url,
              embedUrl: item.trailer.embed_url,
            }
          : null,
        similarAnime,

        // Additional Info
        type: item.type || null,
        duration: item.duration || null,
        ratingValue: item.rating || null,
        season: item.season || null,
        broadcast: item.broadcast?.string || null,
        producers: item.producers ? item.producers.map((p: any) => p.name) : [],
        licensors: item.licensors ? item.licensors.map((l: any) => l.name) : [],
        studios: item.studios ? item.studios.map((s: any) => s.name) : [],
        themes: item.themes ? item.themes.map((t: any) => t.name) : [],
        demographics: item.demographics
          ? item.demographics.map((d: any) => d.name)
          : [],
        background: item.background || null,
        titleJapanese: item.title_japanese || null,
        titleSynonyms: item.title_synonyms || [],
        openings: item.theme?.openings || [],
        endings: item.theme?.endings || [],
        externalLinks: item.external
          ? item.external.map((e: any) => ({ name: e.name, url: e.url }))
          : [],
        streaming: item.streaming
          ? item.streaming.map((s: any) => ({ name: s.name, url: s.url }))
          : [],
      };
    } catch (error) {
      console.error("Error fetching anime details:", error);
      return null;
    }
  }
}

export default AnimeAPI;
