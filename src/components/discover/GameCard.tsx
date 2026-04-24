import type { GameModel } from "../../models/GameModel";
import { GameImageSize } from "../../types";
import { getGameImageUrl } from "../../utils/imageUtils";
import { Icon } from "../common/Icon";
import "./GameCard.css";

interface GameCardProps {
  game: GameModel;
}

function GameCard({ game }: GameCardProps) {
  const getRatingColor = (rating: number | null) => {
    if (!rating) return "var(--text-tertiary)";
    if (rating >= 85) return "var(--success)";
    if (rating >= 70) return "var(--warning)";
    return "var(--error)";
  };

  return (
    <div className="game-card group">
      <div className="game-card-inner">
        <div className="game-card-image">
          {game.imageId ? (
            <img src={getGameImageUrl(game.imageId, GameImageSize.FHD)} alt={game.title} />
          ) : (
            <div className="game-card-placeholder">
              <Icon icon="fa-gamepad" size="2xl" />
            </div>
          )}
          {game.rating && (
            <div 
              className="game-card-rating"
              style={{ color: getRatingColor(game.rating) }}
            >
              <Icon icon="fa-star" className="rating-icon" />
              <span>{game.rating.toFixed(0)}%</span>
            </div>
          )}
        </div>
        <div className="game-card-content">
          <h3 className="game-card-title">{game.title}</h3>
          <div className="game-card-info">
            <span className="game-card-year">
              <Icon icon="fa-calendar" /> {game.releaseYear || "TBA"}
            </span>
            {game.genres.length > 0 && (
              <span className="game-card-genre">{game.genres[0]}</span>
            )}
          </div>
          
          <div className="game-card-hidden">
            <h3>Summary</h3>
            <p className="game-card-description">{game.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;