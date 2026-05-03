import { Icon } from "../common/Icon";
import "./DiscoverFilters.css";

interface AnimeFiltersProps {
  animeType: string;
  setAnimeType: (type: string) => void;
  status: string;
  setStatus: (status: string) => void;
  rating: string;
  setRating: (rating: string) => void;
  genre: string;
  setGenre: (genre: string) => void;
  onClear: () => void;
}

const animeTypes = [
  { value: "tv", label: "TV" },
  { value: "movie", label: "Movie" },
  { value: "ova", label: "OVA" },
  { value: "ona", label: "ONA" },
  { value: "special", label: "Special" },
  { value: "music", label: "Music" },
];

const animeStatus = [
  { value: "airing", label: "Airing" },
  { value: "complete", label: "Finished" },
  { value: "upcoming", label: "Upcoming" },
];

const animeRatings = [
  { value: "g", label: "G - All Ages" },
  { value: "pg", label: "PG - Children" },
  { value: "pg13", label: "PG-13 - Teens" },
  { value: "r17", label: "R - 17+" },
];

const animeGenres = [
  { value: "1", label: "Action" },
  { value: "2", label: "Adventure" },
  { value: "4", label: "Comedy" },
  { value: "8", label: "Drama" },
  { value: "10", label: "Fantasy" },
  { value: "14", label: "Horror" },
  { value: "7", label: "Mystery" },
  { value: "22", label: "Romance" },
  { value: "24", label: "Sci-Fi" },
  { value: "36", label: "Slice of Life" },
  { value: "30", label: "Sports" },
  { value: "37", label: "Supernatural" },
];

export const AnimeFilters = ({
  animeType,
  setAnimeType,
  status,
  setStatus,
  rating,
  setRating,
  genre,
  setGenre,
  onClear,
}: AnimeFiltersProps) => {
  const hasActiveFilter = animeType !== "" || status !== "" || rating !== "" || genre !== "";

  return (
    <div className="discover-filters">
      <div className="filter-options">
        <div className="filter-group">
          <label htmlFor="type-select">
            <Icon icon="fa-tv" />
          </label>
          <select
            id="type-select"
            value={animeType}
            onChange={(e) => setAnimeType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            {animeTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-select">
            <Icon icon="fa-circle-play" />
          </label>
          <select
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            {animeStatus.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="rating-select">
            <Icon icon="fa-shield-halved" />
          </label>
          <select
            id="rating-select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="filter-select"
          >
            <option value="">All Ratings</option>
            {animeRatings.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="genre-select">
            <Icon icon="fa-masks-theater" />
          </label>
          <select
            id="genre-select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="filter-select"
          >
            <option value="">All Genres</option>
            {animeGenres.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="clear-filters-btn"
        onClick={onClear}
        disabled={!hasActiveFilter}
      >
        <Icon icon="fa-broom" />
        <span>Clear Filters</span>
      </button>
    </div>
  );
};