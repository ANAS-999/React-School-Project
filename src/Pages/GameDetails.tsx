import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import VerifiedBadge from "../components/common/VerifiedBadge";
import { YouTubeVideo } from "../components/common/YouTubeVideo";
import GamesAPI from "../api/games_api";
import { getGameImageUrl } from "../utils/imageUtils";
import { GAME_WEBSITES_DATA, GameImageSize, GameWebsite } from "../types";
import type { GameModel } from "../models/GameModel";
import {
  addGameToLibrary,
  checkIfGameInLibrary,
  removeGameFromLibrary,
} from "../firebase/FirebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { LibraryModel } from "../models/LibraryModel";
import "./GameDetails.css";

const PLATFORM_ICKS: Record<string, string> = {
  PC: "fa-brands fa-windows",
  "PC (Windows)": "fa-brands fa-windows",
  PlayStation: "fa-brands fa-playstation",
  "PlayStation 5": "fa-brands fa-playstation",
  "PlayStation 4": "fa-brands fa-playstation",
  "PlayStation 3": "fa-brands fa-playstation",
  "PlayStation 2": "fa-brands fa-playstation",
  "PlayStation 1": "fa-brands fa-playstation",
  Xbox: "fa-brands fa-xbox",
  "Xbox Series X": "fa-brands fa-xbox",
  "Xbox Series S": "fa-brands fa-xbox",
  "Xbox One": "fa-brands fa-xbox",
  "Xbox 360": "fa-brands fa-xbox",
  "Xbox 180": "fa-brands fa-xbox",
  Nintendo: "fa-solid fa-gamepad",
  Switch: "fa-solid fa-gamepad",
  "Nintendo Switch": "fa-solid fa-gamepad",
  Wii: "fa-solid fa-gamepad",
  WiiU: "fa-solid fa-gamepad",
  GameCube: "fa-solid fa-gamepad",
  "Nintendo 3DS": "fa-solid fa-gamepad",
  "Nintendo DS": "fa-solid fa-gamepad",
  iOS: "fa-brands fa-apple",
  Android: "fa-brands fa-android",
  Linux: "fa-brands fa-linux",
  macOS: "fa-brands fa-apple",
  "Mac OS": "fa-brands fa-apple",
  Web: "fa-solid fa-globe",
  Browser: "fa-solid fa-globe",
};

