import { useState, useEffect } from "react";
import type { GameModel } from "../../models/GameModel";
import { GameImageSize } from "../../types";
import { getGameImageUrl } from "../../utils/imageUtils";
import { Icon } from "../common/Icon";
import { useNavigate, useLocation } from "react-router-dom";
import { addGameToLibrary, checkIfGameInLibrary, removeGameFromLibrary } from "../../firebase/FirebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { LibraryModel } from "../../models/LibraryModel";
import "./GameCard.css";

interface GameCardProps {
  game: GameModel;
}

function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLibrary, setIsCheckingLibrary] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const inLibrary = await checkIfGameInLibrary(game.id);
        setIsInLibrary(inLibrary);
      } else {
        setIsInLibrary(false);
      }
      setIsCheckingLibrary(false);
    });
    return () => unsubscribe();
  }, [game.id]);

  const getRatingColor = (rating: number | null) => {
    if (!rating) return "var(--text-tertiary)";
    if (rating >= 85) return "var(--success)";
    if (rating >= 70) return "var(--warning)";
    return "var(--error)";
  };

  const getPlatformIcon = (platformName: string) => {
    const name = platformName.toLowerCase();
    if (name.includes("playstation") || name.includes("ps")) return "fab fa-playstation";
    if (name.includes("xbox")) return "fab fa-xbox";
    if (name.includes("pc") || name.includes("windows")) return "fab fa-windows";
    if (name.includes("nintendo") || name.includes("switch") || name.includes("wii") || name.includes("ds")) return "fas fa-gamepad";
    if (name.includes("mac") || name.includes("apple")) return "fab fa-apple";
    if (name.includes("linux")) return "fab fa-linux";
    if (name.includes("android")) return "fab fa-android";
    return null;
  };

  // Extract unique platforms
  const uniquePlatformIcons = Array.from(
    new Set(game.platforms.map(getPlatformIcon).filter(Boolean))
  ) as string[];

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
        await removeGameFromLibrary(game.id);
        setIsInLibrary(false);
      } else {
        const libraryGame: LibraryModel = {
          id: game.id,
          title: game.title,
          image: game.imageId ? getGameImageUrl(game.imageId, GameImageSize.FHD) : undefined
        };
        
        await addGameToLibrary(libraryGame);
        setIsInLibrary(true);
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

return (
    <>
      <div className="game-card group" onClick={() => navigate(`/games/${game.id}`)}>
        <div className="game-card-inner">
          <div className="game-card-image">
            {game.imageId ? (
              <div className="image-container">
                <img 
                  src={getGameImageUrl(game.imageId, GameImageSize.FHD)} 
                  alt={game.title} 
                  loading="lazy"
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).classList.add('loaded');
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement?.classList.add('image-error');
                  }}
                />
                <div className="game-card-placeholder loading-placeholder">
                  <Icon icon="fa-gamepad" size="2xl" />
                </div>
              </div>
            ) : (
              <div className="game-card-placeholder">
                <Icon icon="fa-gamepad" size="2xl" />
              </div>
            )}
            
            <button 
              className={`add-to-library-btn ${isInLibrary ? 'in-library' : ''} ${isLoading ? 'loading' : ''} ${isCheckingLibrary ? 'checking' : ''}`} 
              onClick={handleAddToLibrary} 
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              title={isInLibrary ? "Remove from Library" : "Add to Library"}
              disabled={isLoading || isCheckingLibrary}
            >
              {isLoading ? (
                <Icon icon="fas fa-spinner fa-spin" />
              ) : (
                <Icon icon={isInLibrary ? (isBtnHovered ? "fas fa-times" : "fas fa-check") : "fas fa-plus"} />
              )}
            </button>
            
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
            <div className="game-card-platforms">
              {uniquePlatformIcons.map((icon, index) => (
                <Icon key={index} icon={icon} className="platform-icon" title={icon.split('-')[2] || 'Platform'} />
              ))}
            </div>
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
      
      {showDialog && (
        <div className="auth-dialog-overlay" onClick={closeDialog}>
          <div className="auth-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Login Required</h3>
            <p>You must be logged in to add games to your library.</p>
            <div className="auth-dialog-buttons">
              <button className="auth-dialog-btn cancel" onClick={closeDialog}>Cancel</button>
              <button className="auth-dialog-btn login" onClick={goToLogin}>Login</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GameCard;