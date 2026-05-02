import { useEffect, useState, useRef } from "react";
import { Footer } from "../components/common/Footer";
import { Header } from "../components/common/Header";
import { Icon } from "../components/common/Icon";
import AnimeHero from "../components/discover/AnimeHero";
import AnimeCard from "../components/discover/AnimeCard";
import AnimeAPI from "../api/anime_api";
import type { AnimeModel } from "../models/AnimeModel";
import "./Discover.css";
import "../components/discover/DiscoverFilters.css";

function AnimeDiscover() {
  const [animeList, setAnimeList] = useState<AnimeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const contentRef = useRef<HTMLElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setPage(1);
    setAnimeList([]);
    fetchAnime(true, debouncedSearchQuery, 1);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (page === 1) return;
    fetchAnime(false, debouncedSearchQuery, page);
  }, [page]);

  const fetchAnime = async (isNewSearch: boolean, query: string, pageToFetch: number) => {
    try {
      const api = new AnimeAPI();
      const currentPage = pageToFetch;
      const currentQuery = query;
      
      console.log("Fetching anime:", { isNewSearch, currentPage, currentQuery });
      
      if (isNewSearch || currentPage === 1) {
        setLoading(true);
        const data = currentQuery 
          ? await api.searchAnime(currentQuery, 1)
          : await api.getPopularAnime(1);
        console.log("Fetched data:", data);
        setAnimeList(data.anime);
        setHasMore(data.hasMore);
      } else {
        setIsFetchingMore(true);
        const data = currentQuery 
          ? await api.searchAnime(currentQuery, currentPage)
          : await api.getPopularAnime(currentPage);
        setAnimeList(prev => [...prev, ...data.anime]);
        setHasMore(data.hasMore);
      }
      
      setError(null);
    } catch (err) {
      setError("Failed to load anime. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, loading]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Header />
      <main className="discover-page" ref={contentRef}>
        <AnimeHero 
          animeCount={animeList.length}
          isSearching={!!debouncedSearchQuery}
        />
        
        <section className="discover-filters container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <Icon icon="fa-magnifying-glass" className="search-icon" />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery("")}>
                  <Icon icon="fa-xmark" />
                </button>
              )}
            </div>
        </section>

        {error && (
          <div className="container error-message">
            <Icon icon="fa-triangle-exclamation" />
            <p>{error}</p>
          </div>
        )}

        {!loading && animeList.length === 0 && (
          <div className="container empty-state">
            <Icon icon="fa-film" size="2xl" />
            <p>No anime found</p>
          </div>
        )}

        <section className="container">
          <div className="games-grid">
            {loading && animeList.length === 0 && (
              <>
                {[...Array(12)].map((_, i) => (
                  <div key={`skeleton-initial-${i}`} className="game-card skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-meta"></div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {animeList.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
            
            {isFetchingMore && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="game-card skeleton">
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
          
          {hasMore && !isFetchingMore && <div ref={observerTarget} className="observer-target" />}
        </section>

        {showScrollTop && (
          <button className="scroll-top-btn" onClick={handleScrollTop}>
            <Icon icon="fa-arrow-up" />
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AnimeDiscover;
