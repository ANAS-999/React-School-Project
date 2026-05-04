import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import mountainImg from "../../assets/mountain.png";
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
          // markers: true, // uncomment to debug
        },
      });

      /* 1. Scale the SVG overlay from 1 → 25 (circle expands past screen) */
      tl.to(
        svgRef.current,
        {
          scale: 25,
          ease: "power2.inOut",
          duration: 1,
        },
        0
      );

      /* 2. Fade out & push "We Create" upward */
      tl.to(
        textTopRef.current,
        {
          opacity: 0,
          y: -60,
          ease: "power2.in",
          duration: 0.4,
        },
        0
      );

      /* 3. Fade out & push "The Future" downward */
      tl.to(
        textBottomRef.current,
        {
          opacity: 0,
          y: 60,
          ease: "power2.in",
          duration: 0.4,
        },
        0
      );

      /* 4. Rings expand & fade */
      if (ringInnerRef.current) {
        tl.to(
          ringInnerRef.current,
          {
            scale: 1.6,
            opacity: 0,
            ease: "power2.in",
            duration: 0.5,
          },
          0
        );
      }

      if (ringOuterRef.current) {
        tl.to(
          ringOuterRef.current,
          {
            scale: 1.8,
            opacity: 0,
            ease: "power2.in",
            duration: 0.5,
          },
          0
        );
      }

      /* 5. Scroll hint fades quickly */
      if (scrollHintRef.current) {
        tl.to(
          scrollHintRef.current,
          {
            opacity: 0,
            y: 20,
            ease: "power2.in",
            duration: 0.15,
          },
          0
        );
      }
    },
    { scope: wrapperRef }
  );

  /* ── Render ──────────────────────────────────── */
  return (
    <div className="keyhole-hero" ref={wrapperRef}>
      <div className="keyhole-hero__pinned" ref={pinnedRef}>
        {/* Background – the "destination" mountain */}
        <div className="keyhole-hero__background">
          <img src={mountainImg} alt="Mountain destination" />
        </div>

        {/* SVG foreground overlay with a masked circle */}
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
                {/* White = visible → the solid overlay */}
                <rect width="1920" height="1080" fill="white" />
                {/* Black circle = transparent → the "hole" */}
                <circle cx="960" cy="540" r="180" fill="black" />
              </mask>
            </defs>
            {/* Dark overlay that has a circle cut out */}
            <rect
              width="1920"
              height="1080"
              fill="#090B10"
              mask="url(#keyhole-mask)"
            />
          </svg>
        </div>

        {/* Typography over the overlay */}
        <div className="keyhole-hero__text">
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
        </div>

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
