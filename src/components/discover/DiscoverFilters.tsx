import { Icon } from "../common/Icon";
import { GameType, GameGenre, GamesPopularStudios } from "../../types";
import "./DiscoverFilters.css";

interface DiscoverFiltersProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
  gameType: string;
  setGameType: (type: string) => void;
  platform: string;
  setPlatform: (platform: string) => void;
  year: string;
  setYear: (year: string) => void;
  genre: string;
  setGenre: (genre: string) => void;
  studio: string;
  setStudio: (studio: string) => void;
  onClear: () => void;
}

function DiscoverFilters({
  sortBy,
  setSortBy,
  gameType,
  setGameType,
  platform,
  setPlatform,
  year,
  setYear,
  genre,
  setGenre,
  studio,
  setStudio,
  onClear,
}: DiscoverFiltersProps) {
  const hasActiveFilter = sortBy !== "popular" || gameType !== "" || platform !== "" || year !== "" || genre !== "" || studio.trim().length > 0;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 45 }, (_, i) => currentYear - i);

  return (
    <div className="discover-filters">
      <div className="filter-options">
        <div className="filter-group">
          <label htmlFor="studio-select">
            <Icon icon="fa-building" />
          </label>
          <select
            id="studio-select"
            value={studio}
            onChange={(e) => setStudio(e.target.value)}
            className="filter-select"
          >
            <option value="">All Studios</option>
            <option value={GamesPopularStudios.Nintendo.toString()}>Nintendo</option>
            <option value={GamesPopularStudios.ElectronicArts.toString()}>Electronic Arts</option>
            <option value={GamesPopularStudios.Ubisoft.toString()}>Ubisoft</option>
            <option value={GamesPopularStudios.Capcom.toString()}>Capcom</option>
            <option value={GamesPopularStudios.SquareEnix.toString()}>Square Enix</option>
            <option value={GamesPopularStudios.RockstarGames.toString()}>Rockstar Games</option>
            <option value={GamesPopularStudios.CDProjektRed.toString()}>CD Projekt Red</option>
            <option value={GamesPopularStudios.FromSoftware.toString()}>FromSoftware</option>
            <option value={GamesPopularStudios.NaughtyDog.toString()}>Naughty Dog</option>
            <option value={GamesPopularStudios.BethesdaSoftworks.toString()}>Bethesda</option>
            <option value={GamesPopularStudios.EpicGames.toString()}>Epic Games</option>
            <option value={GamesPopularStudios.Valve.toString()}>Valve</option>
            <option value={GamesPopularStudios.InsomniacGames.toString()}>Insomniac Games</option>
            <option value={GamesPopularStudios.GuerrillaGames.toString()}>Guerrilla Games</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="type-select">
            <Icon icon="fa-gamepad" />
          </label>
          <select
            id="type-select"
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value={GameType.MainGame.toString()}>Main Game</option>
            <option value={GameType.DLC.toString()}>DLC</option>
            <option value={GameType.Expansion.toString()}>Expansion</option>
            <option value={GameType.Bundle.toString()}>Bundle</option>
            <option value={GameType.Remake.toString()}>Remake</option>
            <option value={GameType.Remaster.toString()}>Remaster</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="platform-select">
            <Icon icon="fa-desktop" />
          </label>
          <select
            id="platform-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="filter-select"
          >
            <option value="">All Platforms</option>
            <option value="PC">PC</option>
            <option value="PlayStation 5">PlayStation 5</option>
            <option value="PlayStation 4">PlayStation 4</option>
            <option value="PlayStation 3">PlayStation 3</option>
            <option value="PlayStation 2">PlayStation 2</option>
            <option value="Xbox Series">Xbox Series X|S</option>
            <option value="Xbox One">Xbox One</option>
            <option value="Xbox 360">Xbox 360</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="Nintendo 3DS">Nintendo 3DS</option>
            <option value="Nintendo DS">Nintendo DS</option>
            <option value="Wii">Wii</option>
            <option value="Mac">Mac</option>
            <option value="Linux">Linux</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS</option>
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
            <option value={GameGenre.Adventure.toString()}>Adventure</option>
            <option value={GameGenre.RolePlaying.toString()}>RPG</option>
            <option value={GameGenre.Shooter.toString()}>Shooter</option>
            <option value={GameGenre.Strategy.toString()}>Strategy</option>
            <option value={GameGenre.Simulator.toString()}>Simulation</option>
            <option value={GameGenre.Puzzle.toString()}>Puzzle</option>
            <option value={GameGenre.Sport.toString()}>Sports</option>
            <option value={GameGenre.Racing.toString()}>Racing</option>
            <option value={GameGenre.Fighting.toString()}>Fighting</option>
            <option value={GameGenre.Platform.toString()}>Platformer</option>
            <option value={GameGenre.Indie.toString()}>Indie</option>
            <option value={GameGenre.Arcade.toString()}>Arcade</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="year-select">
            <Icon icon="fa-calendar" />
          </label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="filter-select"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
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
}

export default DiscoverFilters;
