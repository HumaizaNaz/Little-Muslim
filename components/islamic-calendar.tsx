'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useT } from '@/lib/language-context';

interface IslamicCalendarProps {
  onBack: () => void;
}

const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhul Qa'dah", 'Dhul Hijjah',
];

const HIJRI_MONTHS_UR = [
  'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی',
  'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ',
];

// Key Islamic events by Hijri month & day
const ISLAMIC_EVENTS = [
  { month: 1,  day: 1,  en: "Islamic New Year",           ur: "اسلامی نیا سال",         emoji: '🌙' },
  { month: 1,  day: 10, en: "Day of Ashura",              ur: "یوم عاشورہ",              emoji: '🤲' },
  { month: 3,  day: 12, en: "Eid Milad-un-Nabi ﷺ",       ur: "عید میلاد النبی ﷺ",       emoji: '💚' },
  { month: 7,  day: 27, en: "Shab-e-Mi'raj",              ur: "شب معراج",                emoji: '✨' },
  { month: 8,  day: 15, en: "Shab-e-Baraat",              ur: "شب برات",                 emoji: '🌟' },
  { month: 9,  day: 1,  en: "Ramadan Begins",             ur: "رمضان کا آغاز",           emoji: '🌙' },
  { month: 9,  day: 27, en: "Laylat-ul-Qadr (est.)",      ur: "لیلۃ القدر (متوقع)",      emoji: '⭐' },
  { month: 10, day: 1,  en: "Eid-ul-Fitr",                ur: "عید الفطر",               emoji: '🎉' },
  { month: 12, day: 9,  en: "Day of Arafah",              ur: "یوم عرفہ",                emoji: '🕋' },
  { month: 12, day: 10, en: "Eid-ul-Adha",                ur: "عید الاضحی",              emoji: '🐑' },
];

// Get today's Hijri date using browser Intl API
function getHijriDate() {
  const now = new Date();
  try {
    const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'numeric', year: 'numeric',
    });
    const parts = hijriFormatter.formatToParts(now);
    const day   = parseInt(parts.find(p => p.type === 'day')?.value   || '1');
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '1');
    const year  = parseInt(parts.find(p => p.type === 'year')?.value  || '1446');
    return { day, month, year };
  } catch {
    // Rough fallback estimate (2025 ≈ 1447 AH)
    return { day: 1, month: 1, year: 1447 };
  }
}

function getGregorianDayName(lang: string) {
  return new Date().toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-US', { weekday: 'long' });
}

function getGregorianDate(lang: string) {
  return new Date().toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function IslamicCalendar({ onBack }: IslamicCalendarProps) {
  const t = useT();
  const [hijri, setHijri] = useState({ day: 1, month: 1, year: 1446 });
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  useEffect(() => {
    setHijri(getHijriDate());
    // Detect current lang from localStorage (same key used by LanguageContext)
    const saved = localStorage.getItem('lang');
    if (saved === 'ur') setLang('ur');
  }, []);

  // Upcoming events — find next 4 events from current Hijri month/day
  const upcomingEvents = (() => {
    const current = hijri.month * 100 + hijri.day;
    const sorted = [...ISLAMIC_EVENTS].sort((a, b) => {
      const av = a.month * 100 + a.day;
      const bv = b.month * 100 + b.day;
      // Rotate so past events appear after future
      const an = av >= current ? av : av + 1300;
      const bn = bv >= current ? bv : bv + 1300;
      return an - bn;
    });
    return sorted.slice(0, 5);
  })();

  const hijriMonthName = lang === 'ur' ? HIJRI_MONTHS_UR[hijri.month - 1] : HIJRI_MONTHS_EN[hijri.month - 1];

  return (
    <div className="min-h-screen flex flex-col px-4 py-5 max-w-2xl mx-auto">

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-5 transition-all"
      >
        <ArrowLeft size={22} />
        {t('Back', 'واپس')}
      </button>

      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-2xl font-extrabold text-primary mb-1">
          📅 {t('Islamic Calendar', 'اسلامی کیلنڈر')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("Today's Hijri date and upcoming events", "آج کی ہجری تاریخ اور آنے والے واقعات")}
        </p>
      </div>

      {/* Today's Date Card */}
      <Card className="p-6 mb-5 border-2 border-primary/30 bg-gradient-to-br from-primary/20 via-blue-500/10 to-accent/10 text-center shadow-xl">
        {/* Hijri Date — big */}
        <div className="text-6xl font-extrabold text-primary mb-1">{hijri.day}</div>
        <div className="text-2xl font-bold text-primary mb-1">{hijriMonthName}</div>
        <div className="text-lg font-semibold text-accent mb-4">{hijri.year} AH</div>

        {/* Divider */}
        <div className="border-t border-primary/20 pt-3">
          <p className="text-sm font-bold text-foreground">{getGregorianDayName(lang)}</p>
          <p className="text-sm text-muted-foreground">{getGregorianDate(lang)}</p>
        </div>
      </Card>

      {/* Hijri Months Grid */}
      <h2 className="text-lg font-extrabold text-primary mb-3">
        🗓 {t('Hijri Months', 'ہجری مہینے')}
      </h2>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {HIJRI_MONTHS_EN.map((monthEn, idx) => {
          const isCurrentMonth = idx + 1 === hijri.month;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                isCurrentMonth
                  ? 'bg-primary text-white border-primary shadow-lg scale-105'
                  : 'bg-card/60 border-primary/20 hover:border-primary/40'
              }`}
            >
              <div className="text-xs font-bold opacity-60 mb-0.5">{idx + 1}</div>
              <div className={`text-xs font-bold leading-tight ${isCurrentMonth ? 'text-white' : 'text-primary'}`}>
                {lang === 'ur' ? HIJRI_MONTHS_UR[idx] : monthEn}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Islamic Events */}
      <h2 className="text-lg font-extrabold text-primary mb-3">
        ⭐ {t('Upcoming Events', 'آنے والے واقعات')}
      </h2>
      <div className="space-y-3 mb-6">
        {upcomingEvents.map((event, idx) => {
          const isNow = event.month === hijri.month && event.day === hijri.day;
          return (
            <Card
              key={idx}
              className={`p-4 border-2 flex items-center gap-4 ${
                isNow
                  ? 'border-accent bg-accent/10 shadow-md'
                  : 'border-primary/20 bg-card/60'
              }`}
            >
              <div className="text-3xl">{event.emoji}</div>
              <div className="flex-1">
                <p className="font-bold text-foreground text-sm">
                  {lang === 'ur' ? event.ur : event.en}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === 'ur' ? HIJRI_MONTHS_UR[event.month - 1] : HIJRI_MONTHS_EN[event.month - 1]} {event.day}
                </p>
              </div>
              {isNow && (
                <span className="text-xs bg-accent text-accent-foreground font-bold px-2 py-1 rounded-full">
                  {t('Today!', 'آج!')}
                </span>
              )}
            </Card>
          );
        })}
      </div>

      {/* Islamic Fact */}
      <Card className="p-4 border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-secondary/10 text-center">
        <p className="text-xs text-muted-foreground">
          💡 {t(
            'The Islamic calendar is lunar — each month begins with the new moon. One Hijri year has 354 days.',
            'اسلامی کیلنڈر چاند پر مبنی ہے — ہر مہینہ نئے چاند سے شروع ہوتا ہے۔ ایک ہجری سال میں ۳۵۴ دن ہوتے ہیں۔'
          )}
        </p>
      </Card>
    </div>
  );
}