function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [game, setGame] = useState<GameModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<
    number | null
  >(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLibrary, setIsCheckingLibrary] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

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

  useEffect(() => {
    if (!game) return;

    const checkLibrary = async () => {
      setIsCheckingLibrary(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const inLibrary = await checkIfGameInLibrary(game.id);
        setIsInLibrary(inLibrary);
      } else {
        setIsInLibrary(false);
      }
      setIsCheckingLibrary(false);
    };

    checkLibrary();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (game) {
        if (user) {
          const inLibrary = await checkIfGameInLibrary(game.id);
          setIsInLibrary(inLibrary);
        } else {
          setIsInLibrary(false);
        }
        setIsCheckingLibrary(false);
      }
    });

    return () => unsubscribe();
  }, [game?.id]);

  const handleAddToLibrary = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const auth = getAuth();
    if (!auth.currentUser) {
      setShowDialog(true);
      return;
    }

    if (isLoading || isCheckingLibrary) return;
    setIsLoading(true);

    try {
      if (isInLibrary) {
        await removeGameFromLibrary(game!.id);
        setIsInLibrary(false);
      } else {
        const libraryGame: LibraryModel = {
          id: game!.id,
          title: game!.title,
          image: game!.imageId
            ? getGameImageUrl(game!.imageId, GameImageSize.FHD)
            : undefined,
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
          <div className="error-content">
            <div className="error-icon">
              <Icon icon="fa-solid fa-ghost" size="2xl" />
            </div>
            <h2>Oops!</h2>
            <p className="error-message">{error}</p>
            <Link to="/discover" className="btn btn-primary">
              <Icon icon="fa-solid fa-gamepad" />
              Back to Games
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
        {/* Hero Section */}
        <div className="game-hero">
          <div className="game-hero-bg">
            {game.imageId && (
              <img
                src={getGameImageUrl(game.imageId, GameImageSize.FHD)}
                alt=""
              />
            )}
            <div className="overlay"></div>
          </div>
          <div className="container">
            <button
              className="back-link"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/discover");
                }
              }}
            >
              <Icon icon="fa-arrow-left" /> Back
            </button>
            <div className="game-hero-content">
              <div className="game-cover">
                {game.imageId ? (
                  <img
                    src={getGameImageUrl(game.imageId, GameImageSize.CoverBig)}
                    alt={game.title}
                  />
                ) : (
                  <div className="placeholder-cover">
                    <Icon icon="fa-gamepad" size="2xl" />
                  </div>
                )}
              </div>
              <div className="game-info">
                <h1>{game.title}</h1>
                <div className="game-meta">
                  {game.releaseYear && (
                    <span className="meta-item">
                      <Icon icon="fa-calendar" /> {game.releaseYear}
                    </span>
                  )}
                  {game.rating && (
                    <span className="meta-item rating">
                      <Icon icon="fa-star" /> {game.rating}%
                    </span>
                  )}
                </div>
                {game.genres && game.genres.length > 0 && (
                  <div className="game-tags">
                    {game.genres.map((g) => (
                      <span key={g} className="tag">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                {game && (
                  <div className="game-hero-websites">
                    <div className="game-hero-btns-group">
                      {game.websites &&
                        game.websites
                          .filter(
                            (w) =>
                              w.type === GameWebsite.Steam ||
                              w.type === GameWebsite.EpicGames,
                          )
                          .map((w) => (
                            <a
                              key={w.type}
                              href={w.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hero-website-btn"
                            >
                              <Icon
                                icon={
                                  GAME_WEBSITES_DATA[w.type]?.iconClass ||
                                  "fa-solid fa-gamepad"
                                }
                              />
                              <span>
                                {GAME_WEBSITES_DATA[w.type]?.title || "Store"}
                              </span>
                              <Icon
                                icon="fa-solid fa-arrow-up-right-from-square"
                                className="btn-icon"
                              />
                            </a>
                          ))}
                    </div>
                    <button
                      className={`add-to-library-details-btn ${isInLibrary ? "in-library" : ""} ${isLoading || isCheckingLibrary ? "disabled" : ""}`}
                      onClick={handleAddToLibrary}
                      onMouseEnter={() => setIsBtnHovered(true)}
                      onMouseLeave={() => setIsBtnHovered(false)}
                      title={
                        isInLibrary ? "Remove from Library" : "Add to Library"
                      }
                      disabled={isLoading || isCheckingLibrary}
                    >
                      {isLoading || isCheckingLibrary ? (
                        <Icon icon="fas fa-spinner fa-spin" />
                      ) : (
                        <Icon
                          icon={
                            isInLibrary
                              ? isBtnHovered
                                ? "fas fa-times"
                                : "fas fa-check"
                              : "fas fa-plus"
                          }
                        />
                      )}
                      <span className="btn-text">
                        {isCheckingLibrary
                          ? " Loading..."
                          : isInLibrary
                            ? isBtnHovered
                              ? " Remove"
                              : " In Library"
                            : " Add to Library"}
                      </span>
                    </button>
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
              <p className="summary">
                {game.summary || "No description available."}
              </p>
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
                    <YouTubeVideo
                      videoId={game.videos[0].videoId}
                      title={game.videos[0].name}
                    />
                    <p className="video-title">{game.videos[0].name}</p>
                  </div>
                  {game.videos.slice(1).map((video) => (
                    <div key={video.videoId} className="video-wrapper">
                      <YouTubeVideo
                        videoId={video.videoId}
                        title={video.name}
                      />
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
                        GameImageSize.FHD,
                      )}
                      alt="Selected Screenshot"
                    />
                  </div>
                  <div className="screenshots-grid">
                    {game.screenshots.map((screenshot, index) => (
                      <div
                        key={screenshot}
                        className={`screenshot-thumb ${selectedScreenshotIndex === index || (selectedScreenshotIndex === null && index === 0) ? "active" : ""}`}
                        onClick={() => setSelectedScreenshotIndex(index)}
                      >
                        <img
                          src={getGameImageUrl(
                            screenshot,
                            GameImageSize.ScreenshotMed,
                          )}
                          alt={`Screenshot ${index + 1}`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {game.websites &&
              game.websites.filter(
                (w) =>
                  ![
                    GameWebsite.Steam,
                    GameWebsite.EpicGames,
                    GameWebsite.GOG,
                    GameWebsite.Itchio,
                  ].includes(w.type as any),
              ).length > 0 && (
                <section className="media-section websites-section">
                  <h2>Websites & Socials</h2>
                  <div className="websites-grid">
                    {game.websites
                      .filter(
                        (w) =>
                          ![
                            GameWebsite.Steam,
                            GameWebsite.EpicGames,
                            GameWebsite.GOG,
                            GameWebsite.Itchio,
                          ].includes(w.type as any),
                      )
                      .map((w) => (
                        <a
                          key={w.type}
                          href={w.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="website-btn"
                        >
                          <Icon
                            icon={
                              GAME_WEBSITES_DATA[w.type]?.iconClass ||
                              "fa-solid fa-link"
                            }
                          />
                          <span className="website-name">
                            {GAME_WEBSITES_DATA[w.type]?.title || "Website"}
                          </span>
                          {w.trusted && <VerifiedBadge />}
                          <Icon
                            icon="fa-solid fa-arrow-up-right-from-square"
                            className="external-link-icon"
                          />
                        </a>
                      ))}
                  </div>
                </section>
              )}
          </div>
          <div className="side-col">
            {game.platforms && game.platforms.length > 0 && (
              <div className="info-card platforms-card">
                <h3>Platforms</h3>
                <div className="platforms-grid">
                  {game.platforms.map((p) => (
                    <span key={p} className="platform-badge">
                      <Icon icon={PLATFORM_ICKS[p] || "fa-solid fa-gamepad"} />
                      <span className="platform-name">{p}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="info-card">
              <h3>Quick Facts</h3>
              <div className="fact-list">
                {game.developers && game.developers.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Developer</span>
                    <span className="fact-value">
                      {game.developers.join(", ")}
                    </span>
                  </div>
                )}
                {game.publishers && game.publishers.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Publisher</span>
                    <span className="fact-value">
                      {game.publishers.join(", ")}
                    </span>
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
            {game.websites &&
              game.websites.filter((w) =>
                [
                  GameWebsite.Steam,
                  GameWebsite.EpicGames,
                  GameWebsite.GOG,
                  GameWebsite.Itchio,
                ].includes(w.type as any),
              ).length > 0 && (
                <div className="info-card stores-card">
                  <h3>Buy From</h3>
                  <div className="stores-grid">
                    {game.websites
                      .filter((w) =>
                        [
                          GameWebsite.Steam,
                          GameWebsite.EpicGames,
                          GameWebsite.GOG,
                          GameWebsite.Itchio,
                        ].includes(w.type as any),
                      )
                      .map((w) => (
                        <a
                          key={w.type}
                          href={w.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="store-btn"
                        >
                          <div className="store-icon-wrapper">
                            <Icon
                              icon={
                                GAME_WEBSITES_DATA[w.type]?.iconClass ||
                                "fa-solid fa-store"
                              }
                            />
                          </div>
                          <span className="store-name">
                            {GAME_WEBSITES_DATA[w.type]?.title || "Store"}
                          </span>
                          {w.trusted && <VerifiedBadge />}
                          <Icon
                            icon="fa-solid fa-chevron-right"
                            className="store-action-icon"
                          />
                        </a>
                      ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {game.similarGames && game.similarGames.length > 0 && (
          <section className="container similar-games-section">
            <h2>Similar Games You Might Like</h2>
            <div className="similar-games-grid">
              {game.similarGames.map((similar) => (
                <Link
                  to={`/games/${similar.id}`}
                  key={similar.id}
                  className="similar-game-card group"
                >
                  <div className="similar-game-image">
                    {similar.imageId ? (
                      <div className="image-container">
                        <img
                          src={getGameImageUrl(
                            similar.imageId,
                            GameImageSize.HD,
                          )}
                          alt={similar.title}
                          loading="lazy"
                          onLoad={(e) => {
                            (e.target as HTMLImageElement).classList.add(
                              "loaded",
                            );
                          }}
                        />
                        <div className="placeholder loading-placeholder">
                          <Icon icon="fa-gamepad" />
                        </div>
                      </div>
                    ) : (
                      <div className="placeholder">
                        <Icon icon="fa-gamepad" />
                      </div>
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
          <button
            className="return-to-top-btn"
            onClick={() => window.scrollTo(0, 0)}
          >
            <Icon icon="fa-arrow-up" /> Return to Top
          </button>
        </div>
      </main>

      {showDialog && (
        <div className="auth-dialog-overlay" onClick={closeDialog}>
          <div className="auth-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Login Required</h3>
            <p>You must be logged in to add games to your library.</p>
            <div className="auth-dialog-buttons">
              <button className="auth-dialog-btn cancel" onClick={closeDialog}>
                Cancel
              </button>
              <button className="auth-dialog-btn login" onClick={goToLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default GameDetails;
