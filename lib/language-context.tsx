'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'ur';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('app-language') as Lang;
    if (saved === 'en' || saved === 'ur') setLang(saved);
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'ur' : 'en';
    setLang(next);
    localStorage.setItem('app-language', next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

// Helper: pick text based on current lang
// Usage: t('Hello', 'ہیلو')
export const useT = () => {
  const { lang } = useLanguage();
  return (en: string, ur: string) => lang === 'ur' ? ur : en;
};
