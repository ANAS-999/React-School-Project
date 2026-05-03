import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '../common/Icon';
import './ContentCard.css';

gsap.registerPlugin(ScrollTrigger);

interface ContentItem {
  id: string | number;
  title: string;
  image: string;
  rating?: number;
  year?: number;
  genre?: string;
  description?: string;
  hypes?: number;
}

interface ContentGridProps {
  id: string;
  title: string;
  subtitle?: string;
  items: ContentItem[];
  type: 'games' | 'movies' | 'animes';
  onDiscoverClick: (type: string) => void;
}

export const ContentGrid = ({
  id,
  title,
  subtitle,
  items,
  type,
  onDiscoverClick,
}: ContentGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate Header
    gsap.fromTo('.section-header', 
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }
    );

    // Animate Cards Staggered
    gsap.fromTo('.content-card', 
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      }
    );

    // Animate Footer Button
    gsap.fromTo('.content-footer', 
      { y: 20, opacity: 0 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }
    );
  }, { scope: containerRef });

  return (
    <section id={id} className={`content-section content-${type}`} ref={containerRef}>
      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>

        <div className="content-grid">
          {items.map((item) => (
            <div key={item.id} className="content-card">
              <div className="card-image-wrapper">
                <img src={item.image} alt={item.title} className="card-image" />
                <div className="card-overlay">
                  <div className="overlay-content">
                    {item.rating !== undefined && (
                      <p className="rating">
                        <Icon icon="fa-star" size="sm" style={{ marginRight: '6px' }} />
                        {(item.rating > 10 ? item.rating / 10 : item.rating).toFixed(1)}/10
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-content">
                <h3>{item.title}</h3>
                <div className="card-meta">
                  {item.year && <span className="year">{item.year}</span>}
                  {item.genre && <span className="genre">{item.genre}</span>}
                </div>
                {item.description && (
                  <p className="card-description">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="content-footer">
          <button
            className="btn btn-primary btn-large"
            onClick={() => onDiscoverClick(type)}
          >
            <Icon icon="fa-arrow-right" size="sm" style={{ marginRight: '8px' }} />
            Discover More {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      </div>
    </section>
  );
};


