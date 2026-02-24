'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Volume2, Loader2 } from 'lucide-react';
import { useT } from '@/lib/language-context';
import { type Stoppable } from '@/lib/audio-utils';

interface AsmaulHusnaProps {
  onBack: () => void;
}

const NAMES = [
  { n: 1,  ar: 'الرَّحْمَن',      tr: 'Ar-Rahman',       en: 'The Most Gracious',         ur: 'بے حد مہربان' },
  { n: 2,  ar: 'الرَّحِيم',       tr: 'Ar-Raheem',        en: 'The Most Merciful',          ur: 'نہایت رحم والا' },
  { n: 3,  ar: 'الْمَلِك',        tr: 'Al-Malik',         en: 'The King',                   ur: 'بادشاہ' },
  { n: 4,  ar: 'الْقُدُّوس',      tr: 'Al-Quddus',        en: 'The Most Holy',              ur: 'پاک ذات' },
  { n: 5,  ar: 'السَّلَام',       tr: 'As-Salam',         en: 'The Source of Peace',        ur: 'سلامتی دینے والا' },
  { n: 6,  ar: 'الْمُؤْمِن',      tr: "Al-Mu'min",        en: 'The Guardian of Faith',      ur: 'امن دینے والا' },
  { n: 7,  ar: 'الْمُهَيْمِن',    tr: 'Al-Muhaymin',      en: 'The Protector',              ur: 'نگہبان' },
  { n: 8,  ar: 'الْعَزِيز',       tr: "Al-'Aziz",         en: 'The Almighty',               ur: 'سب پر غالب' },
  { n: 9,  ar: 'الْجَبَّار',      tr: 'Al-Jabbar',        en: 'The Compeller',              ur: 'زبردست' },
  { n: 10, ar: 'الْمُتَكَبِّر',   tr: 'Al-Mutakabbir',    en: 'The Supreme',                ur: 'بڑائی والا' },
  { n: 11, ar: 'الْخَالِق',       tr: 'Al-Khaliq',        en: 'The Creator',                ur: 'پیدا کرنے والا' },
  { n: 12, ar: 'الْبَارِئ',       tr: "Al-Bari'",         en: 'The Maker',                  ur: 'بنانے والا' },
  { n: 13, ar: 'الْمُصَوِّر',     tr: 'Al-Musawwir',      en: 'The Fashioner',              ur: 'صورت بنانے والا' },
  { n: 14, ar: 'الْغَفَّار',      tr: 'Al-Ghaffar',       en: 'The Ever-Forgiving',         ur: 'بار بار معاف کرنے والا' },
  { n: 15, ar: 'الْقَهَّار',      tr: 'Al-Qahhar',        en: 'The Subduer',                ur: 'سب پر قابو رکھنے والا' },
  { n: 16, ar: 'الْوَهَّاب',      tr: 'Al-Wahhab',        en: 'The Bestower',               ur: 'بے حساب دینے والا' },
  { n: 17, ar: 'الرَّزَّاق',      tr: 'Ar-Razzaq',        en: 'The Provider',               ur: 'رزق دینے والا' },
  { n: 18, ar: 'الْفَتَّاح',      tr: 'Al-Fattah',        en: 'The Opener',                 ur: 'کھولنے والا' },
  { n: 19, ar: 'الْعَلِيم',       tr: "Al-'Aleem",        en: 'The All-Knowing',            ur: 'سب جاننے والا' },
  { n: 20, ar: 'الْقَابِض',       tr: 'Al-Qabid',         en: 'The Withholder',             ur: 'روکنے والا' },
  { n: 21, ar: 'الْبَاسِط',       tr: 'Al-Basit',         en: 'The Extender',               ur: 'کشادگی دینے والا' },
  { n: 22, ar: 'الْخَافِض',       tr: 'Al-Khafid',        en: 'The Abaser',                 ur: 'پست کرنے والا' },
  { n: 23, ar: 'الرَّافِع',       tr: "Ar-Rafi'",         en: 'The Exalter',                ur: 'اونچا کرنے والا' },
  { n: 24, ar: 'الْمُعِز',        tr: "Al-Mu'izz",        en: 'The Giver of Honor',         ur: 'عزت دینے والا' },
  { n: 25, ar: 'الْمُذِل',        tr: 'Al-Mudhill',       en: 'The Humiliator',             ur: 'ذلیل کرنے والا' },
  { n: 26, ar: 'السَّمِيع',       tr: "As-Sami'",         en: 'The All-Hearing',            ur: 'سب سننے والا' },
  { n: 27, ar: 'الْبَصِير',       tr: 'Al-Basir',         en: 'The All-Seeing',             ur: 'سب دیکھنے والا' },
  { n: 28, ar: 'الْحَكَم',        tr: 'Al-Hakam',         en: 'The Judge',                  ur: 'فیصلہ کرنے والا' },
  { n: 29, ar: 'الْعَدْل',        tr: "Al-'Adl",          en: 'The Just',                   ur: 'انصاف والا' },
  { n: 30, ar: 'اللَّطِيف',       tr: 'Al-Latif',         en: 'The Subtle One',             ur: 'مہربان و باریک بین' },
  { n: 31, ar: 'الْخَبِير',       tr: 'Al-Khabir',        en: 'The All-Aware',              ur: 'باخبر' },
  { n: 32, ar: 'الْحَلِيم',       tr: 'Al-Halim',         en: 'The Forbearing',             ur: 'بردبار' },
  { n: 33, ar: 'الْعَظِيم',       tr: "Al-'Azim",         en: 'The Magnificent',            ur: 'بہت بڑا' },
  { n: 34, ar: 'الْغَفُور',       tr: 'Al-Ghafur',        en: 'The Forgiving',              ur: 'معاف کرنے والا' },
  { n: 35, ar: 'الشَّكُور',       tr: 'Ash-Shakur',       en: 'The Appreciative',           ur: 'قدر دان' },
  { n: 36, ar: 'الْعَلِي',        tr: "Al-'Ali",          en: 'The Most High',              ur: 'بلند و بالا' },
  { n: 37, ar: 'الْكَبِير',       tr: 'Al-Kabir',         en: 'The Great',                  ur: 'بہت بڑا' },
  { n: 38, ar: 'الْحَفِيظ',       tr: 'Al-Hafiz',         en: 'The Preserver',              ur: 'حفاظت کرنے والا' },
  { n: 39, ar: 'الْمُقِيت',       tr: 'Al-Muqit',         en: 'The Sustainer',              ur: 'روزی دینے والا' },
  { n: 40, ar: 'الْحَسِيب',       tr: 'Al-Hasib',         en: 'The Reckoner',               ur: 'حساب لینے والا' },
  { n: 41, ar: 'الْجَلِيل',       tr: 'Al-Jalil',         en: 'The Majestic',               ur: 'عظمت والا' },
  { n: 42, ar: 'الْكَرِيم',       tr: 'Al-Karim',         en: 'The Generous',               ur: 'بہت کریم' },
  { n: 43, ar: 'الرَّقِيب',       tr: 'Ar-Raqib',         en: 'The Watchful',               ur: 'نگرانی کرنے والا' },
  { n: 44, ar: 'الْمُجِيب',       tr: 'Al-Mujib',         en: 'The Responsive',             ur: 'دعا قبول کرنے والا' },
  { n: 45, ar: 'الْوَاسِع',       tr: "Al-Wasi'",         en: 'The Vast',                   ur: 'وسعت والا' },
  { n: 46, ar: 'الْحَكِيم',       tr: 'Al-Hakim',         en: 'The Wise',                   ur: 'حکمت والا' },
  { n: 47, ar: 'الْوَدُود',       tr: 'Al-Wadud',         en: 'The Loving',                 ur: 'محبت کرنے والا' },
  { n: 48, ar: 'الْمَجِيد',       tr: 'Al-Majid',         en: 'The Glorious',               ur: 'بزرگی والا' },
  { n: 49, ar: 'الْبَاعِث',       tr: "Al-Ba'ith",        en: 'The Resurrector',            ur: 'اٹھانے والا' },
  { n: 50, ar: 'الشَّهِيد',       tr: 'Ash-Shahid',       en: 'The Witness',                ur: 'گواہ' },
  { n: 51, ar: 'الْحَق',          tr: 'Al-Haqq',          en: 'The Truth',                  ur: 'سچا' },
  { n: 52, ar: 'الْوَكِيل',       tr: 'Al-Wakil',         en: 'The Trustee',                ur: 'کارساز' },
  { n: 53, ar: 'الْقَوِي',        tr: 'Al-Qawi',          en: 'The Most Strong',            ur: 'سب سے طاقتور' },
  { n: 54, ar: 'الْمَتِين',       tr: 'Al-Matin',         en: 'The Firm',                   ur: 'مضبوط' },
  { n: 55, ar: 'الْوَلِي',        tr: 'Al-Wali',          en: 'The Protecting Friend',      ur: 'دوست و مددگار' },
  { n: 56, ar: 'الْحَمِيد',       tr: 'Al-Hamid',         en: 'The Praiseworthy',           ur: 'تعریف کے لائق' },
  { n: 57, ar: 'الْمُحْصِي',      tr: 'Al-Muhsi',         en: 'The Reckoner',               ur: 'گنتی کرنے والا' },
  { n: 58, ar: 'الْمُبْدِئ',      tr: "Al-Mubdi'",        en: 'The Originator',             ur: 'شروع کرنے والا' },
  { n: 59, ar: 'الْمُعِيد',       tr: "Al-Mu'id",         en: 'The Restorer',               ur: 'دوبارہ بنانے والا' },
  { n: 60, ar: 'الْمُحْيِي',      tr: 'Al-Muhyi',         en: 'The Giver of Life',          ur: 'زندگی دینے والا' },
  { n: 61, ar: 'الْمُمِيت',       tr: 'Al-Mumit',         en: 'The Taker of Life',          ur: 'موت دینے والا' },
  { n: 62, ar: 'الْحَي',          tr: 'Al-Hayy',          en: 'The Ever-Living',            ur: 'ہمیشہ زندہ' },
  { n: 63, ar: 'الْقَيُّوم',      tr: 'Al-Qayyum',        en: 'The Self-Subsisting',        ur: 'خود قائم' },
  { n: 64, ar: 'الْوَاجِد',       tr: 'Al-Wajid',         en: 'The Finder',                 ur: 'پانے والا' },
  { n: 65, ar: 'الْمَاجِد',       tr: 'Al-Majid',         en: 'The Noble',                  ur: 'شریف' },
  { n: 66, ar: 'الْوَاحِد',       tr: 'Al-Wahid',         en: 'The One',                    ur: 'اکیلا' },
  { n: 67, ar: 'الْأَحَد',        tr: 'Al-Ahad',          en: 'The Unique',                 ur: 'یکتا' },
  { n: 68, ar: 'الصَّمَد',        tr: 'As-Samad',         en: 'The Eternal',                ur: 'بے نیاز' },
  { n: 69, ar: 'الْقَادِر',       tr: 'Al-Qadir',         en: 'The Capable',                ur: 'قدرت والا' },
  { n: 70, ar: 'الْمُقْتَدِر',    tr: 'Al-Muqtadir',      en: 'The Powerful',               ur: 'طاقت والا' },
  { n: 71, ar: 'الْمُقَدِّم',     tr: 'Al-Muqaddim',      en: 'The Expediter',              ur: 'آگے کرنے والا' },
  { n: 72, ar: 'الْمُؤَخِّر',     tr: "Al-Mu'akhkhir",    en: 'The Delayer',                ur: 'پیچھے کرنے والا' },
  { n: 73, ar: 'الْأَوَّل',       tr: 'Al-Awwal',         en: 'The First',                  ur: 'سب سے پہلا' },
  { n: 74, ar: 'الْآخِر',         tr: 'Al-Akhir',         en: 'The Last',                   ur: 'سب سے آخری' },
  { n: 75, ar: 'الظَّاهِر',       tr: 'Az-Zahir',         en: 'The Manifest',               ur: 'ظاہر' },
  { n: 76, ar: 'الْبَاطِن',       tr: 'Al-Batin',         en: 'The Hidden',                 ur: 'پوشیدہ' },
  { n: 77, ar: 'الْوَالِي',       tr: 'Al-Wali',          en: 'The Governor',               ur: 'حاکم' },
  { n: 78, ar: 'الْمُتَعَالِي',   tr: "Al-Muta'ali",      en: 'The Supreme',                ur: 'سب سے اعلیٰ' },
  { n: 79, ar: 'الْبَر',          tr: 'Al-Barr',          en: 'The Source of Goodness',     ur: 'نیکی کرنے والا' },
  { n: 80, ar: 'التَّوَّاب',      tr: 'At-Tawwab',        en: 'The Acceptor of Repentance', ur: 'توبہ قبول کرنے والا' },
  { n: 81, ar: 'الْمُنْتَقِم',    tr: 'Al-Muntaqim',      en: 'The Avenger',                ur: 'بدلہ لینے والا' },
  { n: 82, ar: 'الْعَفُو',        tr: "Al-'Afu",          en: 'The Pardoner',               ur: 'معاف کرنے والا' },
  { n: 83, ar: 'الرَّؤُوف',       tr: "Ar-Ra'uf",         en: 'The Compassionate',          ur: 'شفقت کرنے والا' },
  { n: 84, ar: 'مَالِكُ الْمُلْك', tr: 'Malik-ul-Mulk',   en: 'Owner of Sovereignty',       ur: 'بادشاہی کا مالک' },
  { n: 85, ar: 'ذُو الْجَلَال',   tr: 'Dhul-Jalal',       en: 'Lord of Majesty',            ur: 'بڑائی والا' },
  { n: 86, ar: 'الْمُقْسِط',      tr: 'Al-Muqsit',        en: 'The Equitable',              ur: 'انصاف کرنے والا' },
  { n: 87, ar: 'الْجَامِع',       tr: "Al-Jami'",         en: 'The Gatherer',               ur: 'جمع کرنے والا' },
  { n: 88, ar: 'الْغَنِي',        tr: 'Al-Ghani',         en: 'The Self-Sufficient',        ur: 'بے نیاز' },
  { n: 89, ar: 'الْمُغْنِي',      tr: 'Al-Mughni',        en: 'The Enricher',               ur: 'مالدار کرنے والا' },
  { n: 90, ar: 'الْمَانِع',       tr: "Al-Mani'",         en: 'The Preventer',              ur: 'روکنے والا' },
  { n: 91, ar: 'الضَّار',         tr: 'Ad-Darr',          en: 'The Distresser',             ur: 'نقصان دینے والا' },
  { n: 92, ar: 'النَّافِع',       tr: "An-Nafi'",         en: 'The Benefiter',              ur: 'فائدہ دینے والا' },
  { n: 93, ar: 'النُّور',          tr: 'An-Nur',           en: 'The Light',                  ur: 'نور' },
  { n: 94, ar: 'الْهَادِي',       tr: 'Al-Hadi',          en: 'The Guide',                  ur: 'راہ دکھانے والا' },
  { n: 95, ar: 'الْبَدِيع',       tr: "Al-Badi'",         en: 'The Originator',             ur: 'انوکھا بنانے والا' },
  { n: 96, ar: 'الْبَاقِي',       tr: 'Al-Baqi',          en: 'The Everlasting',            ur: 'ہمیشہ رہنے والا' },
  { n: 97, ar: 'الْوَارِث',       tr: 'Al-Warith',        en: 'The Inheritor',              ur: 'وارث' },
  { n: 98, ar: 'الرَّشِيد',       tr: 'Ar-Rashid',        en: 'The Guide to Right Path',    ur: 'سیدھی راہ دکھانے والا' },
  { n: 99, ar: 'الصَّبُور',       tr: 'As-Sabur',         en: 'The Patient',                ur: 'صبر کرنے والا' },
];

