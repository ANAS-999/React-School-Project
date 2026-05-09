import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../common/Icon";
import type { AnimeModel } from "../../models/AnimeModel";
import { addAnimeTolibrary, checkIfAnimeInLibrary, removeAnimeFromLibrary } from "../../firebase/FirebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { LibraryModel } from "../../models/LibraryModel";
import "./GameCard.css";

interface AnimeCardProps {
  anime: AnimeModel;
}

function AnimeCard({ anime }: AnimeCardProps) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLibrary, setIsCheckingLibrary] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const inLibrary = await checkIfAnimeInLibrary(anime.id);
        setIsInLibrary(inLibrary);
      } else {
        setIsInLibrary(false);
      }
      setIsCheckingLibrary(false);
    });
    return () => unsubscribe();
  }, [anime.id]);

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
        await removeAnimeFromLibrary(anime.id);
        setIsInLibrary(false);
      } else {
        const libraryAnime: LibraryModel = {
          id: anime.id,
          title: anime.title,
          image: anime.imageId || undefined
        };
        
        await addAnimeTolibrary(libraryAnime);
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
    navigate("/signin");
  };

  return (
    <>
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
                <span key={index} className="genre-tag anime-genre-tag">{genre}</span>
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
    
    {showDialog && (
      <div className="auth-dialog-overlay" onClick={closeDialog}>
        <div className="auth-dialog" onClick={(e) => e.stopPropagation()}>
          <h3>Login Required</h3>
          <p>You must be logged in to add anime to your library.</p>
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

export default AnimeCard;