import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from './Icon';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(() => {
    // Header animation
    gsap.fromTo(headerRef.current, 
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }
    );

    // Info section slide in from left
    gsap.fromTo(infoRef.current, 
      { x: -50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: infoRef.current,
          start: 'top 85%',
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      }
    );

    // Form section slide in from right
    gsap.fromTo(formRef.current, 
      { x: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 85%',
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4,
      }
    );

    // Stagger social icons
    gsap.fromTo('.social-icon', 
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: infoRef.current,
          start: 'top 85%',
        },
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.6,
      }
    );
  }, { scope: containerRef });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="contact-section" ref={containerRef}>
      <div className="container">
        <div className="contact-header" ref={headerRef}>
          <h2>Get In Touch</h2>
          <p>Have questions or suggestions? We'd love to hear from you!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info" ref={infoRef}>
            <h3>Contact Information</h3>
            <div className="info-item">
              <Icon icon="fa-envelope" size="lg" className="icon" />
              <div>
                <p className="label">Email</p>
                <p>support@entertainhub.com</p>
              </div>
            </div>
            <div className="info-item">
              <Icon icon="fa-phone" size="lg" className="icon" />
              <div>
                <p className="label">Phone</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="info-item">
              <Icon icon="fa-location-dot" size="lg" className="icon" />
              <div>
                <p className="label">Address</p>
                <p>123 Entertainment Ave, Los Angeles, CA 90001</p>
              </div>
            </div>

            <div className="social-links">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Twitter">
                  <Icon icon="fa-x-twitter" size="md" />
                </a>
                <a href="#" className="social-icon" aria-label="Discord">
                  <Icon icon="fa-discord" size="md" />
                </a>
                <a href="#" className="social-icon" aria-label="GitHub">
                  <Icon icon="fa-github" size="md" />
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <Icon icon="fa-instagram" size="md" />
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What's this about?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us more..."
                rows={5}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              <Icon icon="fa-paper-plane" size="sm" style={{ marginRight: '8px' }} />
              Send Message
            </button>

            {submitted && (
              <div className="success-message">
                <Icon icon="fa-check-circle" size="sm" style={{ marginRight: '8px' }} />
                Thank you! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

