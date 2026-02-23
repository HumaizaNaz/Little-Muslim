'use client';

import { useState, useEffect } from 'react';

export default function Mascot() {
  const [wave, setWave] = useState(false);
  const [twinkle, setTwinkle] = useState(true);

  useEffect(() => {
    // Wave animation on mount
    setWave(true);
    const timer = setTimeout(() => setWave(false), 1200);

    // Twinkle effect
    const twinkleTimer = setInterval(() => {
      setTwinkle(prev => !prev);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(twinkleTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mb-8 animate-fade-in-up">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse blur-xl" />

        {/* Crescent Moon Mascot */}
        <svg
          viewBox="0 0 200 200"
          className={`w-full h-full drop-shadow-2xl transition-transform ${wave ? 'animate-bounce' : 'animate-float'}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crescent Shape */}
          <defs>
            <linearGradient id="crescentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4169E1', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#6495ED', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main Crescent */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="url(#crescentGradient)"
            filter="url(#glow)"
          />
          <circle
            cx="115"
            cy="85"
            r="85"
            fill="white"
          />

          {/* Eyes */}
          <circle
            cx="72"
            cy="100"
            r="7"
            fill="#1a1a1a"
            className="animate-pulse"
            style={{ animationDuration: '2s' }}
          />
          <circle
            cx="95"
            cy="90"
            r="7"
            fill="#1a1a1a"
            className="animate-pulse"
            style={{ animationDuration: '2s' }}
          />

          {/* Smile */}
          <path
            d="M 68 115 Q 83 128 98 115"
            stroke="#1a1a1a"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Star Twinkle */}
          <g className="animate-twinkle">
            <text
              x="140"
              y="60"
              fontSize="24"
              fontFamily="Arial"
              style={{ animationDuration: '1.5s' }}
            >
              ✨
            </text>
          </g>
        </svg>

        {/* Wave Hand Animation */}
        {wave && (
          <div
            className="absolute -right-4 top-12 text-4xl animate-bounce"
            style={{ animationDuration: '0.6s', animationDelay: '0.2s' }}
          >
            👋
          </div>
        )}

        {/* Sparkles around mascot */}
        <div className="absolute -top-4 left-4 text-xl animate-pulse" style={{ animationDuration: '2s' }}>⭐</div>
        <div className="absolute -bottom-4 right-6 text-lg animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>✨</div>
      </div>

      <p className="mt-6 text-2xl font-bold text-primary text-center animate-slide-in">
        Welcome, Explorer!
      </p>
      <p className="text-sm text-muted-foreground text-center mt-2 animate-slide-in" style={{ animationDelay: '0.1s' }}>
        Ready to learn and have fun?
      </p>
    </div>
  );
}
