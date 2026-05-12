import { useEffect, useState, useMemo } from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import MovieHero from "../components/discover/MovieHero";
import MoviesAPI from "../api/movie_api";
import type { MovieModel } from "../models/MovieModel";
import MovieCard from "../components/discover/MovieCard";
import MovieFilters from "../components/discover/MovieFilters";
// Icon not needed in this file
import "./MovieDiscover.css";

function MovieDiscover() {
  const [movies, setMovies] = useState<MovieModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const skeletonCards = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i),
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");

  // (no debouncing implemented for movies discovery)
  useEffect(() => {}, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const api = new MoviesAPI();
        let data: MovieModel[] = [];

        // If user has typed a search query use the search endpoint which searches all movies
        if (searchQuery.trim().length > 0) {
          data = await api.searchMovies(searchQuery.trim(), 1);
        } else {
          // No search query: use discover endpoint which can filter/sort across all movies
          try {
            data = await api.getPopularMovies(1);
          } catch (e) {
            // Fallback to popular if discover fails for some reason
            console.warn(
              "discoverMovies failed, falling back to getPopularMovies",
              e,
            );
            data = await api.discoverMovies({
              page: 1,
              sortBy,
              year: year || undefined,
              genre: genre || undefined,
            });
          }
        }

        setMovies(data || []);

        // load user library : remove all other data except movie id
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, sortBy, year, genre]);

  // client-side filtered list
  const filtered = movies.filter((m) => {
    if (
      searchQuery.trim() &&
      !m.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
      return false;
    if (
      genre &&
      m.genres &&
      m.genres.length > 0 &&
      !m.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
    )
      return false;
    if (year && m.releaseYear && String(m.releaseYear) !== String(year))
      return false;

    return true;
  });

  switch (sortBy) {
    case "rating":
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "newest":
      filtered.sort(
        (a, b) => (Number(b.releaseYear) || 0) - (Number(a.releaseYear) || 0),
      );
      break;
    case "oldest":
      filtered.sort(
        (a, b) => (Number(a.releaseYear) || 0) - (Number(b.releaseYear) || 0),
      );
      break;
    case "az":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }

  return (
    <div>
      <Header />
      <main className="movie-discover-page">
        <MovieHero movieCount={movies.length} isSearching={false} />

        <section className="discover-content">
          <div className="container">
            <div className="content-header">
              <h2>Discover Movies</h2>
              <p>Find your next favorite movie</p>
            </div>

            <div className="discover-layout">
              <aside className="discover-sidebar">
                <MovieFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  year={year}
                  setYear={setYear}
                  genre={genre}
                  setGenre={setGenre}
                  onClear={() => {
                    setSearchQuery("");
                    setSortBy("popular");
                    setYear("");
                    setGenre("");
                  }}
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
                    {filtered.length > 0 ? (
                      filtered.map((movie, idx) => (
                        <MovieCard key={`${movie.id}-${idx}`} movie={movie} /> // add props inLibrary={list.include(movie.id)}
                      ))
                    ) : (
                      <div className="no-results">
                        <p>No movies found.</p>
                      </div>
                    )}
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

export default MovieDiscover;
