import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import AnimeAPI from "../api/anime_api";
import type { AnimeModel } from "../models/AnimeModel";
import {
  addAnimeTolibrary,
  checkIfAnimeInLibrary,
  removeAnimeFromLibrary,
} from "../firebase/FirebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { LibraryModel } from "../models/LibraryModel";
import "./AnimeDetails.css";

function AnimeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [anime, setAnime] = useState<AnimeModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playTrailer, setPlayTrailer] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLibrary, setIsCheckingLibrary] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const cleanText = (text: string | null | undefined) => {
    if (!text) return "";
    return text
      .replace(/\[Written by.*?\]/gi, "")
      .replace(/\(Written by.*?\)/gi, "")
      .trim();
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAnimeDetails = async () => {
      setLoading(true);
      try {
        const api = new AnimeAPI();
        const data = await api.getAnimeById(Number(id));

        if (data) {
          setAnime(data);
        } else {
          setError("Anime not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load anime details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimeDetails();
    }
  }, [id]);

  useEffect(() => {
    if (!anime) return;

    const checkLibrary = async () => {
      setIsCheckingLibrary(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const inLibrary = await checkIfAnimeInLibrary(anime.id);
        setIsInLibrary(inLibrary);
      } else {
        setIsInLibrary(false);
      }
      setIsCheckingLibrary(false);
    };

    checkLibrary();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (anime) {
        if (user) {
          const inLibrary = await checkIfAnimeInLibrary(anime.id);
          setIsInLibrary(inLibrary);
        } else {
          setIsInLibrary(false);
        }
        setIsCheckingLibrary(false);
      }
    });

    return () => unsubscribe();
  }, [anime?.id]);

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
        await removeAnimeFromLibrary(anime!.id);
        setIsInLibrary(false);
      } else {
        const libraryAnime: LibraryModel = {
          id: anime!.id,
          title: anime!.title,
          image: anime!.imageId || undefined,
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
    navigate("/signin", { state: { from: location.pathname } });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="anime-details-page loading">
          <div className="container">
            <Icon icon="fa-spinner" className="fa-spin" size="2xl" />
            <p>Loading anime details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div>
        <Header />
        <main className="anime-details-page error">
          <div className="error-content">
            <div className="error-icon">
              <Icon icon="fa-solid fa-ghost" size="2xl" />
            </div>
            <h2>Oops!</h2>
            <p className="error-message">{error}</p>
            <Link to="/animes" className="btn btn-primary">
              <Icon icon="fa-solid fa-film" />
              Back to Animes
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
      <main className="anime-details-page">
        <div className="anime-hero">
          <div className="anime-hero-bg">
            {anime.imageId && <img src={anime.imageId} alt="" />}
            <div className="overlay"></div>
          </div>
          <div className="container">
            <button
              className="back-link"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/animes");
                }
              }}
            >
              <Icon icon="fa-arrow-left" /> Back
            </button>
            <div className="anime-hero-content">
              <div className="anime-cover">
                {anime.imageId ? (
                  <img src={anime.imageId} alt={anime.title} />
                ) : (
                  <div className="placeholder-cover">
                    <Icon icon="fa-film" size="2xl" />
                  </div>
                )}
              </div>
              <div className="anime-info">
                <h1>{anime.title}</h1>
                <div className="anime-meta">
                  {anime.releaseYear && (
                    <span className="meta-item">
                      <Icon icon="fa-calendar" /> {anime.releaseYear}
                    </span>
                  )}
                  {anime.rating && (
                    <span className="meta-item rating">
                      <Icon icon="fa-star" /> {(anime.rating / 10).toFixed(1)}
                    </span>
                  )}
                  {anime.episodes && (
                    <span className="meta-item">
                      <Icon icon="fa-list" /> {anime.episodes} episodes
                    </span>
                  )}
                  {anime.status && (
                    <span className="meta-item">
                      <Icon icon="fa-circle" /> {anime.status}
                    </span>
                  )}
                </div>
                {anime.genres && anime.genres.length > 0 && (
                  <div className="anime-tags">
                    {anime.genres.map((g, i) => (
                      <span key={i} className="tag">{g}</span>
                    ))}
                  </div>
                )}
                <div className="anime-hero-websites">
                  <div className="anime-hero-btns-group">
                    {anime.streaming && anime.streaming.length > 0 && (
                      <div className="watch-on-buttons">
                        {anime.streaming.slice(0, 4).map((s, i) => {
                          const isNetflix = s.name.toLowerCase().includes('netflix');
                          const isCrunchyroll = s.name.toLowerCase().includes('crunchyroll');
                          return (
                            <a
                              key={i}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`hero-website-btn ${isNetflix ? 'netflix' : ''} ${isCrunchyroll ? 'crunchyroll' : ''}`}
                            >
                              <Icon icon={isNetflix ? "fa-solid fa-n" : "fa-solid fa-play"} />
                              <span>{s.name}</span>
                              <Icon icon="fa-solid fa-arrow-up-right-from-square" className="btn-icon" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    className={`add-to-library-details-btn ${isInLibrary ? "in-library" : ""} ${isLoading || isCheckingLibrary ? "disabled" : ""}`}
                    onClick={handleAddToLibrary}
                    onMouseEnter={() => setIsBtnHovered(true)}
                    onMouseLeave={() => setIsBtnHovered(false)}
                    title={isInLibrary ? "Remove from Library" : "Add to Library"}
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
              </div>
            </div>
          </div>
        </div>

        <div className="container anime-content">
          <div className="main-col">
            <section className="about-section">
              <h2>Synopsis</h2>
              <p className="summary">{cleanText(anime.summary)}</p>
              {anime.storyline && anime.storyline !== anime.summary && (
                <>
                  <h3 className="section-subtitle">Storyline</h3>
                  <p className="summary">{cleanText(anime.storyline)}</p>
                </>
              )}
            </section>

            {anime.background && (
              <section className="about-section">
                <h2>Background</h2>
                <p className="summary">{anime.background}</p>
              </section>
            )}

            {anime.titleJapanese && (
              <section className="about-section">
                <h2>Alternative Titles</h2>
                <div className="alt-titles">
                  <div className="alt-title-item">
                    <span className="alt-title-label">Japanese</span>
                    <span className="alt-title-value">
                      {anime.titleJapanese}
                    </span>
                  </div>
                  {anime.titleSynonyms && anime.titleSynonyms.length > 0 && (
                    <div className="alt-title-item">
                      <span className="alt-title-label">Synonyms</span>
                      <span className="alt-title-value">
                        {anime.titleSynonyms.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {(anime.openings && anime.openings.length > 0) ||
            (anime.endings && anime.endings.length > 0) ? (
              <section className="media-section anime-music-section">
                <h2>Music</h2>
                <div className="music-section">
                  {anime.openings && anime.openings.length > 0 && (
                    <div className="music-group">
                      <h4>Opening Themes</h4>
                      <ul className="music-list">
                        {anime.openings.map((op, i) => (
                          <li key={i}>{op}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {anime.endings && anime.endings.length > 0 && (
                    <div className="music-group">
                      <h4>Ending Themes</h4>
                      <ul className="music-list">
                        {anime.endings.map((ed, i) => (
                          <li key={i}>{ed}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            ) : null}

            {anime.trailer && (
              <section className="trailer-section">
                <h2>Trailer</h2>
                <div className="videos-grid">
                  <div className="video-main video-wrapper">
                    {!playTrailer ? (
                      <div
                        className="video-thumbnail"
                        onClick={() => setPlayTrailer(true)}
                        style={{
                          backgroundImage: anime.imageId
                            ? `url(${anime.imageId})`
                            : undefined,
                        }}
                      >
                        <div className="video-play-btn">
                          <Icon icon="fa-play" size="2xl" />
                        </div>
                        <span className="video-label">
                          Click to play trailer
                        </span>
                      </div>
                    ) : (
                      <iframe
                        src={anime.trailer.embedUrl + "&autoplay=1"}
                        title={anime.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="side-col">
            <div className="info-card">
              <h3>Details</h3>
              <div className="fact-list">
                {anime.type && (
                  <div className="fact-item">
                    <span className="fact-label">Type</span>
                    <span className="fact-value">{anime.type}</span>
                  </div>
                )}
                {anime.source && (
                  <div className="fact-item">
                    <span className="fact-label">Source</span>
                    <span className="fact-value">{anime.source}</span>
                  </div>
                )}
                {anime.releaseYear && (
                  <div className="fact-item">
                    <span className="fact-label">Season</span>
                    <span className="fact-value">
                      {anime.season
                        ? anime.season.charAt(0).toUpperCase() +
                          anime.season.slice(1)
                        : anime.releaseYear}
                    </span>
                  </div>
                )}
                {anime.releaseYear && (
                  <div className="fact-item">
                    <span className="fact-label">Year</span>
                    <span className="fact-value">{anime.releaseYear}</span>
                  </div>
                )}
                {anime.status && (
                  <div className="fact-item">
                    <span className="fact-label">Status</span>
                    <span className="fact-value">{anime.status}</span>
                  </div>
                )}
                {anime.episodes && (
                  <div className="fact-item">
                    <span className="fact-label">Episodes</span>
                    <span className="fact-value">{anime.episodes}</span>
                  </div>
                )}
                {anime.duration && (
                  <div className="fact-item">
                    <span className="fact-label">Duration</span>
                    <span className="fact-value">{anime.duration}</span>
                  </div>
                )}
                {anime.ratingValue && (
                  <div className="fact-item">
                    <span className="fact-label">Rating</span>
                    <span className="fact-value">{anime.ratingValue}</span>
                  </div>
                )}
                {anime.studio && (
                  <div className="fact-item">
                    <span className="fact-label">Studio</span>
                    <span className="fact-value">{anime.studio}</span>
                  </div>
                )}
                {anime.broadcast && (
                  <div className="fact-item">
                    <span className="fact-label">Broadcast</span>
                    <span className="fact-value">{anime.broadcast}</span>
                  </div>
                )}
                {anime.genres && anime.genres.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Genres</span>
                    <span className="fact-value">
                      {anime.genres.join(", ")}
                    </span>
                  </div>
                )}
                {anime.themes && anime.themes.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Themes</span>
                    <span className="fact-value">
                      {anime.themes.join(", ")}
                    </span>
                  </div>
                )}
                {anime.demographics && anime.demographics.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Demographic</span>
                    <span className="fact-value">
                      {anime.demographics.join(", ")}
                    </span>
                  </div>
                )}
                {anime.producers && anime.producers.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Producers</span>
                    <span className="fact-value">
                      {anime.producers.slice(0, 3).join(", ")}
                      {anime.producers.length > 3
                        ? ` +${anime.producers.length - 3}`
                        : ""}
                    </span>
                  </div>
                )}
                {anime.licensors && anime.licensors.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Licensors</span>
                    <span className="fact-value">
                      {anime.licensors.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {anime.externalLinks && anime.externalLinks.length > 0 && (
              <div className="info-card">
                <h3>Links</h3>
                <div className="external-links">
                  {anime.externalLinks.slice(0, 6).map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {anime.similarAnime && anime.similarAnime.length > 0 && (
          <section className="container similar-anime-section">
            <h2>Related Anime</h2>
            <div className="similar-anime-grid">
              {anime.similarAnime.map((similar) => (
                <Link
                  to={`/anime/${similar.id}`}
                  key={similar.id}
                  className="similar-anime-card group"
                >
                  <div className="similar-anime-image">
                    {similar.imageId ? (
                      <div className="image-container">
                        <img
                          src={similar.imageId}
                          alt={similar.title}
                          loading="lazy"
                          onLoad={(e) => {
                            (e.target as HTMLImageElement).classList.add("loaded");
                          }}
                        />
                        <div className="placeholder loading-placeholder">
                          <Icon icon="fa-film" />
                        </div>
                      </div>
                    ) : (
                      <div className="placeholder">
                        <Icon icon="fa-film" />
                      </div>
                    )}
                  </div>
                  <div className="similar-anime-info">
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
            <p>You must be logged in to add anime to your library.</p>
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

export default AnimeDetails;