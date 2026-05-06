import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./About.css";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import KeyholeHero from "../components/common/KeyholeHero";

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const devCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const techGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(
    () => {
      // Hero Animations Modern
      const tl = gsap.timeline();
      tl.from(".hero-title-modern", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.2,
      })
        .from(
          ".hero-subtitle-modern",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .from(
          ".hero-btn-modern",
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "-=0.4",
        );

      // Orb animations
      gsap.to(".glow-orb", {
        scale: 1.1,
        opacity: 0.7,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 1,
      });

      // Proximity Scale Grid for Tech Stack
      if (techGridRef.current) {
        const gridItems = gsap.utils.toArray<HTMLElement>(".tech-item");
        const maxDist = 60; // Smaller radius for more precise interaction

        techGridRef.current.addEventListener("mousemove", (e) => {
          const { clientX, clientY } = e;

          gridItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const itemCenterY = rect.top + rect.height / 2;

            const dist = Math.sqrt(
              Math.pow(clientX - itemCenterX, 2) +
                Math.pow(clientY - itemCenterY, 2),
            );
            const brandColor = item.dataset.color || "#fff";

            if (dist < maxDist) {
              const scale = gsap.utils.mapRange(0, maxDist, 1.5, 1, dist);
              const opacity = gsap.utils.mapRange(0, maxDist, 1, 0.35, dist);

              gsap.to(item, {
                scale,
                opacity,
                color: brandColor,
                duration: 0.25,
                ease: "power2.out",
                overwrite: "auto",
              });
            } else {
              gsap.to(item, {
                scale: 1,
                opacity: 0.35,
                color: "var(--text-secondary)",
                duration: 0.25,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          });
        });

        techGridRef.current.addEventListener("mouseleave", () => {
          gsap.to(gridItems, {
            scale: 1,
            opacity: 0.35,
            color: "var(--text-secondary)",
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      }

      // Infinite scroll text (marquee)
      gsap.to(".marquee-inner", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      });
    },
    { scope: containerRef },
  );

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    const card = devCardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    gsap.to(card, {
      rotateX,
      rotateY,
      ease: "power2.out",
      duration: 0.4,
    });
  };

  const handleMouseLeave = (index: number) => {
    const card = devCardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
      duration: 0.7,
    });
  };

  return (
    <div className="about-container" ref={containerRef}>
      <Header />

      {/* Keyhole Portal Zoom Hero */}
      <KeyholeHero />

      {/* Modern Hero Section */}
      <section className="about-hero-modern">
        <div className="hero-background">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          <div className="grid-overlay"></div>
        </div>

        <div className="hero-content-modern">
          <h1 className="hero-title-modern">
            Your Portal to <br />
            <span className="text-gradient-primary">Endless Entertainment</span>
          </h1>

          <p className="hero-subtitle-modern">
            The ultimate platform to discover, track, and share your favorite
            games, movies, and anime. Built for true enthusiasts who want
            everything in one place.
          </p>

          <div className="hero-actions">
            <Link to="/discover" className="hero-btn-modern primary">
              Start Exploring
            </Link>
          </div>
        </div>

        {/* Marquee moved to bottom of hero */}
        <div className="hero-marquee">
          <div className="marquee">
            <div className="marquee-inner">
              <div className="marquee-part">
                <span>GAMES • MOVIES • ANIMES • </span>
                <span>GAMES • MOVIES • ANIMES • </span>
                <span>GAMES • MOVIES • ANIMES • </span>
                <span>GAMES • MOVIES • ANIMES • </span>
              </div>
              <div className="marquee-part">
                <span>GAMES • MOVIES • ANIMES • </span>
                <span>GAMES • MOVIES • ANIMES • </span>
                <span>GAMES • MOVIES • ANIMES • </span>
                <span>GAMES • MOVIES • ANIMES • </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="about-content">
        <div className="container">
          <h2 className="about-description text-reveal">
            We bring together the best of modern entertainment. Whether you are
            a hardcore gamer, a cinephile, or an anime enthusiast, we have
            curated the perfect experience for you.
          </h2>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card scroll-card">
              <div className="feature-icon-wrapper">
                <Icon
                  icon="fa-gamepad"
                  size="2xl"
                  className="feature-icon blue-icon"
                />
              </div>
              <div className="feature-content">
                <h3>Extensive Game Library</h3>
                <p>
                  Explore thousands of games across all platforms. Read reviews,
                  check system requirements, and find your next adventure.
                </p>
              </div>
            </div>

            <div className="feature-card scroll-card">
              <div className="feature-icon-wrapper">
                <Icon
                  icon="fa-film"
                  size="2xl"
                  className="feature-icon accent-icon"
                />
              </div>
              <div className="feature-content">
                <h3>Movie Database</h3>
                <p>
                  Dive into the world of cinema. Track what you've watched,
                  discover hidden gems, and stay updated with upcoming releases.
                </p>
              </div>
            </div>

            <div className="feature-card scroll-card">
              <div className="feature-icon-wrapper">
                <Icon
                  icon="fa-tv"
                  size="2xl"
                  className="feature-icon purple-icon"
                />
              </div>
              <div className="feature-content">
                <h3>Anime Collection</h3>
                <p>
                  From timeless classics to the latest seasonal hits. Keep track
                  of your watch list and explore detailed anime statistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="api-section">
        <div className="container">
          <div className="section-header text-reveal">
            <h2>Powered by Industry Leaders</h2>
            <p>
              We leverage top-tier APIs to bring you accurate and up-to-date
              data.
            </p>
          </div>

          <div className="api-grid">
            <div className="api-card scroll-card">
              <div
                className="api-badge"
                style={{
                  background: "rgba(139, 92, 246, 0.2)",
                  color: "var(--purple-light)",
                }}
              >
                IGDB API
              </div>
              <h3>Gaming Data</h3>
              <p>
                Comprehensive video game database providing massive amounts of
                gaming metadata, ratings, and artwork.
              </p>
            </div>
            <div className="api-card scroll-card">
              <div
                className="api-badge"
                style={{
                  background: "rgba(6, 182, 212, 0.2)",
                  color: "var(--accent-light)",
                }}
              >
                TMDB API
              </div>
              <h3>Movie & TV Data</h3>
              <p>
                The Movie Database powers our rich catalog of films, offering
                detailed cast information, trailers, and user reviews.
              </p>
            </div>
            <div className="api-card scroll-card">
              <div
                className="api-badge"
                style={{
                  background: "rgba(59, 130, 246, 0.2)",
                  color: "var(--blue-light)",
                }}
              >
                Jikan API
              </div>
              <h3>Anime Data</h3>
              <p>
                An Unofficial MyAnimeList API that provides extensive data on
                animes, mangas, characters, and seasonal trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="dev-section">
        <div className="container">
          <div className="section-header text-reveal">
            <h2>Meet The Creators</h2>
            <p>The minds behind EntertainHub</p>
          </div>

          <div className="dev-grid">
            {/* Dev Card 1 */}
            <div className="dev-card-wrapper scroll-card">
              <div
                className="dev-card"
                ref={(el) => {
                  devCardsRef.current[0] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, 0)}
                onMouseLeave={() => handleMouseLeave(0)}
              >
                <div className="dev-avatar avatar-1"></div>
                <h3>Anas</h3>
                <h4 className="dev-role">Full Stack Developer</h4>
                <p>
                  Expert in building end-to-end solutions combining robust backend 
                  architecture with engaging frontend interfaces using React, animations, 
                  and modern web technologies.
                </p>
                <div className="dev-socials">
                  <a href="#">GitHub</a>
                  <a href="#">LinkedIn</a>
                </div>
              </div>
            </div>

            {/* Dev Card 2 */}
            <div className="dev-card-wrapper scroll-card">
              <div
                className="dev-card"
                ref={(el) => {
                  devCardsRef.current[1] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, 1)}
                onMouseLeave={() => handleMouseLeave(1)}
              >
                <div className="dev-avatar avatar-2"></div>
                <h3>Yahya</h3>
                <h4 className="dev-role">Full Stack Developer</h4>
                <p>
                  Passionate about creating seamless user experiences through innovative 
                  problem-solving across frontend and backend development, with a focus 
                  on clean code and scalable architecture.
                </p>
                <div className="dev-socials">
                  <a href="#">GitHub</a>
                  <a href="#">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-section">
        <div className="container">
          <div className="section-header text-reveal">
            <h2>Our Tech Stack</h2>
            <p>
              Cutting-edge technologies crafted for scalability, performance,
              and exceptional user experience.
            </p>
          </div>

          <div className="tech-categories-wrapper scroll-card">
            {/* Frontend Category */}
            <div className="tech-category">
              <div className="category-header">
                <div className="category-badge frontend-badge">Frontend</div>
                <h3>Client-Side Excellence</h3>
              </div>
              <div className="tech-items-grid">
                <div className="tech-card" data-color="#61DAFB">
                  <div className="tech-icon">
                    <Icon icon="fab fa-react" />
                  </div>
                  <div className="tech-info">
                    <h4>React</h4>
                    <p>Interactive UI</p>
                  </div>
                </div>
                <div className="tech-card" data-color="#F7DF1E">
                  <div className="tech-icon">
                    <Icon icon="fa-brands fa-typescript" />
                  </div>
                  <div className="tech-info">
                    <h4>TypeScript</h4>
                    <p>Dynamic Logic</p>
                  </div>
                </div>
                <div className="tech-card" data-color="#264de4">
                  <div className="tech-icon">
                    <Icon icon="fab fa-css3-alt" />
                  </div>
                  <div className="tech-info">
                    <h4>CSS3</h4>
                    <p>Modern Styling</p>
                  </div>
                </div>
                <div className="tech-card" data-color="#E34F26">
                  <div className="tech-icon">
                    <Icon icon="fab fa-html5" />
                  </div>
                  <div className="tech-info">
                    <h4>HTML5</h4>
                    <p>Semantic Markup</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Category */}
            <div className="tech-category">
              <div className="category-header">
                <div className="category-badge backend-badge">Backend</div>
                <h3>API Integration & Data</h3>
              </div>
              <div className="tech-items-grid">
                <div className="tech-card" data-color="#8B5CF6">
                  <div className="tech-icon">
                    <Icon icon="fa-solid fa-gamepad" />
                  </div>
                  <div className="tech-info">
                    <h4>IGDB API</h4>
                    <p>Gaming Data</p>
                  </div>
                </div>
                <div className="tech-card" data-color="#06B6D4">
                  <div className="tech-icon">
                    <Icon icon="fa-film" />
                  </div>
                  <div className="tech-info">
                    <h4>TMDB API</h4>
                    <p>Movies & TV</p>
                  </div>
                </div>
                <div className="tech-card" data-color="#3B82F6">
                  <div className="tech-icon">
                    <Icon icon="fa-tv" />
                  </div>
                  <div className="tech-info">
                    <h4>Jikan API</h4>
                    <p>Anime Data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools & DevOps Category */}
            <div className="tech-category">
              <div className="category-header">
                <div className="category-badge tools-badge">Tools</div>
                <h3>Development Workflow</h3>
              </div>
              <div className="tech-items-grid">
                <div className="tech-card" data-color="#f0f6fc">
                  <div className="tech-icon">
                    <Icon icon="fab fa-github" />
                  </div>
                  <div className="tech-info">
                    <h4>GitHub</h4>
                    <p>Version Control</p>
                  </div>
                </div>
                <div className="tech-card" data-color="#F05032">
                  <div className="tech-icon">
                    <Icon icon="fab fa-git-alt" />
                  </div>
                  <div className="tech-info">
                    <h4>Git</h4>
                    <p>Repository Mgmt</p>
                  </div>
                </div>
                <div className="tech-card" data-color="#CB3837">
                  <div className="tech-icon">
                    <Icon icon="fab fa-npm" />
                  </div>
                  <div className="tech-info">
                    <h4>npm</h4>
                    <p>Package Manager</p>
                  </div>
                </div>
                <div className="tech-card" data-color="#0052CC">
                   <div className="tech-icon">
                     <Icon icon="fab fa-jira" />
                   </div>
                   <div className="tech-info">
                     <h4>Jira</h4>
                     <p>Project Management</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-content feature-card scroll-card">
          <h2>Ready to start your journey?</h2>
          <p>
            Join thousands of users discovering new entertainment every day.
          </p>
          <Link to="/discover" className="cta-btn">
            Browse Games
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
