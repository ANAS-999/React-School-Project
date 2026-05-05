import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import AnimeAPI from "../api/anime_api";
import type { AnimeModel } from "../models/AnimeModel";
import "./GameDetails.css";

function AnimeDetails() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playTrailer, setPlayTrailer] = useState(false);

  const cleanText = (text: string | null | undefined) => {
    if (!text) return '';
    return text.replace(/\[Written by.*?\]/gi, '').replace(/\(Written by.*?\)/gi, '').trim();
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAnimeDetails = async () => {
      setLoading(true);
      try {
        const api = new AnimeAPI();
        const data = await api.getAnimeById(Number(id));

        console.log(data);
        
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

  if (loading) {
    return (
      <div>
        <Header />
        <main className="game-details-page loading">
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
        <main className="game-details-page error">
          <div className="container">
            <Icon icon="fa-triangle-exclamation" size="2xl" />
            <h2>Oops!</h2>
            <p>{error}</p>
            <Link to="/animes" className="btn btn-primary">
              Back to Anime
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
        <div className="game-hero">
<div className="game-hero-bg">
            {anime.imageId && (
              <img src={anime.imageId} alt="" />
            )}
            <div className="overlay"></div>
          </div>
          <div className="container">
            <Link to="/animes" className="back-link">
              <Icon icon="fa-arrow-left" /> Back to Anime
            </Link>
            <div className="game-hero-content">
              <div className="game-cover">
                {anime.imageId ? (
                  <img src={anime.imageId} alt={anime.title} />
                ) : (
                  <div className="placeholder-cover"><Icon icon="fa-film" size="2xl" /></div>
                )}
              </div>
              <div className="game-info">
                <h1>{anime.title}</h1>
                <div className="game-meta">
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
                  <div className="game-tags">
                    {anime.genres.map((g, i) => (
                      <span key={i} className="tag">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container game-content">
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
                    <span className="alt-title-value">{anime.titleJapanese}</span>
                  </div>
                  {anime.titleSynonyms && anime.titleSynonyms.length > 0 && (
                    <div className="alt-title-item">
                      <span className="alt-title-label">Synonyms</span>
                      <span className="alt-title-value">{anime.titleSynonyms.join(", ")}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {(anime.openings && anime.openings.length > 0) || (anime.endings && anime.endings.length > 0) ? (
              <section className="media-section">
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
              <section className="media-section">
                <h2>Trailer</h2>
                <div className="videos-grid">
                  <div className="video-wrapper video-main">
                    {!playTrailer ? (
                      <div 
                        className="video-thumbnail"
                        onClick={() => setPlayTrailer(true)}
                        style={{ backgroundImage: anime.imageId ? `url(${anime.imageId})` : undefined }}
                      >
                        <div className="video-play-btn">
                          <Icon icon="fa-play" size="2xl" />
                        </div>
                        <span className="video-label">Click to play trailer</span>
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

            {anime.streaming && anime.streaming.length > 0 && (
              <section className="media-section">
                <h2>Watch On</h2>
                <div className="watch-on-grid">
                  {anime.streaming.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="watch-on-card">
                      <Icon icon="fa-play-circle" size="xl" />
                      <span>{s.name}</span>
                    </a>
                  ))}
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
                    <span className="fact-value">{anime.season ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1) : anime.releaseYear}</span>
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
                    <span className="fact-value">{anime.genres.join(", ")}</span>
                  </div>
                )}
                {anime.themes && anime.themes.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Themes</span>
                    <span className="fact-value">{anime.themes.join(", ")}</span>
                  </div>
                )}
                {anime.demographics && anime.demographics.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Demographic</span>
                    <span className="fact-value">{anime.demographics.join(", ")}</span>
                  </div>
                )}
                {anime.producers && anime.producers.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Producers</span>
                    <span className="fact-value">{anime.producers.slice(0, 3).join(", ")}{anime.producers.length > 3 ? ` +${anime.producers.length - 3}` : ''}</span>
                  </div>
                )}
                {anime.licensors && anime.licensors.length > 0 && (
                  <div className="fact-item">
                    <span className="fact-label">Licensors</span>
                    <span className="fact-value">{anime.licensors.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {anime.externalLinks && anime.externalLinks.length > 0 && (
              <div className="info-card">
                <h3>Links</h3>
                <div className="external-links">
                  {anime.externalLinks.slice(0, 6).map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="external-link">
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {anime.similarAnime && anime.similarAnime.length > 0 && (
          <section className="container similar-games-section">
            <h2>Related Anime</h2>
            <div className="similar-games-grid">
              {anime.similarAnime.map((similar) => (
                <Link
                  to={`/anime/${similar.id}`}
                  key={similar.id}
                  className="similar-game-card group"
                >
                  <div className="similar-game-image">
                    {similar.imageId ? (
                      <img
                        src={similar.imageId}
                        alt={similar.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="placeholder">
                        <Icon icon="fa-film" />
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
      <Footer />
    </div>
  );
}

export default AnimeDetails;
