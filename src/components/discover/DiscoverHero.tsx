import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Icon } from "../common/Icon";
import "./DiscoverHero.css";

interface DiscoverHeroProps {
  gameCount: number;
  isSearching: boolean;
}

function DiscoverHero({ gameCount, isSearching }: DiscoverHeroProps) {
  const currentYear = new Date().getFullYear();
  const heroRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

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
    .fromTo(".floating-icons .icon-wrapper",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(".scroll-indicator",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.inOut" },
      "-=0.2"
    );

    gsap.to(".discover-hero-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    gsap.to(".floating-icon-1", {
      y: -20,
      rotation: 10,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".floating-icon-2", {
      y: -30,
      rotation: -15,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".floating-icon-3", {
      y: -15,
      rotation: 20,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".floating-icon-4", {
      y: -25,
      rotation: -10,
      duration: 4.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, { scope: heroRef });

  useGSAP(() => {
    if (countRef.current) {
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
      <div className="discover-hero-bg">
        <div className="grid-pattern" />
        <div className="glow glow-1" />
        <div className="glow glow-2" />
        <div className="glow glow-3" />
      </div>
      
      <div className="floating-icons">
        <div className="icon-wrapper floating-icon-1">
          <Icon icon="fa-gamepad" />
        </div>
        <div className="icon-wrapper floating-icon-2">
          <Icon icon="fa-trophy" />
        </div>
        <div className="icon-wrapper floating-icon-3">
          <Icon icon="fa-dragon" />
        </div>
        <div className="icon-wrapper floating-icon-4">
          <Icon icon="fa-chess" />
        </div>
      </div>

      <div className="container discover-hero-container">
        <div className="discover-hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Explore Thousands of Games
          </div>
          <h1 className="discover-title">
            Discover Your Next <span className="gradient-text">Adventure</span>
          </h1>
          <p className="discover-subtitle">
            Browse through thousands of titles, find hidden gems, and track your favorite games. 
            Your next gaming journey starts here.
          </p>
        </div>
        
        <div className="discover-stats-wrapper">
          <div className="discover-stats glass-panel">
            <div className="stat">
              <span className="stat-number" ref={countRef}>0</span>
              <span className="stat-label">{isSearching ? "Found Games" : "Total Games"}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">{currentYear}</span>
              <span className="stat-label">Current Year</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Genres</span>
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

export default DiscoverHero;