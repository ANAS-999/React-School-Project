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
import { discoverCache } from "../utils/discoverCache";
import "./Discover.css";

function Discover() {
  const [games, setGames] = useState<GameModel[]>(discoverCache.games);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(discoverCache.searchQuery);
  const [sortBy, setSortBy] = useState(discoverCache.sortBy);
  const [gameType, setGameType] = useState<string>(discoverCache.gameType);
  const [platform, setPlatform] = useState<string>(discoverCache.platform);
  const [year, setYear] = useState<string>(discoverCache.year);
  const [genre, setGenre] = useState<string>(discoverCache.genre);
  const [studio, setStudio] = useState<string>(discoverCache.studio);
  
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(discoverCache.searchQuery);
  const [debouncedGameType, setDebouncedGameType] = useState<string>(discoverCache.gameType);
  const [debouncedPlatform, setDebouncedPlatform] = useState<string>(discoverCache.platform);
  const [debouncedYear, setDebouncedYear] = useState<string>(discoverCache.year);
  const [debouncedGenre, setDebouncedGenre] = useState<string>(discoverCache.genre);
  const [debouncedStudio, setDebouncedStudio] = useState<string>(discoverCache.studio);
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [offset, setOffset] = useState(discoverCache.offset);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const contentRef = useRef<HTMLElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

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
    // Header handles scroll to top on navigation, no need to restore
    // Cache is still used for preserving filter state

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      discoverCache.scrollY = window.scrollY; // Update cache with scroll position continuously
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // When leaving the page, save all the state to the cache
      discoverCache.games = games;
      discoverCache.searchQuery = searchQuery;
      discoverCache.sortBy = sortBy;
      discoverCache.gameType = gameType;
      discoverCache.platform = platform;
      discoverCache.year = year;
      discoverCache.genre = genre;
      discoverCache.studio = studio;
      discoverCache.offset = offset;
      discoverCache.hasCachedData = true;
    };
  }, [games, searchQuery, sortBy, gameType, platform, year, genre, studio, offset]);

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
    setOffset(0);
    setHasMore(true);
  }, [debouncedSearchQuery, debouncedGameType, debouncedPlatform, debouncedYear, debouncedGenre, debouncedStudio]);

  useEffect(() => {
    const fetchGames = async () => {
      if (offset === 0) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      
      try {
        const gamesAPI = new GamesAPI();
        let data: GameModel[];

        // Header handles scroll to top on navigation

        if (debouncedSearchQuery.trim() || debouncedGameType !== "" || debouncedPlatform !== "" || debouncedYear !== "" || debouncedGenre !== "" || debouncedStudio.trim() !== "") {
          data = await gamesAPI.getFilteredGames({
            title: debouncedSearchQuery.trim() || undefined,
            type: debouncedGameType !== "" ? (Number(debouncedGameType) as GameTypeType) : null,
            platform: debouncedPlatform !== "" ? debouncedPlatform : null,
            year: debouncedYear !== "" ? debouncedYear : null,
            genre: debouncedGenre !== "" ? (Number(debouncedGenre) as GameGenreType) : null,
            studio: debouncedStudio !== "" ? (Number(debouncedStudio) as GamesPopularStudiosType) : null,
            offset: offset,
          });
        } else {
          data = await gamesAPI.getPopularGames(offset);
        }
        
        if (data.length < 50) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setGames((prev) => (offset === 0 ? data : [...prev, ...data]));
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchGames();
  }, [debouncedSearchQuery, debouncedGameType, debouncedPlatform, debouncedYear, debouncedGenre, debouncedStudio, offset]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetchingMore) {
          setOffset((prev) => prev + 50);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, isFetchingMore]);

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
                <div className="sidebar-search">
                  <div className="search-box">
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
                      >
                        <Icon icon="fa-xmark" />
                      </button>
                    )}
                  </div>
                </div>

                <DiscoverFilters
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
                      <>
                        {filteredGames.map((game, idx) => (
                          <GameCard key={`${game.id}-${idx}`} game={game} />
                        ))}
                        {isFetchingMore &&
                          skeletonCards.slice(0, 4).map((i) => (
                            <div key={`more-${i}`} className="skeleton-card">
                              <div className="skeleton-image" />
                              <div className="skeleton-content">
                                <div className="skeleton-title" />
                                <div className="skeleton-info" />
                              </div>
                            </div>
                          ))}
                      </>
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
                
                <div ref={observerTarget} style={{ height: "10px", marginTop: "20px" }}></div>

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
