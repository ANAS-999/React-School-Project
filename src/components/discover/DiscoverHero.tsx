import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./DiscoverHero.css";

interface DiscoverHeroProps {
  gameCount: number;
}

function DiscoverHero({ gameCount }: DiscoverHeroProps) {
  const currentYear = new Date().getFullYear();
  const heroRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    // Initial timeline animations
    const tl = gsap.timeline();

    tl.fromTo(".discover-badge",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
    )
    .fromTo(".discover-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    )
    .fromTo(".discover-subtitle",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(".discover-stats",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(".scroll-indicator",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.inOut" },
      "-=0.4"
    );

    // Subtle parallax effect on the glow
    gsap.to(".discover-hero-glow", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

  }, { scope: heroRef });

  // Separate useGSAP specifically for the counter animation when gameCount changes
  useGSAP(() => {
    if (gameCount > 0 && countRef.current) {
      const target = { val: 0 };
      gsap.to(target, {
        val: gameCount,
        duration: 2,
        ease: "power3.out",
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.innerText = Math.floor(target.val).toString();
          }
        },
      });
    }
  }, { dependencies: [gameCount], scope: heroRef });

  return (
    <section className="discover-hero" ref={heroRef}>
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
            <span className="stat-number" ref={countRef}>0</span>
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