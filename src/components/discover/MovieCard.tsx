import type { MovieModel } from "../../models/MovieModel";
import { Icon } from "../common/Icon";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MoviesAPI from "../../api/movie_api";
import "./MovieCard.css";

interface MovieCardProps {
  movie: MovieModel;
}

function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const [details, setDetails] = useState<MovieModel | null>(null);

  useEffect(() => {
    // If the movie prop lacks key details, try to fetch full data from the API
    if ((!movie.posterUrl || !movie.summary) && movie.id) {
      let mounted = true;
      const api = new MoviesAPI();
      api.getMovieById(movie.id as any)
        .then((res) => {
          if (mounted && res) setDetails(res);
        })
        .catch(() => {
          /* ignore fetch errors, keep using provided prop */
        })
        .finally(() => {
          // no loading state needed here; we quietly enrich the card data
        });

      return () => { mounted = false; };
    }
    return;
  }, [movie]);

  const getRatingColor = (rating: number | null) => {
    if (!rating) return "var(--text-tertiary)";
    if (rating >= 85) return "var(--success)";
    if (rating >= 70) return "var(--warning)";
    return "var(--error)";
  };

  const displayed = details ?? movie;

  return (
    <div className="movie-card group" onClick={() => navigate(`/movies/${movie.id}`)}>
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
            <div className="movie-card-rating" style={{ color: getRatingColor(displayed.rating) }}>
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
