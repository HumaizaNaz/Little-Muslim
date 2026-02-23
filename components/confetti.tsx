'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export default function Confetti({ active, duration = 2000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    if (!active) return;

    const newPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [active, duration]);

  if (!pieces.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute animate-pulse-grow text-2xl"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            animation: `fall 2s ease-in forwards`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          {['⭐', '✨', '🌟', '🎉'][piece.id % 4]}
        </div>
      ))}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
