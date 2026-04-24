import { useEffect, useState, useRef } from "react";
import { Footer } from "../components/common/Footer";
import { Header } from "../components/common/Header";
import DiscoverHero from "../components/discover/DiscoverHero";
import GamesAPI from "../api/games_api";
import type { GameModel } from "../models/GameModel";
import GameCard from "../components/discover/GameCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Discover.css";

gsap.registerPlugin(ScrollTrigger);

function Discover() {
  const [games, setGames] = useState<GameModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (loading) return;
    
    // Animate the header
    gsap.fromTo(".content-header",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".content-header", start: "top 85%" } }
    );

    // Stagger animate the games grid
    gsap.fromTo(".game-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".games-grid",
          start: "top 85%",
        }
      }
    );
  }, { dependencies: [loading, games], scope: containerRef });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesAPI = new GamesAPI();
        const data = await gamesAPI.getPopularGames();
        setGames(data);
        console.log(data[0]);
        
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const skeletonCards = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div ref={containerRef}>
      <Header />
      <main>
        <DiscoverHero gameCount={games.length} />

        <section className="discover-content">
          <div className="container">
            <div className="content-header">
              <h2>Popular Games</h2>
              <p>Top rated games by our community</p>
            </div>
            {loading ? (
              <div className="games-grid">
                {skeletonCards.map((i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-image" />
                    <div className="skeleton-content">
                      <div className="skeleton-title" />
                      <div className="skeleton-info" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="games-grid">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Discover;
