'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ParentPinModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const DEFAULT_PIN = '1234';

export default function ParentPinModal({ onSuccess, onClose }: ParentPinModalProps) {
  const [entered, setEntered] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const correctPin = localStorage.getItem('parent-pin') || DEFAULT_PIN;

  const handleKey = (digit: string) => {
    if (entered.length >= 4) return;
    const next = entered + digit;
    setEntered(next);
    setError(false);

    if (next.length === 4) {
      if (next === correctPin) {
        onSuccess();
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => {
          setEntered('');
          setShake(false);
        }, 700);
      }
    }
  };

  const handleDel = () => {
    setEntered(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <Card className={`w-full max-w-sm p-8 text-center border-2 border-primary/30 ${shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}`}>
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-extrabold text-primary mb-1">Parent Access</h2>
        <p className="text-sm text-muted-foreground mb-6">4-digit PIN daalo</p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
                entered.length > i
                  ? error ? 'bg-red-500 border-red-500' : 'bg-primary border-primary'
                  : 'border-muted-foreground bg-transparent'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm font-bold mb-4">Galat PIN! Dobara try karo.</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1','2','3','4','5','6','7','8','9'].map((d) => (
            <button
              key={d}
              onClick={() => handleKey(d)}
              className="h-14 text-2xl font-bold rounded-2xl bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary transition-all"
            >
              {d}
            </button>
          ))}
          <div /> {/* empty cell */}
          <button
            onClick={() => handleKey('0')}
            className="h-14 text-2xl font-bold rounded-2xl bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary transition-all"
          >
            0
          </button>
          <button
            onClick={handleDel}
            className="h-14 text-xl font-bold rounded-2xl bg-muted hover:bg-muted/80 active:scale-95 text-muted-foreground transition-all"
          >
            ⌫
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Cancel / Wapas Jao
        </button>
      </Card>
    </div>
  );
}
