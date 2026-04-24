import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from './Icon';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Hero Content Animation
    tl.fromTo('.hero-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
      .fromTo('h1', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .fromTo('.hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .fromTo('.hero-buttons button', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, '-=0.4');

    // Benefits Section Animations
    gsap.fromTo('.benefits-section .section-header',
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }
    );

    gsap.fromTo('.benefit-card',
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
  }, { scope: containerRef });

  return (
    <>
      <section id="home" className="hero-section" ref={containerRef}>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Icon icon="fa-star" size="sm" style={{ marginRight: '8px' }} />
              <span>Discover Your Next Favorite</span>
            </div>
            <h1>Explore Games, Movies & Animes</h1>
            <p className="hero-subtitle">
              Your ultimate entertainment discovery platform. Find, track, and share your favorite games, movies, and animes all in one place.
            </p>

            <div className="hero-buttons">
              <button className="btn btn-primary btn-large">Start Exploring</button>
              <button className="btn btn-outline btn-large">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="benefits-section" ref={benefitsRef}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us</h2>
            <p className="section-subtitle">Everything you need for the ultimate entertainment experience</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card card-large">
              <div className="benefit-icon gradient-blue">
                <Icon icon="fa-bullseye" size="lg" />
              </div>
              <div className="benefit-info">
                <h3>Personalized Recommendations</h3>
                <p>Get incredibly accurate suggestions tailored perfectly to your unique taste and preferences across all entertainment mediums.</p>
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
                <p>Connect with millions of entertainment fans worldwide. Share your lists, debate theories, and discover hidden gems together.</p>
              </div>
              <div className="card-decoration pattern-grid"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


