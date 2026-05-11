import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  fetchGameToLibrary,
  fetchMovieToLibrary,
  fetchAnimeToLibrary,
  removeGameFromLibrary,
  removeMovieFromLibrary,
  removeAnimeFromLibrary,
} from "../firebase/FirebaseService";
import type { LibraryModel } from "../models/LibraryModel";
import "./Library.css";
import "../components/discover/GameCard.css";

type TabType = "games" | "movies" | "animes";

interface LibraryItem extends LibraryModel {
  type: TabType;
  addedAt?: Date;
}

function Library() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("games");
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState({ games: 0, movies: 0, animes: 0 });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      loadLibrary();
      loadCounts();
    }
  }, [activeTab, user]);

  const loadCounts = async () => {
    try {
      const [games, movies, animes] = await Promise.all([
        fetchGameToLibrary(),
        fetchMovieToLibrary(),
        fetchAnimeToLibrary(),
      ]);
      setCounts({
        games: games.length,
        movies: movies.length,
        animes: animes.length,
      });
    } catch (error) {
      console.error("Error loading counts:", error);
    }
  };

  const loadLibrary = async () => {
    setLoading(true);
    try {
      let items: LibraryItem[] = [];

      if (activeTab === "games") {
        const games = await fetchGameToLibrary();
        items = games.map((g) => ({ ...g, type: "games" as TabType }));
      } else if (activeTab === "movies") {
        const movies = await fetchMovieToLibrary();
        items = movies.map((m) => ({ ...m, type: "movies" as TabType }));
      } else if (activeTab === "animes") {
        const animes = await fetchAnimeToLibrary();
        items = animes.map((a) => ({ ...a, type: "animes" as TabType }));
      }

      setLibraryItems(items);
    } catch (error) {
      console.error("Error loading library:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string | number, type: TabType) => {
    try {
      if (type === "games") {
        await removeGameFromLibrary(id);
      } else if (type === "movies") {
        await removeMovieFromLibrary(id);
      } else if (type === "animes") {
        await removeAnimeFromLibrary(id);
      }
      setLibraryItems((prev) => prev.filter((item) => item.id !== id));
      setCounts((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    } catch (error) {
      console.error("Error removing from library:", error);
    }
  };

  const handleItemClick = (item: LibraryItem) => {
    if (item.type === "games") {
      navigate(`/games/${item.id}`);
    } else if (item.type === "movies") {
      navigate(`/movies/${item.id}`);
    } else if (item.type === "animes") {
      navigate(`/anime/${item.id}`);
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return libraryItems;
    const query = searchQuery.toLowerCase();
    return libraryItems.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }, [libraryItems, searchQuery]);

if (!user) {
    return (
      <div>
        <Header />
        <main className="library-page">
          <div className="auth-required-card">
            <div className="auth-required-icon">
              <Icon icon="fa-solid fa-user-lock" />
            </div>
            <h2>Sign In Required</h2>
            <p>Please sign in to view your library</p>
            <div className="auth-required-actions">
              <button className="btn btn-primary" onClick={() => navigate("/signin")}>
                <Icon icon="fa-solid fa-right-to-bracket" />
                Sign In
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("/signup")}>
                <Icon icon="fa-solid fa-user-plus" />
                Sign Up
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="library-page">
        <div className="library-hero"></div>
        <div className="container">
          <div className="library-header">
            <div className="library-header-content">
              <div>
                <h1>My Library</h1>
                <p>Your collection of games, movies, and anime</p>
              </div>
              <div className="library-stats">
                <div className="stat-item">
                  <Icon icon="fa-solid fa-gamepad" />
                  <strong>{counts.games}</strong>
                  <span>Games</span>
                </div>
                <div className="stat-item">
                  <Icon icon="fa-solid fa-film" />
                  <strong>{counts.movies}</strong>
                  <span>Movies</span>
                </div>
                <div className="stat-item">
                  <Icon icon="fa-solid fa-tv" />
                  <strong>{counts.animes}</strong>
                  <span>Anime</span>
                </div>
              </div>
            </div>
          </div>

          <div className="library-toolbar">
            <div className="library-tabs">
              <button
                className={`tab-btn ${activeTab === "games" ? "active" : ""}`}
                onClick={() => setActiveTab("games")}
              >
                <Icon icon="fa-solid fa-gamepad" />
                <span>Games</span>
                {counts.games > 0 && <span className="tab-count">{counts.games}</span>}
              </button>
              <button
                className={`tab-btn ${activeTab === "movies" ? "active" : ""}`}
                onClick={() => setActiveTab("movies")}
              >
                <Icon icon="fa-solid fa-film" />
                <span>Movies</span>
                {counts.movies > 0 && <span className="tab-count">{counts.movies}</span>}
              </button>
              <button
                className={`tab-btn ${activeTab === "animes" ? "active" : ""}`}
                onClick={() => setActiveTab("animes")}
              >
                <Icon icon="fa-solid fa-tv" />
                <span>Anime</span>
                {counts.animes > 0 && <span className="tab-count">{counts.animes}</span>}
              </button>
            </div>
            <div className="library-search">
              <Icon icon="fa-magnifying-glass" className="search-icon" />
              <input
                type="text"
                placeholder="Search your library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery("")}>
                  <Icon icon="fa-xmark" />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="library-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="library-card skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="library-empty">
              {searchQuery ? (
                <>
                  <Icon icon="fa-magnifying-glass" size="2xl" />
                  <h3>No results found</h3>
                  <p>Try a different search term</p>
                  <button className="btn btn-secondary" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <div className="empty-icon">
                    <Icon
                      icon={
                        activeTab === "games"
                          ? "fa-gamepad"
                          : activeTab === "movies"
                            ? "fa-film"
                            : "fa-tv"
                      }
                      size="2xl"
                    />
                  </div>
                  <h3>No {activeTab} in your library yet</h3>
                  <p>Start adding {activeTab} to see them here</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (activeTab === "games") navigate("/discover");
                      else if (activeTab === "movies") navigate("/movies");
                      else navigate("/animes");
                    }}
                  >
                    <Icon icon="fa-solid fa-compass" />
                    Discover {activeTab === "animes" ? "Anime" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="library-grid">
              {filteredItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="game-card group"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="game-card-inner">
                    <div className="game-card-image">
                      {item.image ? (
                        <div className="image-container">
                          <img 
                            src={item.image} 
                            alt={item.title} 
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
                            <Icon
                              icon={item.type === "games" ? "fa-solid fa-gamepad" : item.type === "movies" ? "fa-solid fa-film" : "fa-solid fa-tv"}
                              size="2xl"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="game-card-placeholder">
                          <Icon
                            icon={item.type === "games" ? "fa-solid fa-gamepad" : item.type === "movies" ? "fa-solid fa-film" : "fa-solid fa-tv"}
                            size="2xl"
                          />
                        </div>
                      )}

                      <div className="card-overlay">
                        <button
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.id, item.type);
                          }}
                          title="Remove from library"
                        >
                          <Icon icon="fa-solid fa-trash" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="card-type-badge">
                        <Icon icon={item.type === "games" ? "fa-solid fa-gamepad" : item.type === "movies" ? "fa-solid fa-film" : "fa-solid fa-tv"} />
                      </div>
                    </div>

                    <h3 className="library-card-title">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Library;
