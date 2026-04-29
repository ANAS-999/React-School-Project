import { useEffect, useState, useRef, useMemo } from "react";
import { Footer } from "../components/common/Footer";
import { Header } from "../components/common/Header";
import { Icon } from "../components/common/Icon";
import DiscoverHero from "../components/discover/DiscoverHero";
import DiscoverFilters from "../components/discover/DiscoverFilters";
import GamesAPI from "../api/games_api";
import type { GameModel } from "../models/GameModel";
import GameCard from "../components/discover/GameCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Discover.css";
import { GameType } from "../types";

gsap.registerPlugin(ScrollTrigger);

function Discover() {
  const [games, setGames] = useState<GameModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const containerRef = useRef<HTMLDivElement>(null);

  // Compute available genres dynamically
  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    games.forEach((game) => {
      game.genres.forEach((genre) => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, [games]);

  const normalizedCategory = useMemo(() => {
    if (selectedCategory === "All") return null;
    const value = GameType[selectedCategory as keyof typeof GameType];
    return typeof value === "number" ? value : null;
  }, [selectedCategory]);

  // Apply filters and sorting
  const filteredGames = useMemo(() => {
    let result = [...games];

    // 2. Genre Filter
    if (selectedGenre !== "All") {
      result = result.filter((game) => game.genres.includes(selectedGenre));
    }

    // 2b. Category Filter (client-side for popular list)
    if (normalizedCategory !== null) {
      result = result.filter((game) => game.category === normalizedCategory);
    }

    // 3. Sort
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
        // Assume initial order from API
        break;
    }

    return result;
  }, [games, selectedGenre, sortBy, normalizedCategory]);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const gamesAPI = new GamesAPI();
        let data: GameModel[];

        const filter = {
          title: debouncedSearchQuery.trim() || undefined,
          category: normalizedCategory ?? undefined,
        };

        if (filter.title || filter.category !== undefined) {
          data = await gamesAPI.getFilteredGames(filter);
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
  }, [debouncedSearchQuery, normalizedCategory]);

  const skeletonCards = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div ref={containerRef}>
      <Header />
      <main>
        <DiscoverHero
          gameCount={games.length}
          isSearching={debouncedSearchQuery.trim().length > 0}
        />

        <section className="discover-content">
          <div className="container">
            <div className="content-header">
              <h2>Discover Games</h2>
              <p>Find your next favorite game</p>
            </div>

            <DiscoverFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              availableGenres={availableGenres}
            />

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
                    <p>No games found matching your filters.</p>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedGenre("All");
                        setSortBy("popular");
                        setSelectedCategory("All");
                      }}
                      style={{ marginTop: "16px" }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && filteredGames.length > 0 && (
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
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Discover;
