import { useNavigate } from "react-router-dom";
import { Icon } from "../common/Icon";
import type { AnimeModel } from "../../models/AnimeModel";
import "./GameCard.css";

interface AnimeCardProps {
  anime: AnimeModel;
}

function AnimeCard({ anime }: AnimeCardProps) {
  const navigate = useNavigate();

  return (
    <div className="game-card group" onClick={() => navigate(`/anime/${anime.id}`)}>
      <div className="game-card-inner">
        <div className="game-card-image">
          {anime.imageId && anime.imageId.length > 0 ? (
            <img 
              src={anime.imageId} 
              alt={anime.title}
              loading="lazy"
            />
          ) : (
            <div className="game-card-placeholder">
              <Icon icon="fa-film" size="2xl" />
            </div>
          )}
          {anime.rating && (
            <div className="game-card-rating">
              <Icon icon="fa-star" className="rating-icon" />
              <span>{(anime.rating / 10).toFixed(1)}</span>
            </div>
          )}
          {anime.episodes && (
            <div className="game-card-eps">
              <span>{anime.episodes} eps</span>
            </div>
          )}
        </div>
        <div className="game-card-content">
          <h3 className="game-card-title">{anime.title}</h3>
          <div className="game-card-info">
            {anime.releaseYear && (
              <span className="game-card-year">
                <Icon icon="fa-calendar" /> {anime.releaseYear}
              </span>
            )}
            {anime.status && (
              <span className="game-card-genre">{anime.status}</span>
            )}
          </div>
          
          {anime.genres.length > 0 && (
            <div className="game-card-genres">
              {anime.genres.slice(0, 2).map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
            </div>
          )}
          
          <div className="game-card-hidden">
            <h3>Synopsis</h3>
            <p className="game-card-description">{anime.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;