'use client';

interface StarsDisplayProps {
  stars: number;
}

export default function StarsDisplay({ stars }: StarsDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-3xl animate-twinkle">⭐</span>
      <span className="text-2xl font-extrabold text-primary">{stars}</span>
    </div>
  );
}
