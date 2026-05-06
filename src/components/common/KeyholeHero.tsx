import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import controllerIcon from '../../assets/controller.svg';
import "./KeyholeHero.css";

gsap.registerPlugin(ScrollTrigger);

const KeyholeHero: React.FC = () => {
  /* ── Refs ────────────────────────────────────── */
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textTopRef = useRef<HTMLSpanElement>(null);
  const textBottomRef = useRef<HTMLSpanElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const ringOuterRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  /* ── GSAP Animation ─────────────────────────── */
  useGSAP(
    () => {
      if (
        !wrapperRef.current ||
        !pinnedRef.current ||
        !svgRef.current ||
        !textTopRef.current ||
        !textBottomRef.current
      )
        return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom top",
          pin: pinnedRef.current,
          scrub: 1,
        },
      });

      /* 1. Scale the SVG overlay from 1 → 25 */
      tl.to(
        svgRef.current,
        { scale: 25, ease: "power2.inOut", duration: 1 },
        0,
      );

      /* 2. Fade out text */
      tl.to(
        textTopRef.current,
        { opacity: 0, y: -60, ease: "power2.in", duration: 0.4 },
        0,
      );
      tl.to(
        textBottomRef.current,
        { opacity: 0, y: 60, ease: "power2.in", duration: 0.4 },
        0,
      );

      /* 3. Rings expand & fade */
      if (ringInnerRef.current) {
        tl.to(
          ringInnerRef.current,
          { scale: 1.6, opacity: 0, ease: "power2.in", duration: 0.5 },
          0,
        );
      }
      if (ringOuterRef.current) {
        tl.to(
          ringOuterRef.current,
          { scale: 1.8, opacity: 0, ease: "power2.in", duration: 0.5 },
          0,
        );
      }

      /* 4. Scroll hint fades */
      if (scrollHintRef.current) {
        tl.to(
          scrollHintRef.current,
          { opacity: 0, y: 20, ease: "power2.in", duration: 0.15 },
          0,
        );
      }
    },
    { scope: wrapperRef },
  );

  /* ── Render ──────────────────────────────────── */
  return (
    <div className="keyhole-hero" ref={wrapperRef}>
      <div className="keyhole-hero__pinned" ref={pinnedRef}>
        {/* ===== Background – Three Icons + Glow Design ===== */}
        <div className="keyhole-hero__background">
          {/* Glow orbs */}
          <div className="kh-glow kh-glow--blue" />
          <div className="kh-glow kh-glow--purple" />
          <div className="kh-glow kh-glow--cyan" />

          {/* Grid overlay */}
          <div className="kh-grid" />

          {/* Floating particles */}
          <div className="kh-particles">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          {/* ── Three Icon Layout ── */}
          <div className="kh-icons-row">
            {/* LEFT — Movies (Film/Clapperboard) */}
            <div className="kh-icon-wrap kh-icon-wrap--left">
              <svg
                className="kh-icon-svg"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="movie-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                  <filter id="movie-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Film strip body */}
                <rect
                  x="12"
                  y="30"
                  width="76"
                  height="58"
                  rx="6"
                  stroke="url(#movie-grad)"
                  strokeWidth="2.5"
                  fill="rgba(245,158,11,0.06)"
                  filter="url(#movie-glow)"
                />
                {/* Clapperboard top */}
                <path
                  d="M12 30 L88 30 L88 22 C88 19 86 17 83 17 L17 17 C14 17 12 19 12 22 Z"
                  stroke="url(#movie-grad)"
                  strokeWidth="2.5"
                  fill="rgba(245,158,11,0.1)"
                  filter="url(#movie-glow)"
                />
                {/* Clapper lines */}
                <line
                  x1="28"
                  y1="17"
                  x2="35"
                  y2="30"
                  stroke="url(#movie-grad)"
                  strokeWidth="2"
                  opacity="0.7"
                />
                <line
                  x1="45"
                  y1="17"
                  x2="52"
                  y2="30"
                  stroke="url(#movie-grad)"
                  strokeWidth="2"
                  opacity="0.7"
                />
                <line
                  x1="62"
                  y1="17"
                  x2="69"
                  y2="30"
                  stroke="url(#movie-grad)"
                  strokeWidth="2"
                  opacity="0.7"
                />
                {/* Play triangle */}
                <polygon
                  points="42,48 42,72 62,60"
                  fill="url(#movie-grad)"
                  opacity="0.6"
                />
                {/* Film perforations left */}
                <rect
                  x="16"
                  y="36"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
                <rect
                  x="16"
                  y="46"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
                <rect
                  x="16"
                  y="56"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
                <rect
                  x="16"
                  y="66"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
                <rect
                  x="16"
                  y="76"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
                {/* Film perforations right */}
                <rect
                  x="79"
                  y="36"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
                <rect
                  x="79"
                  y="46"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
                <rect
                  x="79"
                  y="56"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
                <rect
                  x="79"
                  y="66"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
                <rect
                  x="79"
                  y="76"
                  width="5"
                  height="4"
                  rx="1"
                  fill="url(#movie-grad)"
                  opacity="0.4"
                />
              </svg>
              <span className="kh-icon-label kh-icon-label--movies">
                Movies
              </span>
              <div className="kh-icon-ring kh-icon-ring--movies" />
            </div>

            {/* CENTER — Games (Controller) */}
            <div className="kh-icon-wrap kh-icon-wrap--center">
              {/* Replace the inline <svg> with an <img> tag */}
              <img
                src={controllerIcon}
                alt="Games Controller"
                className="kh-icon-svg kh-icon-svg--center"
              />
              <span className="kh-icon-label kh-icon-label--games">Games</span>
              <div className="kh-icon-ring kh-icon-ring--games" />
            </div>

            {/* RIGHT — Anime (Cat ears / sparkle character) */}
            <div className="kh-icon-wrap kh-icon-wrap--right">
              <svg
                className="kh-icon-svg"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="anime-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="50%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                  <filter id="anime-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Face circle */}
                <circle
                  cx="50"
                  cy="54"
                  r="26"
                  stroke="url(#anime-grad)"
                  strokeWidth="2.5"
                  fill="rgba(244,114,182,0.06)"
                  filter="url(#anime-glow)"
                />
                {/* Cat ears */}
                <path
                  d="M28 38 L24 16 L40 32 Z"
                  stroke="url(#anime-grad)"
                  strokeWidth="2"
                  fill="rgba(167,139,250,0.1)"
                  strokeLinejoin="round"
                  filter="url(#anime-glow)"
                />
                <path
                  d="M72 38 L76 16 L60 32 Z"
                  stroke="url(#anime-grad)"
                  strokeWidth="2"
                  fill="rgba(167,139,250,0.1)"
                  strokeLinejoin="round"
                  filter="url(#anime-glow)"
                />
                {/* Eyes — anime style big eyes */}
                <ellipse
                  cx="40"
                  cy="50"
                  rx="5"
                  ry="6.5"
                  fill="url(#anime-grad)"
                  opacity="0.7"
                />
                <ellipse
                  cx="60"
                  cy="50"
                  rx="5"
                  ry="6.5"
                  fill="url(#anime-grad)"
                  opacity="0.7"
                />
                {/* Eye highlights */}
                <circle cx="42" cy="48" r="2" fill="white" opacity="0.8" />
                <circle cx="62" cy="48" r="2" fill="white" opacity="0.8" />
                {/* Mouth */}
                <path
                  d="M46 62 Q50 66 54 62"
                  stroke="url(#anime-grad)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
                {/* Sparkles around */}
                <path
                  d="M82 20 L84 26 L90 24 L84 28 L86 34 L82 28 L76 30 L80 26 Z"
                  fill="url(#anime-grad)"
                  opacity="0.5"
                />
                <path
                  d="M14 60 L16 64 L20 63 L16 66 L17 70 L14 66 L10 67 L13 64 Z"
                  fill="url(#anime-grad)"
                  opacity="0.4"
                />
                <path
                  d="M70 78 L71 82 L75 81 L72 83 L73 87 L70 84 L67 86 L69 82 Z"
                  fill="url(#anime-grad)"
                  opacity="0.45"
                />
                {/* Blush marks */}
                <ellipse
                  cx="34"
                  cy="58"
                  rx="4"
                  ry="2"
                  fill="#F472B6"
                  opacity="0.2"
                />
                <ellipse
                  cx="66"
                  cy="58"
                  rx="4"
                  ry="2"
                  fill="#F472B6"
                  opacity="0.2"
                />
              </svg>
              <span className="kh-icon-label kh-icon-label--anime">Anime</span>
              <div className="kh-icon-ring kh-icon-ring--anime" />
            </div>
          </div>

          {/* Decorative orbiting dots */}
          <div className="kh-orbit kh-orbit--1">
            <span />
          </div>
          <div className="kh-orbit kh-orbit--2">
            <span />
          </div>
          <div className="kh-orbit kh-orbit--3">
            <span />
          </div>
        </div>

        {/* ===== SVG Mask Overlay ===== */}
        <div className="keyhole-hero__overlay">
          <svg
            ref={svgRef}
            className="keyhole-hero__svg"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="keyhole-mask">
                <rect width="1920" height="1080" fill="white" />
                <circle cx="960" cy="540" r="180" fill="black" />
              </mask>
            </defs>
            <rect
              width="1920"
              height="1080"
              fill="#090B10"
              mask="url(#keyhole-mask)"
            />
          </svg>
        </div>

        {/* Typography */}
        <span
          className="keyhole-hero__text-line keyhole-hero__text-line--top"
          ref={textTopRef}
        >
          We Create
        </span>
        <span
          className="keyhole-hero__text-line keyhole-hero__text-line--bottom"
          ref={textBottomRef}
        >
          The Future
        </span>

        {/* Decorative rings */}
        <div
          className="keyhole-hero__ring keyhole-hero__ring--inner"
          ref={ringInnerRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="keyhole-hero__ring keyhole-hero__ring--outer"
          ref={ringOuterRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Scroll prompt */}
        <div className="keyhole-hero__scroll-hint" ref={scrollHintRef}>
          <span>Scroll</span>
          <div className="keyhole-hero__scroll-arrow" />
        </div>
      </div>
    </div>
  );
};

export default KeyholeHero;
