import { Icon } from "../common/Icon";
import "./DiscoverFilters.css";

interface DiscoverFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  availableGenres: string[];
}

function DiscoverFilters({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  availableGenres,
}: DiscoverFiltersProps) {
  return (
    <div className="discover-filters">
      <div className="search-bar">
        <Icon icon="fa-magnifying-glass" className="search-icon" />
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="clear-search"
            onClick={() => setSearchQuery("")}
            title="Clear search"
          >
            <Icon icon="fa-xmark" />
          </button>
        )}
      </div>

      <div className="filter-options">
        <div className="filter-group">
          <label htmlFor="genre-select">
            <Icon icon="fa-layer-group" />
          </label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Genres</option>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category-select">
            <Icon icon="fa-shapes" />
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            <option value="MainGame">Main Game</option>
            <option value="DLC">DLC</option>
            <option value="Expansion">Expansion</option>
            <option value="Bundle">Bundle</option>
            <option value="Remake">Remake</option>
            <option value="Remaster">Remaster</option>
            <option value="Episode">Episode</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">
            <Icon icon="fa-arrow-down-a-z" />
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default DiscoverFilters;
