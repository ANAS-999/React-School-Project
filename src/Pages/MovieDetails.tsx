import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import MoviesAPI from "../api/movie_api";
import type { MovieModel } from "../models/MovieModel";
import "./MovieDetails.css";
import MovieCard from "../components/discover/MovieCard";
import {
  addMovieTolibrary,
  checkIfMovieInLibrary,
  removeMovieFromLibrary,
} from "../firebase/FirebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { LibraryModel } from "../models/LibraryModel";

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLibrary, setIsCheckingLibrary] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const api = new MoviesAPI();
        const data = await api.getMovieById(id as any);
        if (data) {
          // try to enrich with watch provider information
          const providers = await api.getWatchProviders(id as any);
          if (providers) {
            data.watchProviders = providers;
          }
          setMovie(data);
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    if (!movie) return;
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const inLibrary = await checkIfMovieInLibrary(movie!.id);
        setIsInLibrary(inLibrary);
      } else {
        setIsInLibrary(false);
      }
      setIsCheckingLibrary(false);
    });
    return () => unsubscribe();
  }, [movie]);

  const handleAddToLibrary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const auth = getAuth();
    if (!auth.currentUser) {
      setShowDialog(true);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isInLibrary) {
        await removeMovieFromLibrary(movie!.id);
        setIsInLibrary(false);
      } else {
        if (movie) {
          const libraryMovie: LibraryModel = {
            id: movie.id,
            title: movie.title,
            image: movie.posterUrl,
          };

          await addMovieTolibrary(libraryMovie);
          setIsInLibrary(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  const closeDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDialog(false);
  };

  const goToLogin = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/signin", { state: { from: location.pathname } });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="movie-details-page loading">
          <div className="container">
            <Icon icon="fa-spinner" className="fa-spin" size="2xl" />
            <p>Loading movie details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div>
        <Header />
        <main className="movie-details-page error">
          <div className="error-content">
            <div className="error-icon">
              <Icon icon="fa-solid fa-ghost" size="2xl" />
            </div>
            <h2>Oops!</h2>
            <p className="error-message">{error}</p>
            <Link to="/movies" className="btn btn-primary">
              <Icon icon="fa-solid fa-film" />
              Back to Movies
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="movie-details-page">
        <div className="movie-hero">
          <div className="movie-hero-bg">
            {movie.posterUrl && <img src={movie.posterUrl} alt="" />}
            <div className="overlay"></div>
          </div>
          <div className="container">
            <button
              className="back-link"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/movies");
                }
              }}
            >
              <Icon icon="fa-arrow-left" /> Back
            </button>
            <div className="movie-hero-content">
              <div className="movie-cover">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} />
                ) : (
                  <div className="placeholder-cover">
                    <Icon icon="fa-film" size="2xl" />
                  </div>
                )}
              </div>
              <div className="movie-info">
                <h1>{movie.title}</h1>
                <div className="movie-meta">
                  {movie.releaseYear && (
                    <span className="meta-item">
                      <Icon icon="fa-calendar" /> {movie.releaseYear}
                    </span>
                  )}
                  {movie.rating && (
                    <span className="meta-item rating">
                      <Icon icon="fa-star" /> {movie.rating}%
                    </span>
                  )}
                </div>
                {movie.genres && movie.genres.length > 0 && (
                  <div className="movie-tags">
                    {movie.genres.map((g) => (
                      <span key={g} className="tag">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                <div className="movie-hero-websites">
                  <div className="movie-hero-btns-group">
                    <button
                      className={`add-to-library-details-btn ${isInLibrary ? "in-library" : ""} ${isLoading || isCheckingLibrary ? "disabled" : ""}`}
                      onClick={handleAddToLibrary}
                      onMouseEnter={() => setIsBtnHovered(true)}
                      onMouseLeave={() => setIsBtnHovered(false)}
                      title={
                        isInLibrary ? "Remove from Library" : "Add to Library"
                      }
                      disabled={isLoading || isCheckingLibrary}
                    >
                      {isLoading || isCheckingLibrary ? (
                        <Icon icon="fas fa-spinner fa-spin" />
                      ) : (
                        <Icon
                          icon={
                            isInLibrary
                              ? isBtnHovered
                                ? "fas fa-times"
                                : "fas fa-check"
                              : "fas fa-plus"
                          }
                        />
                      )}
                      <span className="btn-text">
                        {isCheckingLibrary
                          ? " Loading..."
                          : isInLibrary
                            ? isBtnHovered
                              ? " Remove"
                              : " In Library"
                            : " Add to Library"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container game-content">
          <div className="main-col">
            <section className="about-section">
              <h2>About</h2>
              <p className="summary">
                {movie.summary || "No description available."}
              </p>
            </section>

            {/* Trailer/embed section */}
            {movie.trailerUrl && (
              <section className="trailer-section">
                <h2>Trailer</h2>
                <div className="trailer-wrapper">
                  {/* embed YouTube iframe - we only embed when a trailerUrl is available */}
                  <iframe
                    title={`${movie.title} Trailer`}
                    width="100%"
                    height="400"
                    src={movie.trailerUrl.replace("watch?v=", "embed/")}
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* Cast list */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <section className="cast-section">
                <h2>Cast</h2>
                <div className="cast-list">
                  {movie.credits.cast.slice(0, 8).map((c) => (
                    <div className="cast-item" key={c.id}>
                      {c.profileUrl ? (
                        <img src={c.profileUrl} alt={c.name} />
                      ) : (
                        <div className="cast-placeholder">
                          <Icon icon="fa-user" />
                        </div>
                      )}
                      <div className="cast-meta">
                        <div className="cast-name">{c.name}</div>
                        {c.character && (
                          <div className="cast-character">as {c.character}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Watch On (providers) */}
            {movie.watchProviders && movie.watchProviders.results && (
              <section className="movie-watch-on-section">
                <h2>Where to Watch</h2>
                <div className="watch-on-grid">
                  {(() => {
                    const results = movie.watchProviders.results;
                    const regionKey = results.US
                      ? "US"
                      : Object.keys(results)[0];
                    const region = results[regionKey];
                    if (!region)
                      return (
                        <div className="no-results">
                          <Icon icon="fa-film" />
                          <span>No providers available for your region</span>
                        </div>
                      );

                    const list: any[] = [];
                    const labels: Record<string, string> = {
                      flatrate: "Stream",
                      rent: "Rent",
                      buy: "Buy",
                    };

                    ["flatrate", "rent", "buy"].forEach((k) => {
                      if (Array.isArray(region[k]))
                        region[k].forEach((p: any) =>
                          list.push({ ...p, kind: k, label: labels[k] || k }),
                        );
                    });

                    const unique = list.reduce((acc: any[], cur) => {
                      if (!acc.find((a) => a.provider_id === cur.provider_id))
                        acc.push(cur);
                      return acc;
                    }, [] as any[]);

                    return unique.map((p) => (
                      <div
                        key={p.provider_id}
                        className="watch-on-card"
                        title={`${p.provider_name} - ${p.label}`}
                      >
                        <Icon icon="fa-play-circle" size="xl" />
                        <span>{p.provider_name}</span>
                        <span className={`watch-on-provider-type ${p.kind}`}>
                          {p.label}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </section>
            )}
          </div>
          <div className="side-col">
            <div className="info-card">
              <h3>Quick Facts</h3>
              <div className="fact-list">
                {movie.releaseYear && (
                  <div className="fact-item">
                    <span className="fact-label">Release Year</span>
                    <span className="fact-value">{movie.releaseYear}</span>
                  </div>
                )}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Genres</span>
                    <span className="fact-value">
                      {movie.genres.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Similar movies section */}
        {movie.similar && movie.similar.length > 0 && (
          <div className="container">
            <section className="similar-section">
              <h2>Similar Movies</h2>
              <div className="similar-grid">
                {movie.similar.slice(0, 8).map((s) => (
                  <MovieCard key={s.id} movie={s} />
                ))}
              </div>
            </section>
          </div>
        )}

        <div className="return-to-top-container">
          <button
            className="return-to-top-btn"
            onClick={() => window.scrollTo(0, 0)}
          >
            <Icon icon="fa-arrow-up" /> Return to Top
          </button>
        </div>
      </main>
      {showDialog && (
        <div className="auth-dialog-overlay" onClick={closeDialog}>
          <div className="auth-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Login Required</h3>
            <p>You must be logged in to add games to your library.</p>
            <div className="auth-dialog-buttons">
              <button className="auth-dialog-btn cancel" onClick={closeDialog}>
                Cancel
              </button>
              <button className="auth-dialog-btn login" onClick={goToLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default MovieDetails;
