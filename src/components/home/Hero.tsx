import { useRef, useState, useEffect, Suspense } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Spline from "@splinetool/react-spline";
import { Icon } from "../common/Icon";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const SplineLoader = () => (
  <div className="spline-loader">
    <Icon icon="fa-gamepad" className="fa-spin" size="2xl" />
    <p>Loading 3D...</p>
  </div>
);

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Hero Content Animation
      tl.fromTo(
        ".hero-title",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      )
        .fromTo(
          ".hero-subtitle",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4",
        )
        .fromTo(
          ".hero-stats",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        )
        .fromTo(
          ".hero-stats .stat-item",
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.5)",
          },
          "-=0.3",
        )
        .fromTo(
          ".hero-text-animate",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.3",
        )
        .fromTo(
          ".hero-buttons button",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
          "-=0.4",
        )
        .fromTo(
          ".scroll-hint",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2",
        );

      // Benefits Section Animations
      gsap.fromTo(
        ".benefits-section .section-header",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 85%",
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        ".benefit-card",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 85%",
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
      );

      // Magnetic Buttons Animation
      const buttons = gsap.utils.toArray<HTMLElement>(".hero-buttons button");
      const strength = 0.5; // adjust strength of pull

      buttons.forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
          const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

          gsap.to(btn, {
            x: x * strength,
            y: y * strength,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
        });

        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, { 
            x: 0, 
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.4)",
            overwrite: "auto"
          });
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <>
      <section id="home" className="hero-section" ref={containerRef}>
        <div className="hero-section-wrapper">
          <div className="hero-bg-elements">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="grid-pattern"></div>
          </div>

          <div className="hero-spline-wrapper">
            <Suspense fallback={<SplineLoader />}>
              <Spline
                scene="https://prod.spline.design/ZwrSyBnr9WFV6PSL/scene.splinecode"
                onLoad={(spline) => (splineRef.current = spline)}
                style={{ width: "100%", height: "100%", maxWidth: "100%" }}
              />
            </Suspense>
          </div>


          <div className="container">
            <div className="hero-content-wrapper">
              <div className="hero-content">
                <h1 className="hero-title gradient-text">
                  Your Universe of Entertainment
                </h1>

                <p className="hero-subtitle">
                  Stop jumping between different apps to manage your media. Keep
                  your entire catalog perfectly synced and beautifully displayed.
                </p>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-value">361K+</span>
                  <span className="stat-label">Games</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">50K+</span>
                  <span className="stat-label">Movies</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">27K+</span>
                  <span className="stat-label">Animes</span>
                </div>
              </div>

              <div className="hero-buttons">
                <button
                  className="btn btn-primary btn-large"
                  onClick={() =>
                    document
                      .getElementById("games")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Icon icon="fa-compass" />
                  Start Exploring
                </button>
                <button
                  className="btn btn-outline btn-large"
                  onClick={() =>
                    document
                      .getElementById("benefits")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Icon icon="fa-play" />
                  See How It Works
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        <div className="scroll-hint">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      <section id="benefits" className="benefits-section" ref={benefitsRef}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us</h2>
            <p className="section-subtitle">
              Everything you need for the ultimate entertainment experience
            </p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card card-large">
              <div className="benefit-icon gradient-blue">
                <Icon icon="fa-bullseye" size="lg" />
              </div>
              <div className="benefit-info">
                <h3>Personalized Recommendations</h3>
                <p>
                  Get incredibly accurate suggestions tailored perfectly to your
                  unique taste and preferences across all entertainment mediums.
                </p>
              </div>
              <div className="card-decoration pattern-dots"></div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon gradient-purple">
                <Icon icon="fa-heart" size="lg" />
              </div>
              <div className="benefit-info">
                <h3>Save Favorites</h3>
                <p>Build your personal collection and never lose track.</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon gradient-cyan">
                <Icon icon="fa-users" size="lg" />
              </div>
              <div className="benefit-info">
                <h3>Community Reviews</h3>
                <p>Read detailed reviews from enthusiasts worldwide.</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon gradient-cyan">
                <Icon icon="fa-chart-line" size="lg" />
              </div>
              <div className="benefit-info">
                <h3>Track Progress</h3>
                <p>Keep track of what you're watching or playing.</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon gradient-purple">
                <Icon icon="fa-bell" size="lg" />
              </div>
              <div className="benefit-info">
                <h3>Smart Alerts</h3>
                <p>Stay updated with instant release date drops.</p>
              </div>
            </div>

            <div className="benefit-card card-large">
              <div className="benefit-icon gradient-blue">
                <Icon icon="fa-globe" size="lg" />
              </div>
              <div className="benefit-info">
                <h3>Global Community</h3>
                <p>
                  Connect with millions of entertainment fans worldwide. Share
                  your lists, debate theories, and discover hidden gems
                  together.
                </p>
              </div>
              <div className="card-decoration pattern-grid"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
