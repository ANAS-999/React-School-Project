import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./DiscoverHero.css";

interface AnimeHeroProps {
  animeCount: number;
  isSearching: boolean;
}

function AnimeHero({ animeCount, isSearching }: AnimeHeroProps) {
  const currentYear = new Date().getFullYear();
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(".discover-title",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(".discover-subtitle",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(".discover-stats-wrapper",
      { scale: 0.9, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" },
      "-=0.6"
    )
    .fromTo(".scroll-indicator",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.inOut" },
      "-=0.4"
    );
  }, { scope: heroRef });

  return (
    <section className="discover-hero" ref={heroRef}>
      <div className="discover-hero-bg">
        <div className="grid-pattern" />
        <div className="glow glow-1" />
        <div className="glow glow-2" />
        <div className="glow glow-3" />
      </div>

      <div className="container discover-hero-container">
        <div className="discover-hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Explore Top Anime
          </div>
          <h1 className="discover-title">
            Discover <span className="gradient-text">Anime</span>
          </h1>
          <p className="discover-subtitle">
            Browse through the most popular anime series and movies. Find your next favorite series.
          </p>
        </div>
        
        <div className="discover-stats-wrapper">
          <div className="discover-stats glass-panel">
            <div className="stat">
              <span className="stat-number">{animeCount}</span>
              <span className="stat-label">{isSearching ? "Found Anime" : "Popular Anime"}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">{currentYear}</span>
              <span className="stat-label">Current Year</span>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="discover-hero-gradient" />
    </section>
  );
}

export default AnimeHero;