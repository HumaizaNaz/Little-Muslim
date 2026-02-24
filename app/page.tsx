'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { ArrowUp } from 'lucide-react';
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
import AsmaulHusna from '@/components/asmaul-husna';
import AsmaulNabi from '@/components/asmaul-nabi';
import IslamicCalendar from '@/components/islamic-calendar';

type Screen = 'home' | 'wudu' | 'salah' | 'roza' | 'stories' | 'duas' | 'rewards' | 'ramadan' | 'parents' | 'asmaul-husna' | 'asmaul-nabi' | 'calendar';

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch {}
    }
    setIsLoading(false);
  }, []);

  // Scroll to top instantly when screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentScreen]);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      case 'parents':      return <ParentsDashboard onBack={() => setCurrentScreen('home')} onLogout={handleLogout} />;
      case 'asmaul-husna': return <AsmaulHusna onBack={() => setCurrentScreen('home')} />;
      case 'asmaul-nabi':  return <AsmaulNabi  onBack={() => setCurrentScreen('home')} />;
      case 'calendar':     return <IslamicCalendar onBack={() => setCurrentScreen('home')} />;
      default:             return <HomeContent onNavigate={setCurrentScreen} username={user?.username} />;
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
    <main className="min-h-screen relative overflow-hidden">

      {/* ── Islamic Background ── */}
      {/* Base gradient */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 dark:from-[#080d1a] dark:via-[#0b1530] dark:to-[#091224]" />

      {/* Islamic geometric star pattern overlay */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.07] dark:opacity-[0.15]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-star" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 4L45 28L69 22L53 40L69 58L45 52L40 76L35 52L11 58L27 40L11 22L35 28Z"
                fill="none" stroke="#4169E1" strokeWidth="1.2"/>
              <rect x="31" y="31" width="18" height="18" fill="none" stroke="#4169E1" strokeWidth="0.8"
                transform="rotate(45 40 40)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-star)"/>
        </svg>
      </div>

      {/* Glowing orbs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-500/15 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 w-72 h-72 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Decorative crescent (top-right, large & subtle) */}
      <div className="fixed top-10 right-6 pointer-events-none opacity-[0.08] dark:opacity-[0.18] select-none">
        <svg viewBox="0 0 160 160" width="220" height="220">
          <circle cx="80" cy="80" r="75" fill="#4169E1"/>
          <circle cx="100" cy="62" r="70" fill="#f0f4ff" className="dark:[fill:#080d1a]"/>
          <text x="115" y="38" fontSize="22" fill="#FFD700" fontFamily="Arial">★</text>
          <text x="130" y="68" fontSize="13" fill="#FFD700" fontFamily="Arial">★</text>
          <text x="105" y="20" fontSize="11" fill="#FFD700" fontFamily="Arial">★</text>
        </svg>
      </div>

      {/* ── Top Header ── */}
      <div className="relative z-10 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/15 dark:from-primary/30 dark:via-primary/20 dark:to-accent/20 border-b border-primary/20 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        {/* Left: username with avatar circle */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-base shadow-md select-none">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-primary">{user.username}</span>
            <span className="text-[10px] text-muted-foreground">{lang === 'en' ? 'Little Explorer' : 'چھوٹا سیکھنے والا'}</span>
          </div>
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

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-primary/10 bg-primary/5 dark:bg-primary/10 backdrop-blur-sm px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground mb-1">
          🌙 Little Muslim Explorer — {lang === 'en' ? 'Islamic Learning App for Kids' : 'بچوں کے لیے اسلامی تعلیمی ایپ'}
        </p>
        <p className="text-xs text-muted-foreground">
          {lang === 'en' ? 'Questions or feedback?' : 'کوئی سوال یا رائے؟'}{' '}
          <a
            href="mailto:humaizaasghar@gmail.com"
            className="text-primary font-semibold hover:underline"
          >
            humaizaasghar@gmail.com
          </a>
        </p>
      </footer>

      {/* ── Scroll to Top Button ── */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-5 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center active:scale-90 transition-all hover:bg-primary/90 animate-fade-in-up"
          aria-label="Scroll to top"
        >
          <ArrowUp size={22} strokeWidth={2.5} />
        </button>
      )}

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
