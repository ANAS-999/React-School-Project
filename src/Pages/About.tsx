import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-hero-content > *', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // gsap.from('.stat-card', {
      //   scrollTrigger: {
      //     trigger: '.stats-section',
      //     start: 'top 80%',
      //   },
      //   y: 50,
      //   opacity: 0,
      //   duration: 0.8,
      //   stagger: 0.12,
      //   ease: 'power2.out'
      // });

      gsap.from('.story-image-wrapper', {
        scrollTrigger: {
          trigger: '.story-section',
          start: 'top 75%',
        },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.story-text > *', {
        scrollTrigger: {
          trigger: '.story-section',
          start: 'top 75%',
        },
        x: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });

      gsap.from('.value-card', {
        scrollTrigger: {
          trigger: '.values-section',
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out'
      });

      gsap.from('.team-card', {
        scrollTrigger: {
          trigger: '.team-section',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      });

      gsap.from('.cta-wrapper', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 85%',
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <Header />
      <main className="about-page">
        <section className="about-hero">
          <div className="hero-bg-gradient"></div>
          <div className="container">
            <div className="about-hero-content">
              <div className="hero-icon">
                <Icon icon="fa-gem" size="2xl" />
              </div>
              <h1>About GameVault</h1>
              <p className="hero-subtitle">Redefining how the world discovers entertainment</p>
              <p className="hero-desc">
                We're building the ultimate platform for gamers, movie buffs, and anime lovers to discover, 
                track, and share their favorite entertainment experiences.
              </p>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrap blue">
                  <Icon icon="fa-gem" size="lg" />
                </div>
                <div className="stat-info">
                  <span className="stat-value">50K+</span>
                  <span className="stat-label">Games Tracked</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap purple">
                  <Icon icon="fa-film" size="lg" />
                </div>
                <div className="stat-info">
                  <span className="stat-value">20K+</span>
                  <span className="stat-label">Movies Listed</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap pink">
                  <Icon icon="fa-tv" size="lg" />
                </div>
                <div className="stat-info">
                  <span className="stat-value">10K+</span>
                  <span className="stat-label">Anime Series</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="story-section">
          <div className="container">
            <div className="story-grid">
              <div className="story-image-wrapper">
                <div className="story-image">
                  <div className="story-icon-large">
                    <Icon icon="fa-rocket" size="3x" />
                  </div>
                </div>
                <div className="story-badge">Est. 2024</div>
              </div>
              <div className="story-text">
                <span className="section-tag">Our Story</span>
                <h2>From Passion to Platform</h2>
                <p>
                  GameVault started with a simple frustration: why should entertainment lovers need 
                  five different apps to track their games, movies, and anime? We believed there had 
                  to be a better way.
                </p>
                <p>
                  Today, we're proud to offer a unified platform that brings together comprehensive 
                  databases for all three mediums. Whether you're hunting for the next indie game gem, 
                  tracking the latest anime season, or discovering hidden movie masterpieces, 
                  GameVault is your ultimate companion.
                </p>
                <div className="story-features">
                  <div className="story-feature">
                    <Icon icon="fa-check" size="sm" />
                    <span>Unified entertainment tracking</span>
                  </div>
                  <div className="story-feature">
                    <Icon icon="fa-check" size="sm" />
                    <span>Real-time data from trusted sources</span>
                  </div>
                  <div className="story-feature">
                    <Icon icon="fa-check" size="sm" />
                    <span>Community-driven recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">What Drives Us</span>
              <h2>Our Core Values</h2>
              <p>These principles guide everything we build at GameVault</p>
            </div>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <Icon icon="fa-compass" size="2xl" />
                </div>
                <h3>Discovery First</h3>
                <p>We believe finding your next favorite story should be an adventure, not a chore.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Icon icon="fa-users" size="2xl" />
                </div>
                <h3>Community Driven</h3>
                <p>Real opinions from real users, not just critic scores.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Icon icon="fa-bolt" size="2xl" />
                </div>
                <h3>Lightning Fast</h3>
                <p>Optimized performance so you spend less time waiting and more time exploring.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Icon icon="fa-shield-halved" size="2xl" />
                </div>
                <h3>Data Integrity</h3>
                <p>Accurate, up-to-date information powered by industry-leading APIs.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Meet The Team</span>
              <h2>Built with Passion</h2>
              <p>The minds behind GameVault's development</p>
            </div>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">
                  <Icon icon="fa-user-astronaut" size="3x" />
                </div>
                <h4>Alex Chen</h4>
                <span className="team-role">Founder & Lead Developer</span>
                <p>Full-stack developer with a passion for gaming and clean code.</p>
              </div>
              <div className="team-card">
                <div className="team-avatar">
                  <Icon icon="fa-user-ninja" size="3x" />
                </div>
                <h4>Sarah Kim</h4>
                <span className="team-role">UI/UX Designer</span>
                <p>Creating beautiful, intuitive interfaces that users love.</p>
              </div>
              <div className="team-card">
                <div className="team-avatar">
                  <Icon icon="fa-user-secret" size="3x" />
                </div>
                <h4>Marcus Rodriguez</h4>
                <span className="team-role">Data Engineer</span>
                <p>Ensuring our databases are always accurate and lightning fast.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-wrapper">
              <div className="cta-bg"></div>
              <h2>Ready to Start Your Journey?</h2>
              <p>Join millions of entertainment enthusiasts and discover your next obsession today.</p>
              <div className="cta-buttons">
                <a href="/games" className="btn-primary">
                  <Icon icon="fa-gamepad" size="sm" />
                  Explore Games
                </a>
                <a href="/movies" className="btn-secondary">
                  <Icon icon="fa-film" size="sm" />
                  Watch Movies
                </a>
                <a href="/anime" className="btn-secondary">
                  <Icon icon="fa-tv" size="sm" />
                  Discover Anime
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div className="container">
            <div className="contact-wrapper">
              <h3>Get in Touch</h3>
              <p>Have questions, feedback, or partnership inquiries? We'd love to hear from you.</p>
              <div className="contact-methods">
                <a href="mailto:contact@gamevault.com" className="contact-method">
                  <Icon icon="fa-envelope" size="lg" />
                  <span>contact@gamevault.com</span>
                </a>
                <a href="https://www.gamevault.com" target="_blank" rel="noopener noreferrer" className="contact-method">
                  <Icon icon="fa-globe" size="lg" />
                  <span>www.gamevault.com</span>
                </a>
                <a href="#" className="contact-method">
                  <Icon icon="fa-twitter" size="lg" />
                  <span>@gamevault</span>
                </a>
                <a href="#" className="contact-method">
                  <Icon icon="fa-discord" size="lg" />
                  <span>Join our Discord</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default About;