// Colors cycle through for visual variety
const CARD_COLORS = [
  'from-blue-400/30 to-blue-600/20 border-blue-400/50 text-blue-700 dark:text-blue-300',
  'from-emerald-400/30 to-emerald-600/20 border-emerald-400/50 text-emerald-700 dark:text-emerald-300',
  'from-purple-400/30 to-purple-600/20 border-purple-400/50 text-purple-700 dark:text-purple-300',
  'from-amber-400/30 to-amber-600/20 border-amber-400/50 text-amber-700 dark:text-amber-300',
  'from-rose-400/30 to-rose-600/20 border-rose-400/50 text-rose-700 dark:text-rose-300',
  'from-teal-400/30 to-teal-600/20 border-teal-400/50 text-teal-700 dark:text-teal-300',
  'from-indigo-400/30 to-indigo-600/20 border-indigo-400/50 text-indigo-700 dark:text-indigo-300',
];

export default function AsmaulHusna({ onBack }: AsmaulHusnaProps) {
  const t = useT();
  const [selected, setSelected] = useState<number | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const currentAudio = useRef<Stoppable | null>(null);

  const playName = (idx: number, arabicName: string) => {
    // Stop previous
    currentAudio.current?.pause();
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();

    if (playingIdx === idx) {
      setPlayingIdx(null);
      return;
    }

    setPlayingIdx(idx);

    // Try Google TTS first, then Web Speech
    const url = `/api/tts?text=${encodeURIComponent(arabicName)}`;
    const audio = new Audio(url);
    currentAudio.current = { pause: () => audio.pause() };

    audio.onended = () => setPlayingIdx(null);
    audio.onerror = () => {
      // Fallback to Web Speech
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utt = new SpeechSynthesisUtterance(arabicName);
        utt.lang = 'ar-SA';
        utt.rate = 0.7;
        utt.onend = () => setPlayingIdx(null);
        window.speechSynthesis.speak(utt);
      } else {
        setPlayingIdx(null);
      }
    };
    audio.play().catch(() => audio.onerror?.(new Event('error')));
  };

  const selectedName = selected !== null ? NAMES[selected] : null;

  return (
    <div className="min-h-screen flex flex-col px-3 py-5 max-w-2xl mx-auto">

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
          ✨ {t('99 Names of Allah', 'اللہ کے ۹۹ نام')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('Tap any name to hear it — learn and remember!', 'کسی بھی نام پر کلک کرو اور سنو!')}
        </p>
      </div>

      {/* Selected name — big popup card */}
      {selectedName && (
        <div className="mb-5 p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary/30 text-center shadow-lg">
          <div className="text-5xl font-bold mb-2 text-primary" style={{ fontFamily: 'Noto Naskh Arabic, serif', direction: 'rtl' }}>
            {selectedName.ar}
          </div>
          <div className="text-lg font-bold text-foreground mb-1">{selectedName.tr}</div>
          <div className="text-base text-muted-foreground mb-3">
            {t(selectedName.en, selectedName.ur)}
          </div>
          <button
            onClick={() => playName(selectedName.n - 1, selectedName.ar)}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm active:scale-95 transition-all"
          >
            {playingIdx === selectedName.n - 1
              ? <><Loader2 size={16} className="animate-spin" /> {t('Playing...', 'چل رہا ہے...')}</>
              : <><Volume2 size={16} /> {t('Hear Name', 'نام سنو')}</>}
          </button>
        </div>
      )}

      {/* 99 Names Grid */}
      <div className="grid grid-cols-3 gap-2">
        {NAMES.map((name, idx) => {
          const color = CARD_COLORS[idx % CARD_COLORS.length];
          const isPlaying = playingIdx === idx;
          const isSelected = selected === idx;

          return (
            <button
              key={name.n}
              onClick={() => {
                setSelected(isSelected ? null : idx);
                playName(idx, name.ar);
              }}
              className={`relative p-3 rounded-xl border-2 bg-gradient-to-br ${color} ${
                isSelected ? 'ring-2 ring-primary scale-[1.03]' : 'hover:scale-[1.02]'
              } active:scale-95 transition-all text-left shadow-sm`}
            >
              {/* Number badge */}
              <span className="absolute top-1 right-1 text-[10px] font-bold bg-white/40 dark:bg-black/30 rounded-full w-5 h-5 flex items-center justify-center">
                {name.n}
              </span>

              {/* Arabic name */}
              <div className="text-sm font-bold mb-1 text-right leading-tight" style={{ fontFamily: 'Noto Naskh Arabic, serif', direction: 'rtl', fontSize: '0.95rem' }}>
                {name.ar}
              </div>

              {/* Transliteration */}
              <div className="text-[10px] font-semibold opacity-80 truncate">{name.tr}</div>

              {/* Playing indicator */}
              {isPlaying && (
                <div className="absolute bottom-1 left-1">
                  <Volume2 size={10} className="animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-5 pb-4">
        {t('SubhanAllah — learn one name every day! 🌟', 'سبحان اللہ — ہر روز ایک نام سیکھو! 🌟')}
      </p>
    </div>
  );
}
