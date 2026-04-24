import type { GameModel } from "../../models/GameModel";
import { GameImageSize } from "../../types";
import { getGameImageUrl } from "../../utils/imageUtils";
import "./GameCard.css";

interface GameCardProps {
  game: GameModel;
}

function GameCard({ game }: GameCardProps) {  
  return (
    <div className="game-card">
      <div className="game-card-image">
        {game.imageId ? (
          <img src={getGameImageUrl(game.imageId, GameImageSize.HD)} alt={game.title} />
        ) : (
          <div className="game-card-placeholder">No Image</div>
        )}
        <span className="game-card-rating">{game.rating.toFixed(0)}%</span>
      </div>
      <div className="game-card-content">
        <h3 className="game-card-title">{game.title}</h3>
        <div className="game-card-info">
          <span>{game.year || "TBA"}</span>
          <span className="game-card-hypes">{game.hypes} hypes</span>
        </div>
      </div>
    </div>
  );
}

export default GameCard;