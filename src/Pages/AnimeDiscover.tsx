import { useEffect, useState, useRef } from "react";
import { Footer } from "../components/common/Footer";
import { Header } from "../components/common/Header";
import { Icon } from "../components/common/Icon";
import { EmptyState } from "../components/common/EmptyState";
import AnimeHero from "../components/discover/AnimeHero";
import AnimeCard from "../components/discover/AnimeCard";
import { AnimeFilters } from "../components/discover/AnimeFilters";
import AnimeAPI from "../api/anime_api";
import type { AnimeModel } from "../models/AnimeModel";
import "./Discover.css";

function AnimeDiscover() {
  const [animeList, setAnimeList] = useState<AnimeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [animeType, setAnimeType] = useState("");
  const [status, setStatus] = useState("complete");
  const [rating, setRating] = useState("");
  const [genre, setGenre] = useState("");

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const contentRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const hasInitialized = useRef(false);

  const clearFilters = () => {
    setAnimeType("");
    setStatus("");
    setRating("");
    setGenre("");
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setAnimeType("");
    setStatus("");
    setRating("");
    setGenre("");
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initial load - fetch popular anime
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchAnime(true);
    }
  }, []);

  useEffect(() => {
    // Skip on first run, only scroll on actual filter changes
    if (!hasInitialized.current) return;

    // When filters or search change, reset and fetch
    setPage(1);
    setAnimeList([]);

    setTimeout(() => {
      const gridElement = gridRef.current;
      if (gridElement) {
        const gridTop =
          gridElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: gridTop - 254, behavior: "smooth" });
      }
    }, 150);

    fetchAnime(true);
  }, [debouncedSearchQuery, animeType, status, rating, genre]);

  useEffect(() => {
    // When page changes (for pagination), fetch more
    if (page > 1) {
      fetchAnime(false);
    }
  }, [page]);

  const fetchAnime = async (isNewSearch: boolean) => {
    // Prevent duplicate calls
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const api = new AnimeAPI();
      const currentPage = page;
      const currentQuery = debouncedSearchQuery;

      const filters = {
        type: animeType,
        status,
        rating,
        genre: genre ? parseInt(genre) : undefined,
      };

      if (isNewSearch || currentPage === 1) {
        setLoading(true);
        const data = currentQuery
          ? await api.searchAnime(currentQuery, 1, 25, filters)
          : await api.getPopularAnime(1, 25, filters);
        setAnimeList(data.anime);
        setHasMore(data.hasMore);
      } else {
        setIsFetchingMore(true);
        const data = currentQuery
          ? await api.searchAnime(currentQuery, currentPage, 25, filters)
          : await api.getPopularAnime(currentPage, 25, filters);
        setAnimeList((prev) => [...prev, ...data.anime]);
        setHasMore(data.hasMore);
      }

      setError(null);
    } catch (err) {
      setError("Failed to load anime. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
      isFetchingRef.current = false;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetchingMore &&
          !loading &&
          !error
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, loading, error]);

  const handleRetry = () => {
    setPage(1);
    setAnimeList([]);
    fetchAnime(true);
  };

  const hasActiveFilters = debouncedSearchQuery || animeType || status || rating || genre;

  return (
    <div>
      <Header />
      <main className="discover-page" ref={contentRef}>
        <AnimeHero
          animeCount={animeList.length}
          isSearching={!!debouncedSearchQuery}
        />

        <section className="discover-content container">
          <div className="content-header">
            <h2>Discover Anime</h2>
            <p>Find your next favorite anime</p>
          </div>

          <div className="discover-layout">
            <aside className="discover-sidebar">
              <div className="sidebar-search">
                <div className="search-box">
                  <Icon icon="fa-magnifying-glass" className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={handleSearchChange}
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

              <AnimeFilters
                animeType={animeType}
                setAnimeType={setAnimeType}
                status={status}
                setStatus={setStatus}
                rating={rating}
                setRating={setRating}
                genre={genre}
                setGenre={setGenre}
                onClear={clearFilters}
              />
            </aside>

            <div className="discover-main" ref={gridRef}>
              {error ? (
                <EmptyState
                  type="error"
                  message={error}
                  onRetry={handleRetry}
                />
              ) : loading && animeList.length === 0 ? (
                <div className="games-grid">
                  {[...Array(12)].map((_, i) => (
                    <div key={`skeleton-${i}`} className="game-card skeleton">
                      <div className="skeleton-image"></div>
                      <div className="skeleton-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-meta"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !loading && animeList.length === 0 ? (
                <EmptyState 
                  message="No anime found" 
                  subtext={hasActiveFilters ? "Try adjusting your filters or search query to find more results." : undefined}
                  onClear={hasActiveFilters ? clearAllFilters : undefined} 
                />
              ) : (
                <div className="games-grid">
                  {animeList.map((anime, index) => (
                    <AnimeCard key={`${anime.id}-${index}`} anime={anime} />
                  ))}

                  {isFetchingMore && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={`skeleton-${i}`}
                          className="game-card skeleton"
                        >
                          <div className="skeleton-image"></div>
                          <div className="skeleton-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-meta"></div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {hasMore && !isFetchingMore && (
                <div ref={observerTarget} className="observer-target" />
              )}

              {!loading && !error && animeList.length > 0 && (
                <div className="scroll-top-wrapper">
                  <button
                    className={`scroll-top-btn ${showScrollTop ? "visible" : ""}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    aria-label="Scroll to top"
                  >
                    <Icon icon="fa-arrow-up" />
                    <span>Back to Top</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AnimeDiscover;
