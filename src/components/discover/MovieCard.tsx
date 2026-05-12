import type { MovieModel } from "../../models/MovieModel";
import { Icon } from "../common/Icon";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GameCard.css";
import {
  addMovieTolibrary,
  removeMovieFromLibrary,
  checkIfMovieInLibrary,
} from "../../firebase/FirebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { LibraryModel } from "../../models/LibraryModel";

interface MovieCardProps {
  movie: MovieModel;
<<<<<<< Updated upstream
  // inLibrary : bool
}

function MovieCard({ movie }: MovieCardProps) {
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
         const inLibrary = await checkIfMovieInLibrary(movie.id);
         setIsInLibrary(inLibrary);
       } else {
         setIsInLibrary(false);
       }
       setIsCheckingLibrary(false);
     });
     return () => unsubscribe();
   }, [movie.id]);
 
   const getRatingColor = (rating: number | null) => {
     if (!rating) return "var(--text-tertiary)";
     if (rating >= 85) return "var(--success)";
     if (rating >= 70) return "var(--warning)";
     return "var(--error)";
   };
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
         await removeMovieFromLibrary(movie.id);
         setIsInLibrary(false);
       } else {
         const libraryMovie: LibraryModel = {
           id: movie.id,
           title: movie.title,
           image: movie.posterUrl,
         };
         
         await addMovieTolibrary(libraryMovie);
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
=======

}

function MovieCard({ movie }: MovieCardProps ) {
  const navigate = useNavigate();
  const [details, setDetails] = useState<MovieModel | null>(null);
  const [saved,setSaved]=useState(false);
  const [savedMovie,setSsavedMovie]=useState<string[]>([]);

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
>>>>>>> Stashed changes

  return (
    <>
      <div className="game-card group" onClick={() => navigate(`/movies/${movie.id}`)}>
        <div className="game-card-inner">
<div className="game-card-image">
              {movie.posterUrl ? (
                <div className="image-container">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
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
                    <Icon icon="fa-film" size="2xl" />
                  </div>
                </div>
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
            
            {movie.rating && (
              <div className="game-card-rating" style={{ color: getRatingColor(movie.rating) }}>
                <Icon icon="fa-star" className="rating-icon" />
                <span>{movie.rating.toFixed(0)}%</span>
              </div>
            )}
          </div>

          <div className="game-card-content">
            <h3 className="game-card-title">{movie.title}</h3>
            <div className="game-card-info">
              <span className="game-card-year">
                <Icon icon="fa-calendar" /> {movie.releaseYear || "TBA"}
              </span>
              {movie.genres && movie.genres.length > 0 && (
                <span className="game-card-genre">{movie.genres[0]}</span>
              )}
            </div>

           

            <div className="game-card-hidden">
              <h3>Summary</h3>
              <p className="game-card-description">{movie.summary}</p>
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

export default MovieCard;
