import React, { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubeVideoProps {
  videoId: string;
  title: string;
  className?: string;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoId, title, className }) => {
  const [isRestricted, setIsRestricted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Reset restriction state when videoId changes
    setIsRestricted(false);

    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }

    const initPlayer = () => {
      if (!iframeRef.current) return;
      
      // If we already have a player for this ref, do nothing
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onError: (event: any) => {
            // Error 101 or 150 means playback is restricted/not allowed in embedded players
            if (event.data === 101 || event.data === 150) {
              setIsRestricted(true);
            }
          }
        }
      });
    };

    // If API is already loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Store original callback in case multiple players are loading
      const originalCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (originalCallback) originalCallback();
        initPlayer();
      };
    }

    return () => {
      // Important: We DO NOT call playerRef.current.destroy() here.
      // destroy() completely removes the iframe element from the DOM.
      // Since React manages the iframe element in this new approach, 
      // removing it would cause "Node.removeChild: The node is not a child of this node" crashes.
      playerRef.current = null;
    };
  }, [videoId]);

  if (isRestricted) {
    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '12px' }}>
        <img 
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <a 
            href={`https://www.youtube.com/watch?v=${videoId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', backgroundColor: '#ff0000', color: '#fff',
              textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px'
            }}
          >
            <i className="fa-brands fa-youtube" style={{ fontSize: '16px' }}></i> Watch on YouTube
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '100%' }}
      ></iframe>
    </div>
  );
};
