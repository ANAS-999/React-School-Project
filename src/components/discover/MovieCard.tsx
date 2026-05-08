import type { MovieModel } from "../../models/MovieModel";
import { Icon } from "../common/Icon";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MoviesAPI from "../../api/movie_api";
import "./MovieCard.css";
import {
  addMovieTolibrary,
  removeMovieFromLibrary,
  fetchMovieToLibrary,
} from "../../firebase/FirebaseService";
import { getAuth } from "firebase/auth";
import type { LibraryModel } from "../../models/LibraryModel";

interface MovieCardProps {
  movie: MovieModel;
  // inLibrary : bool
}

function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const [details, setDetails] = useState<MovieModel | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedMovie, setSsavedMovie] = useState<string[]>([]);

  /* useEffect(() => {
    if ((!movie.posterUrl || !movie.summary) && movie.id) {
      let mounted = true;
      const api = new MoviesAPI();
      api.getMovieById(movie.id as any)
        .then((res) => {
          if (mounted && res) setDetails(res);
        })
        .catch(() => {
        })
        .finally(() => {
        });

      return () => { mounted = false; };
    }
    return;
  }, [movie]); */

  const getRatingColor = (rating: number | null) => {
    if (!rating) return "var(--text-tertiary)";
    if (rating >= 85) return "var(--success)";
    if (rating >= 70) return "var(--warning)";
    return "var(--error)";
  };

  const handleAddToLibrary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const auth = getAuth();
    // persist to Firestore for logged-in users
    if (auth.currentUser) {
      await addMovieTolibrary({
        id: displayed.id,
        title: displayed.title,
        image: displayed.posterUrl,
      });
    } else {
      // fallback to localStorage for anonymous users
      try {
        const raw = localStorage.getItem("savedMovies");
        const local: string[] = raw ? JSON.parse(raw) : [];
        if (displayed.id && !local.includes(displayed.id as string)) {
          local.push(displayed.id as string);
          localStorage.setItem("savedMovies", JSON.stringify(local));
        }
      } catch (e) {
        // ignore
      }
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
    const loadLibrary = async () => {
      const auth = getAuth();
      if (auth.currentUser) {
        const movies = await fetchMovieToLibrary();
        setSsavedMovie(movies);
        setSaved(movies.includes(movie.id as string));
        return;
      }

      // fallback to localStorage for anonymous users
      try {
        const raw = localStorage.getItem("savedMovies");
        const local: string[] = raw ? JSON.parse(raw) : [];
        setSsavedMovie(local);
        setSaved(local.includes(movie.id as string));
      } catch (e) {
        setSsavedMovie([]);
        setSaved(false);
      }
    };

    loadLibrary();
  }, [movie.id]);

  return (
    <div
      className="movie-card group"
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      <div className="movie-card-inner">
        <div className="movie-card-image">
          {displayed.posterUrl ? (
            <img src={displayed.posterUrl} alt={displayed.title} />
          ) : (
            <div className="movie-card-placeholder">
              <Icon icon="fa-film" size="2xl" />
            </div>
          )}

          {displayed.rating && (
            <div
              className="movie-card-rating"
              style={{ color: getRatingColor(displayed.rating) }}
            >
              <Icon icon="fa-star" className="rating-icon" />
              <span>{displayed.rating.toFixed(0)}%</span>
            </div>
          )}
        </div>

        <div className="movie-card-content">
          <h3 className="movie-card-title">{displayed.title}</h3>
          <div className="movie-card-info">
            <span className="movie-card-year">
              <Icon icon="fa-calendar" /> {displayed.releaseYear || "TBA"}
            </span>
            {displayed.genres && displayed.genres.length > 0 && (
              <span className="movie-card-genre">{displayed.genres[0]}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={`library-btn ${saved ? "library-btn--saved" : ""}`}
              onClick={handleAddToLibrary}
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

          <div className="movie-card-hidden">
            <h3>Summary</h3>
            <p className="movie-card-description">{displayed.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
