import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import MoviesAPI from "../api/movie_api";
import type { MovieModel } from "../models/MovieModel";
import "./GameDetails.css";
import MovieCard from "../components/discover/MovieCard";
import {
  addMovieTolibrary,
  removeMovieFromLibrary,
  fetchMovieToLibrary,
} from "../firebase/FirebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { log } from "firebase/firestore/pipelines";

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [details, setDetails] = useState<MovieModel | null>(null);
  const [savedMovie, setSsavedMovie] = useState<string[]>([]);

  const handleAdd = async () => {
    if (!movie) return;
    const auth = getAuth();
    if (auth.currentUser) {
      await addMovieTolibrary({
        id: movie.id,
        title: movie.title,
        image: movie.posterUrl,
      });
    } else {
      try {
        const raw = localStorage.getItem("savedMovies");
        const local: string[] = raw ? JSON.parse(raw) : [];
        if (!local.includes(movie.id as string)) {
          local.push(movie.id as string);
          localStorage.setItem("savedMovies", JSON.stringify(local));
        }
      } catch (e) {}
    }
    setSaved(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    await removeMovieFromLibrary(displayed.id);

    setSsavedMovie((prev) =>
      prev.filter((id) => id !== displayed.id.toString()),
    );
    setSaved(false);
  };
  const displayed = details ?? movie;

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

  // when movie is loaded, determine saved state
  useEffect(() => {
    const checkSaved = async () => {
      if (!movie) return;
      const auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          if (auth.currentUser) {
            const movies = await fetchMovieToLibrary();
            setSaved(movies.includes(`${movie.id}`));
            return;
          }
        }
      });

      /*  try {
        const raw = localStorage.getItem("savedMovies");
        const local: string[] = raw ? JSON.parse(raw) : [];
        setSaved(local.includes(movie.id as string));
      } catch (e) {
        setSaved(false);
      } */
    };
    checkSaved();
  }, [movie]);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="game-details-page loading">
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
        <main className="game-details-page error">
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
      <main className="game-details-page">
        <div className="game-hero">
          <div className="game-hero-bg">
            {movie.posterUrl && <img src={movie.posterUrl} alt="" />}
            <div className="overlay"></div>
          </div>
          <div className="container">
            <Link to="/movies" className="back-link">
              <Icon icon="fa-arrow-left" /> Back to Movies
            </Link>
            <div className="game-hero-content">
              <div className="game-cover">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} />
                ) : (
                  <div className="placeholder-cover">
                    <Icon icon="fa-film" size="2xl" />
                  </div>
                )}
              </div>
              <div className="game-info">
                <h1>{movie.title}</h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="game-meta">
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
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className={`library-btn ${saved ? "library-btn--saved" : ""}`}
                      onClick={handleAdd}
                      title={saved ? "Added to library" : "Add to library"}
                    >
                      <Icon icon={saved ? "fa-check" : "fa-plus"} />
                      <span style={{ marginLeft: 6 }}>
                        {saved ? "Saved" : "Add to Library"}
                      </span>
                    </button>
                    {saved && (
                      <button
                        className="unsave-btn"
                        title="Remove from library"
                        onClick={handleDelete}
                      >
                        <Icon icon="fa-times" />
                      </button>
                    )}
                  </div>
                </div>
                {movie.genres && movie.genres.length > 0 && (
                  <div className="game-tags">
                    {movie.genres.map((g) => (
                      <span key={g} className="tag">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
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
              <section className="media-section">
                <h2>Watch On</h2>
                <div className="watch-on-grid">
                  {(() => {
                    const results = movie.watchProviders.results;
                    // prefer US providers, fallback to the first available region
                    const regionKey = results.US
                      ? "US"
                      : Object.keys(results)[0];
                    const region = results[regionKey];
                    if (!region)
                      return (
                        <div className="no-results">No providers available</div>
                      );

                    const list: any[] = [];
                    ["flatrate", "rent", "buy"].forEach((k) => {
                      if (Array.isArray(region[k]))
                        region[k].forEach((p: any) =>
                          list.push({ ...p, kind: k }),
                        );
                    });

                    // unique by provider_id
                    const unique = list.reduce((acc: any[], cur) => {
                      if (!acc.find((a) => a.provider_id === cur.provider_id))
                        acc.push(cur);
                      return acc;
                    }, [] as any[]);

                    return unique.map((p) => (
                      <div
                        key={p.provider_id}
                        className="watch-on-card"
                        title={p.provider_name}
                      >
                        <Icon icon="fa-play-circle" size="xl" />
                        <span>{p.provider_name}</span>
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
      <Footer />
    </div>
  );
}

export default MovieDetails;
