import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import GamesAPI from "../api/games_api";
import { getGameImageUrl } from "../utils/imageUtils";
import { GameImageSize } from "../types";
import type { GameModel } from "../models/GameModel";
import "./GameDetails.css";

function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);

  useEffect(() => {
    // Scroll to top when the component mounts or when the id changes
    window.scrollTo(0, 0);
    
    // We should implement getGameById in GamesAPI
    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        const api = new GamesAPI();
        const data = await api.getGameById(Number(id));
        if (data) {
          setGame(data);
        } else {
          setError("Game not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load game details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="game-details-page loading">
          <div className="container">
            <Icon icon="fa-spinner" className="fa-spin" size="2xl" />
            <p>Loading game details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div>
        <Header />
        <main className="game-details-page error">
          <div className="container">
            <Icon icon="fa-triangle-exclamation" size="2xl" />
            <h2>Oops!</h2>
            <p>{error}</p>
            <Link to="/discover" className="btn btn-primary">Back to Discover</Link>
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
        {/* Hero Section */}
        <div className="game-hero">
          <div className="game-hero-bg">
            {game.imageId && (
              <img src={getGameImageUrl(game.imageId, GameImageSize.FHD)} alt="" />
            )}
            <div className="overlay"></div>
          </div>
          <div className="container">
            <Link to="/discover" className="back-link">
              <Icon icon="fa-arrow-left" /> Back to Discover
            </Link>
            <div className="game-hero-content">
              <div className="game-cover">
                {game.imageId ? (
                  <img src={getGameImageUrl(game.imageId, GameImageSize.CoverBig)} alt={game.title} />
                ) : (
                  <div className="placeholder-cover"><Icon icon="fa-gamepad" size="2xl" /></div>
                )}
              </div>
              <div className="game-info">
                <h1>{game.title}</h1>
                <div className="game-meta">
                  {game.releaseYear && <span className="meta-item"><Icon icon="fa-calendar" /> {game.releaseYear}</span>}
                  {game.rating && <span className="meta-item rating"><Icon icon="fa-star" /> {game.rating}%</span>}
                </div>
                {game.genres && game.genres.length > 0 && (
                  <div className="game-tags">
                    {game.genres.map(g => <span key={g} className="tag">{g}</span>)}
                  </div>
                )}
                {game.platforms && game.platforms.length > 0 && (
                  <div className="game-platforms-list">
                    {game.platforms.map(p => <span key={p} className="platform-badge">{p}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container game-content">
          <div className="main-col">
            <section className="about-section">
              <h2>About</h2>
              <p className="summary">{game.summary || "No description available."}</p>
              {game.storyline && (
                <>
                  <h3 className="section-subtitle">Storyline</h3>
                  <p className="summary">{game.storyline}</p>
                </>
              )}
            </section>

            {game.videos && game.videos.length > 0 && (
              <section className="media-section">
                <h2>Videos & Trailers</h2>
                <div className="videos-grid">
                  <div className="video-wrapper video-main">
                    <iframe
                      src={`https://www.youtube.com/embed/${game.videos[0].videoId}`}
                      title={game.videos[0].name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <p className="video-title">{game.videos[0].name}</p>
                  </div>
                  {game.videos.slice(1).map(video => (
                    <div key={video.videoId} className="video-wrapper">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <p className="video-title">{video.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {game.screenshots && game.screenshots.length > 0 && (
              <section className="media-section">
                <h2>Screenshots</h2>
                <div className="screenshots-viewer">
                  <div className="screenshot-main">
                    <img 
                      src={getGameImageUrl(
                        game.screenshots[selectedScreenshotIndex ?? 0], 
                        GameImageSize.FHD
                      )} 
                      alt="Selected Screenshot" 
                    />
                  </div>
                  <div className="screenshots-grid">
                    {game.screenshots.map((screenshot, index) => (
                      <div 
                        key={screenshot} 
                        className={`screenshot-thumb ${selectedScreenshotIndex === index || (selectedScreenshotIndex === null && index === 0) ? 'active' : ''}`}
                        onClick={() => setSelectedScreenshotIndex(index)}
                      >
                        <img src={getGameImageUrl(screenshot, GameImageSize.ScreenshotMed)} alt={`Screenshot ${index + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
          <div className="side-col">
             <div className="info-card">
               <h3>Quick Facts</h3>
               <div className="fact-list">
                 {game.developers && game.developers.length > 0 && (
                   <div className="fact-item">
                     <span className="fact-label">Developer</span>
                     <span className="fact-value">{game.developers.join(", ")}</span>
                   </div>
                 )}
                 {game.publishers && game.publishers.length > 0 && (
                   <div className="fact-item">
                     <span className="fact-label">Publisher</span>
                     <span className="fact-value">{game.publishers.join(", ")}</span>
                   </div>
                 )}
                 {game.releaseYear && (
                   <div className="fact-item">
                     <span className="fact-label">Release Year</span>
                     <span className="fact-value">{game.releaseYear}</span>
                   </div>
                 )}
                 {game.genres && game.genres.length > 0 && (
                   <div className="fact-item">
                     <span className="fact-label">Genres</span>
                     <span className="fact-value">{game.genres.join(", ")}</span>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        {game.similarGames && game.similarGames.length > 0 && (
          <section className="container similar-games-section">
            <h2>Similar Games You Might Like</h2>
            <div className="similar-games-grid">
              {game.similarGames.map(similar => (
                <Link to={`/games/${similar.id}`} key={similar.id} className="similar-game-card group">
                  <div className="similar-game-image">
                    {similar.imageId ? (
                      <img src={getGameImageUrl(similar.imageId, GameImageSize.HD)} alt={similar.title} loading="lazy" />
                    ) : (
                      <div className="placeholder"><Icon icon="fa-gamepad" /></div>
                    )}
                  </div>
                  <div className="similar-game-info">
                    <h4>{similar.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="return-to-top-container">
          <button className="return-to-top-btn" onClick={() => window.scrollTo(0, 0)}>
            <Icon icon="fa-arrow-up" /> Return to Top
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default GameDetails;