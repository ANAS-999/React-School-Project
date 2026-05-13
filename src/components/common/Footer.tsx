import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.footer-section', 
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );
  }, { scope: footerRef });

  return (
    <footer className="footer" ref={footerRef}>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>NeonHub</h4>
            <p>Your ultimate entertainment discovery platform for games, movies, and animes.</p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter fa-sm"></i></a>
              <a href="#" aria-label="Discord"><i className="fab fa-discord fa-sm"></i></a>
              <a href="#" aria-label="GitHub"><i className="fab fa-github fa-sm"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram fa-sm"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#games">Games</a></li>
              <li><a href="#movies">Movies</a></li>
              <li><a href="#animes">Animes</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} NeonHub. All rights reserved.</p>
          <p>Made with <i className="fas fa-heart fa-sm heart-icon"></i> for entertainment enthusiasts</p>
        </div>
      </div>
    </footer>
  );
};

