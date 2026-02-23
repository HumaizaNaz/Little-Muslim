'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { LanguageProvider, useLanguage } from '@/lib/language-context';
import AuthScreen from '@/components/auth-screen';
import HomeContent from '@/components/home-content';
import WuduGuide from '@/components/wudu-guide';
import SalahGuide from '@/components/salah-guide';
import RozaTracker from '@/components/roza-tracker';
import StoriesScreen from '@/components/stories-screen';
import DuasGame from '@/components/duas-game';
import RewardsScreen from '@/components/rewards-screen';
import RamadanChallenge from '@/components/ramadan-challenge';
import ParentsDashboard from '@/components/parents-dashboard';
import ParentPinModal from '@/components/parent-pin-modal';

type Screen = 'home' | 'wudu' | 'salah' | 'roza' | 'stories' | 'duas' | 'rewards' | 'ramadan' | 'parents';

interface User {
  id: number;
  email: string;
  username: string;
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinTarget, setPinTarget] = useState<'dashboard' | 'logout' | null>(null);
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch {}
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setCurrentScreen('home');
  };

  // Open PIN modal with a target action
  const requestParentAccess = (target: 'dashboard' | 'logout') => {
    setPinTarget(target);
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (pinTarget === 'dashboard') setCurrentScreen('parents');
    if (pinTarget === 'logout') handleLogout();
    setPinTarget(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'wudu':    return <WuduGuide onBack={() => setCurrentScreen('home')} />;
      case 'salah':   return <SalahGuide onBack={() => setCurrentScreen('home')} />;
      case 'roza':    return <RozaTracker onBack={() => setCurrentScreen('home')} />;
      case 'stories': return <StoriesScreen onBack={() => setCurrentScreen('home')} />;
      case 'duas':    return <DuasGame onBack={() => setCurrentScreen('home')} />;
      case 'rewards': return <RewardsScreen onBack={() => setCurrentScreen('home')} />;
      case 'ramadan': return <RamadanChallenge onBack={() => setCurrentScreen('home')} />;
      case 'parents': return <ParentsDashboard onBack={() => setCurrentScreen('home')} onLogout={handleLogout} />;
      default:        return <HomeContent onNavigate={setCurrentScreen} username={user?.username} />;
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-float">🌙</div>
          <p className="text-xl font-bold text-primary">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={(newUser) => setUser(newUser)} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ── Top Header (Kid-Friendly — minimal buttons) ── */}
      <div className="relative z-10 bg-primary/10 border-b border-primary/20 px-4 py-3 flex justify-between items-center">
        {/* Left: username */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">👦</span>
          <span className="text-base font-bold text-primary">{user.username}</span>
        </div>

        {/* Right: only theme toggle + hidden parent lock */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 bg-accent/20 hover:bg-accent/30 active:scale-95 px-3 py-2 rounded-xl text-sm font-bold text-accent transition-all"
            title="Language / زبان"
          >
            {lang === 'en' ? '🇵🇰 اردو' : '🇺🇸 English'}
          </button>

          {/* Dark/Light mode */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-2xl p-2 rounded-xl hover:bg-primary/10 active:scale-95 transition-all"
            title="Theme Toggle"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Parent Lock — opens PIN modal */}
          <button
            onClick={() => requestParentAccess('dashboard')}
            className="flex items-center gap-1 bg-muted hover:bg-muted/80 active:scale-95 px-3 py-2 rounded-xl text-sm font-bold text-muted-foreground transition-all"
            title="Parent Zone"
          >
            🔐 Parents
          </button>
        </div>
      </div>

      {/* ── Screen Content ── */}
      <div className="relative z-10">
        {renderScreen()}
      </div>

      {/* ── PIN Modal ── */}
      {showPinModal && (
        <ParentPinModal
          onSuccess={handlePinSuccess}
          onClose={() => { setShowPinModal(false); setPinTarget(null); }}
        />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
