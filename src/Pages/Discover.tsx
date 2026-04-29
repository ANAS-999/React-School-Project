import { useEffect, useMemo, useState, useRef } from "react";
import { Footer } from "../components/common/Footer";
import { Header } from "../components/common/Header";
import { Icon } from "../components/common/Icon";
import DiscoverHero from "../components/discover/DiscoverHero";
import DiscoverFilters from "../components/discover/DiscoverFilters";
import GamesAPI from "../api/games_api";
import type { GameModel } from "../models/GameModel";
import GameCard from "../components/discover/GameCard";
import type { GameTypeType, GameGenreType, GamesPopularStudiosType } from "../types";
import "./Discover.css";

function Discover() {
  const [games, setGames] = useState<GameModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [gameType, setGameType] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [studio, setStudio] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [debouncedGameType, setDebouncedGameType] = useState<string>("");
  const [debouncedPlatform, setDebouncedPlatform] = useState<string>("");
  const [debouncedYear, setDebouncedYear] = useState<string>("");
  const [debouncedGenre, setDebouncedGenre] = useState<string>("");
  const [debouncedStudio, setDebouncedStudio] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  const skeletonCards = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  const filteredGames = useMemo(() => {
    let result = [...games];

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort(
          (a, b) => (Number(b.releaseYear) || 0) - (Number(a.releaseYear) || 0),
        );
        break;
      case "oldest":
        result.sort((a, b) => {
          if (!a.releaseYear) return 1;
          if (!b.releaseYear) return -1;
          return Number(a.releaseYear) - Number(b.releaseYear);
        });
        break;
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "popular":
      default:
        break;
    }

    return result;
  }, [games, sortBy]);

  const isSearching = debouncedSearchQuery.trim().length > 0 || debouncedGameType !== "" || debouncedPlatform !== "" || debouncedYear !== "" || debouncedGenre !== "" || debouncedStudio.trim().length > 0;
  const hasResults = filteredGames.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("popular");
    setGameType("");
    setPlatform("");
    setYear("");
    setGenre("");
    setStudio("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setDebouncedGameType(gameType);
      setDebouncedPlatform(platform);
      setDebouncedYear(year);
      setDebouncedGenre(genre);
      setDebouncedStudio(studio);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, gameType, platform, year, genre, studio]);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const gamesAPI = new GamesAPI();
        let data: GameModel[];

        // Scroll to the content if we're further down the page
        if (contentRef.current) {
          const topOffset = contentRef.current.getBoundingClientRect().top + window.scrollY - 80; // 80px for header offset
          if (window.scrollY > topOffset) {
            window.scrollTo({ top: topOffset, behavior: "smooth" });
          }
        }

        if (debouncedSearchQuery.trim() || debouncedGameType !== "" || debouncedPlatform !== "" || debouncedYear !== "" || debouncedGenre !== "" || debouncedStudio.trim() !== "") {
          data = await gamesAPI.getFilteredGames({
            title: debouncedSearchQuery.trim() || undefined,
            type: debouncedGameType !== "" ? (Number(debouncedGameType) as GameTypeType) : null,
            platform: debouncedPlatform !== "" ? debouncedPlatform : null,
            year: debouncedYear !== "" ? debouncedYear : null,
            genre: debouncedGenre !== "" ? (Number(debouncedGenre) as GameGenreType) : null,
            studio: debouncedStudio !== "" ? (Number(debouncedStudio) as GamesPopularStudiosType) : null,
          });
        } else {
          data = await gamesAPI.getPopularGames();
        }
        
        setGames(data);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [debouncedSearchQuery, debouncedGameType, debouncedPlatform, debouncedYear, debouncedGenre, debouncedStudio]);

  return (
    <div>
      <Header />
      <main>
        <DiscoverHero gameCount={games.length} isSearching={isSearching} />

        <section className="discover-content" ref={contentRef}>
          <div className="container">
            <div className="content-header">
              <h2>Discover Games</h2>
              <p>Find your next favorite game</p>
            </div>

            <div className="discover-layout">
              <aside className="discover-sidebar">
                <DiscoverFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  gameType={gameType}
                  setGameType={setGameType}
                  platform={platform}
                  setPlatform={setPlatform}
                  year={year}
                  setYear={setYear}
                  genre={genre}
                  setGenre={setGenre}
                  studio={studio}
                  setStudio={setStudio}
                  onClear={clearFilters}
                />
              </aside>

              <div className="discover-main">
                {loading ? (
                  <div className="games-grid">
                    {skeletonCards.map((i) => (
                      <div key={i} className="skeleton-card">
                        <div className="skeleton-image" />
                        <div className="skeleton-content">
                          <div className="skeleton-title" />
                          <div className="skeleton-info" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : (
                  <div className="games-grid">
                    {filteredGames.length > 0 ? (
                      filteredGames.map((game) => (
                        <GameCard key={game.id} game={game} />
                      ))
                    ) : (
                      <div className="no-results">
                        <p>No games found matching your search.</p>
                        <button
                          className="btn btn-outline"
                          onClick={clearFilters}
                          style={{ marginTop: "16px" }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!loading && !error && hasResults && (
                  <div className="scroll-top-wrapper">
                    <button
                      className={`scroll-top-btn ${showScrollTop ? "visible" : ""}`}
                      onClick={scrollToTop}
                      aria-label="Scroll to top"
                    >
                      <Icon icon="fa-arrow-up" />
                      <span>Back to Top</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Discover;
