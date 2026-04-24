import "./DiscoverHero.css";

interface DiscoverHeroProps {
  gameCount: number;
}

function DiscoverHero({ gameCount }: DiscoverHeroProps) {
  const currentYear = new Date().getFullYear();

  return (
    <section className="discover-hero">
      <div className="container">
        <div className="discover-hero-content">
          <span className="discover-badge">
            <span className="pulse" />
            Trending Now
          </span>
          <h1 className="discover-title">
            Discover <span className="gradient-text"> Games</span>
          </h1>
          <p className="discover-subtitle">
            Explore the most popular games of {currentYear}, curated by millions of players worldwide
          </p>
        </div>
        <div className="discover-stats">
          <div className="stat">
            <span className="stat-number">{gameCount}</span>
            <span className="stat-label">Popular Hits</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">{currentYear}</span>
            <span className="stat-label">Year</span>
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
      <div className="discover-hero-glow" />
      <div className="discover-hero-gradient" />
    </section>
  );
}

export default DiscoverHero;