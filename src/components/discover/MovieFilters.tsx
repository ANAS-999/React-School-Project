import { Icon } from "../common/Icon";
import "./DiscoverFilters.css";

interface MovieFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  year: string;
  setYear: (y: string) => void;
  genre: string;
  setGenre: (g: string) => void;
  onClear: () => void;
}

const MovieGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "War",
  "Western",
];

function MovieFilters({ searchQuery, setSearchQuery, sortBy, setSortBy, year, setYear, genre, setGenre, onClear }: MovieFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 45 }, (_, i) => currentYear - i);

  const hasActiveFilter = searchQuery.trim().length > 0 || sortBy !== "popular" || year !== "" || genre !== "";

  return (
    <div className="discover-filters">
      <div className="search-bar">
        <Icon icon="fa-magnifying-glass" className="search-icon" />
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery("")} title="Clear search">
            <Icon icon="fa-xmark" />
          </button>
        )}
      </div>

      <div className="filter-options">
        <div className="filter-group">
          <label htmlFor="genre-select">
            <Icon icon="fa-masks-theater" />
          </label>
          <select id="genre-select" value={genre} onChange={(e) => setGenre(e.target.value)} className="filter-select">
            <option value="">All Genres</option>
            {MovieGenres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="year-select">
            <Icon icon="fa-calendar" />
          </label>
          <select id="year-select" value={year} onChange={(e) => setYear(e.target.value)} className="filter-select">
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">
            <Icon icon="fa-arrow-down-a-z" />
          </label>
          <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A-Z</option>
          </select>
        </div>
      </div>

      <button className="clear-filters-btn" onClick={onClear} disabled={!hasActiveFilter}>
        <Icon icon="fa-broom" />
        <span>Clear Filters</span>
      </button>
    </div>
  );
}

export default MovieFilters;
