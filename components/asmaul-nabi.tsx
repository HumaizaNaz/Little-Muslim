'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Volume2, Loader2 } from 'lucide-react';
import { useT } from '@/lib/language-context';
import { type Stoppable } from '@/lib/audio-utils';

interface AsmaulNabiProps {
  onBack: () => void;
}

const NAMES = [
  { n: 1,  ar: 'مُحَمَّد',               tr: 'Muhammad',           en: 'The Praised One',               ur: 'تعریف کیا گیا' },
  { n: 2,  ar: 'أَحْمَد',                tr: 'Ahmad',              en: 'The Most Praiseworthy',          ur: 'سب سے زیادہ قابل تعریف' },
  { n: 3,  ar: 'الْمُصْطَفَى',           tr: 'Al-Mustafa',         en: 'The Chosen One',                 ur: 'چنا ہوا' },
  { n: 4,  ar: 'الْمُجْتَبَى',           tr: 'Al-Mujtaba',         en: 'The Selected One',               ur: 'منتخب کردہ' },
  { n: 5,  ar: 'الْمُخْتَار',            tr: 'Al-Mukhtar',         en: 'The Chosen',                     ur: 'برگزیدہ' },
  { n: 6,  ar: 'حَبِيبُ اللّٰه',         tr: 'Habibullah',         en: 'Beloved of Allah',               ur: 'اللہ کے محبوب' },
  { n: 7,  ar: 'خَاتَمُ الْأَنْبِيَاء',  tr: 'Khatam ul-Anbiya',  en: 'Seal of the Prophets',           ur: 'آخری نبی' },
  { n: 8,  ar: 'رَحْمَةٌ لِّلْعَالَمِين', tr: 'Rahmatullil-Alamin', en: 'Mercy to the Worlds',           ur: 'تمام جہانوں کے لیے رحمت' },
  { n: 9,  ar: 'الْبَشِير',              tr: 'Al-Bashir',          en: 'The Bringer of Good News',       ur: 'خوشخبری دینے والے' },
  { n: 10, ar: 'النَّذِير',              tr: 'An-Nadhir',          en: 'The Warner',                     ur: 'ڈرانے والے' },
  { n: 11, ar: 'السِّرَاجُ الْمُنِير',   tr: 'As-Siraj ul-Munir',  en: 'The Illuminating Lamp',          ur: 'روشن چراغ' },
  { n: 12, ar: 'النُّور',               tr: 'An-Nur',             en: 'The Light',                      ur: 'نور' },
  { n: 13, ar: 'الْأَمِين',              tr: 'Al-Amin',            en: 'The Trustworthy',                ur: 'امانتدار' },
  { n: 14, ar: 'الصَّادِق',             tr: 'As-Sadiq',           en: 'The Truthful',                   ur: 'سچے' },
  { n: 15, ar: 'الشَّاهِد',             tr: 'Ash-Shahid',         en: 'The Witness',                    ur: 'گواہ' },
  { n: 16, ar: 'الشَّفِيع',             tr: "Ash-Shafi'",         en: 'The Intercessor',                ur: 'سفارشی' },
  { n: 17, ar: 'الْهَادِي',             tr: 'Al-Hadi',            en: 'The Guide',                      ur: 'راہنما' },
  { n: 18, ar: 'الدَّاعِي',             tr: "Ad-Da'i",            en: 'The Caller to Allah',            ur: 'اللہ کی طرف بلانے والے' },
  { n: 19, ar: 'الْمُبَشِّر',            tr: 'Al-Mubashshir',      en: 'The Bringer of Glad Tidings',    ur: 'بشارت دینے والے' },
  { n: 20, ar: 'الرَّءُوف',             tr: "Ar-Ra'uf",           en: 'The Compassionate',              ur: 'شفقت کرنے والے' },
  { n: 21, ar: 'الرَّحِيم',             tr: 'Ar-Rahim',           en: 'The Merciful',                   ur: 'رحم کرنے والے' },
  { n: 22, ar: 'الْكَرِيم',             tr: 'Al-Karim',           en: 'The Generous',                   ur: 'سخی' },
  { n: 23, ar: 'الْحَلِيم',             tr: 'Al-Halim',           en: 'The Forbearing',                 ur: 'بردبار' },
  { n: 24, ar: 'الصَّابِر',             tr: 'As-Sabir',           en: 'The Patient',                    ur: 'صابر' },
  { n: 25, ar: 'الشَّكُور',             tr: 'Ash-Shakur',         en: 'The Grateful',                   ur: 'شکرگزار' },
  { n: 26, ar: 'الطَّاهِر',             tr: 'At-Tahir',           en: 'The Pure',                       ur: 'پاک' },
  { n: 27, ar: 'الطَّيِّب',             tr: 'At-Tayyib',          en: 'The Good',                       ur: 'پاکیزہ' },
  { n: 28, ar: 'الْمُطَهَّر',           tr: 'Al-Mutahhar',        en: 'The Purified',                   ur: 'پاک کیا گیا' },
  { n: 29, ar: 'عَبْدُاللّٰه',           tr: 'Abdullah',           en: 'Servant of Allah',               ur: 'اللہ کے بندے' },
  { n: 30, ar: 'رَسُولُاللّٰه',          tr: 'Rasulullah',         en: 'Messenger of Allah',             ur: 'اللہ کے رسول' },
  { n: 31, ar: 'نَبِيُّ اللّٰه',         tr: "Nabi'ullah",         en: 'Prophet of Allah',               ur: 'اللہ کے نبی' },
  { n: 32, ar: 'نَبِيُّ الرَّحْمَة',    tr: 'Nabi ur-Rahma',      en: 'Prophet of Mercy',               ur: 'رحمت کے نبی' },
  { n: 33, ar: 'نَبِيُّ التَّوْبَة',    tr: 'Nabi ut-Tawba',      en: 'Prophet of Repentance',          ur: 'توبہ کے نبی' },
  { n: 34, ar: 'الْمُتَوَكِّل',         tr: 'Al-Mutawakkil',      en: 'The One Who Relies on Allah',    ur: 'اللہ پر توکل کرنے والے' },
  { n: 35, ar: 'الْمَاحِي',             tr: 'Al-Mahi',            en: 'The Eraser of Disbelief',        ur: 'کفر مٹانے والے' },
  { n: 36, ar: 'الْحَاشِر',             tr: 'Al-Hashir',          en: 'The Gatherer',                   ur: 'جمع کرنے والے' },
  { n: 37, ar: 'الْعَاقِب',             tr: "Al-'Aqib",           en: 'The Last Prophet',               ur: 'آخری نبی' },
  { n: 38, ar: 'الْمُقَفَّى',           tr: 'Al-Muqaffa',         en: 'The Follower of Prophets',       ur: 'پچھلے نبیوں کے پیروکار' },
  { n: 39, ar: 'سَيِّدُ الْمُرْسَلِين', tr: 'Sayyid ul-Mursalin', en: 'Master of the Messengers',       ur: 'تمام رسولوں کے سردار' },
  { n: 40, ar: 'إِمَامُ الْمُتَّقِين',  tr: 'Imam ul-Muttaqin',   en: 'Leader of the Pious',            ur: 'متقین کے امام' },
  { n: 41, ar: 'الْمُبَارَك',           tr: 'Al-Mubarak',         en: 'The Blessed',                    ur: 'بابرکت' },
  { n: 42, ar: 'الْكَامِل',             tr: 'Al-Kamil',           en: 'The Perfect',                    ur: 'کامل' },
  { n: 43, ar: 'الْأَكْمَل',            tr: 'Al-Akmal',           en: 'The Most Perfect',               ur: 'سب سے کامل' },
  { n: 44, ar: 'الْمُعَلِّم',           tr: "Al-Mu'allim",        en: 'The Teacher',                    ur: 'استاد' },
  { n: 45, ar: 'الْمُزَكِّي',           tr: 'Al-Muzakki',         en: 'The Purifier of Souls',          ur: 'روحوں کو پاک کرنے والے' },
  { n: 46, ar: 'السَّيِّد',              tr: 'As-Sayyid',          en: 'The Master',                     ur: 'سردار' },
  { n: 47, ar: 'الْجَوَاد',             tr: 'Al-Jawad',           en: 'The Generous',                   ur: 'فیاض' },
  { n: 48, ar: 'الشُّجَاع',             tr: "Ash-Shuja'",         en: 'The Brave',                      ur: 'بہادر' },
  { n: 49, ar: 'الْوَدُود',             tr: 'Al-Wadud',           en: 'The Loving',                     ur: 'محبت کرنے والے' },
  { n: 50, ar: 'الرَّشِيد',             tr: 'Ar-Rashid',          en: 'The Rightly Guided',             ur: 'سیدھی راہ پر چلنے والے' },
  { n: 51, ar: 'الصَّالِح',             tr: 'As-Salih',           en: 'The Righteous',                  ur: 'نیک' },
  { n: 52, ar: 'الْوَفِيّ',             tr: 'Al-Wafi',            en: 'The Loyal',                      ur: 'وفادار' },
  { n: 53, ar: 'الْحَافِظ',             tr: 'Al-Hafiz',           en: 'The Protector',                  ur: 'حفاظت کرنے والے' },
  { n: 54, ar: 'فَاتِح',               tr: 'Al-Fatih',           en: 'The Opener/Victor',              ur: 'فاتح' },
  { n: 55, ar: 'الصِّرَاطُ الْمُسْتَقِيم', tr: 'As-Sirat ul-Mustaqim', en: 'The Straight Path',       ur: 'سیدھا راستہ' },
  { n: 56, ar: 'الْمُرْشِد',            tr: 'Al-Murshid',         en: 'The Director/Guide',             ur: 'راہنما' },
  { n: 57, ar: 'الْخَاتَم',             tr: 'Al-Khatam',          en: 'The Seal',                       ur: 'مہر' },
  { n: 58, ar: 'الْبَدْر',              tr: 'Al-Badr',            en: 'The Full Moon',                  ur: 'چودھویں کا چاند' },
  { n: 59, ar: 'الشَّمْس',              tr: 'Ash-Shams',          en: 'The Sun',                        ur: 'سورج' },
  { n: 60, ar: 'الْمُضِيء',             tr: 'Al-Mudi',            en: 'The Bright One',                 ur: 'روشن' },
  { n: 61, ar: 'الْمَحْمُود',           tr: 'Al-Mahmud',          en: 'The Praiseworthy',               ur: 'قابل تعریف' },
  { n: 62, ar: 'الْحَامِد',             tr: 'Al-Hamid',           en: 'The One Who Praises Allah',      ur: 'اللہ کی تعریف کرنے والے' },
  { n: 63, ar: 'الْعَزِيز',             tr: "Al-'Aziz",           en: 'The Mighty',                     ur: 'عزت والے' },
  { n: 64, ar: 'الْحَكِيم',             tr: 'Al-Hakim',           en: 'The Wise',                       ur: 'حکمت والے' },
  { n: 65, ar: 'صَفِيُّ اللّٰه',        tr: 'Safiyullah',         en: 'The Pure Chosen of Allah',       ur: 'اللہ کے پاک چنیدہ' },
  { n: 66, ar: 'أَبُو الْقَاسِم',       tr: "Abu'l-Qasim",        en: 'Father of Qasim',                ur: 'قاسم کے والد (کنیت)' },
  { n: 67, ar: 'الْمُنِير',             tr: 'Al-Munir',           en: 'The Luminous',                   ur: 'چمکنے والے' },
  { n: 68, ar: 'الْقَرِيب',             tr: 'Al-Qarib',           en: 'The Near One',                   ur: 'قریب' },
  { n: 69, ar: 'الشَّهِيد',             tr: 'Ash-Shahid',         en: 'The Witness',                    ur: 'گواہ' },
  { n: 70, ar: 'طٰه',                  tr: 'Taha',               en: 'Quranic Name (Surah Taha)',       ur: 'قرآنی نام' },
  { n: 71, ar: 'يٰس',                  tr: 'Yasin',              en: 'Quranic Name (Surah Yasin)',      ur: 'قرآنی نام' },
  { n: 72, ar: 'الْمُمَيَّز',           tr: 'Al-Mumayyaz',        en: 'The Distinguished',              ur: 'ممتاز' },
  { n: 73, ar: 'الشَّرِيف',             tr: 'Ash-Sharif',         en: 'The Noble',                      ur: 'شریف' },
  { n: 74, ar: 'الْمُكَرَّم',           tr: 'Al-Mukarram',        en: 'The Honored',                    ur: 'معزز' },
  { n: 75, ar: 'الْمُعَظَّم',           tr: "Al-Mu'azzam",        en: 'The Exalted',                    ur: 'بلند مرتبہ' },
  { n: 76, ar: 'الْمَرْحُوم',           tr: 'Al-Marhum',          en: 'The Recipient of Mercy',         ur: 'رحمت پانے والے' },
  { n: 77, ar: 'الْوَسِيلَة',           tr: 'Al-Wasila',          en: 'The Means to Allah',             ur: 'اللہ تک وسیلہ' },
  { n: 78, ar: 'الذِّكْر',              tr: 'Adh-Dhikr',          en: 'The Reminder',                   ur: 'یاددہانی کرانے والے' },
  { n: 79, ar: 'الْمُبِين',             tr: 'Al-Mubin',           en: 'The Clear',                      ur: 'واضح' },
  { n: 80, ar: 'الدَّلِيل',             tr: 'Ad-Dalil',           en: 'The Proof',                      ur: 'دلیل' },
  { n: 81, ar: 'الْحَقّ',               tr: 'Al-Haqq',            en: 'The True One',                   ur: 'سچے' },
  { n: 82, ar: 'الْبُرْهَان',           tr: 'Al-Burhan',          en: 'The Proof/Evidence',             ur: 'واضح دلیل' },
  { n: 83, ar: 'الصِّدِّيق',            tr: 'As-Siddiq',          en: 'The Truthful',                   ur: 'سچے' },
  { n: 84, ar: 'الْمَصُون',             tr: 'Al-Masun',           en: 'The Protected',                  ur: 'محفوظ' },
  { n: 85, ar: 'الْمُؤَيَّد',           tr: "Al-Mu'ayyad",        en: 'The Supported by Allah',         ur: 'اللہ کی مدد سے تقویت پانے والے' },
  { n: 86, ar: 'الشَّافِع',             tr: "Ash-Shafi'",         en: 'The Intercessor on Judgement Day', ur: 'قیامت کے دن شفاعت کرنے والے' },
  { n: 87, ar: 'الْمَشْفُوع',           tr: 'Al-Mashfu',          en: 'The Granted Intercession',       ur: 'جن کی شفاعت قبول ہو گی' },
  { n: 88, ar: 'الْعَادِل',             tr: "Al-'Adil",           en: 'The Just',                       ur: 'انصاف والے' },
  { n: 89, ar: 'الرَّفِيع',             tr: 'Ar-Rafi',            en: 'The Elevated',                   ur: 'بلند مرتبہ' },
  { n: 90, ar: 'الْقَائِد',             tr: "Al-Qa'id",           en: 'The Leader',                     ur: 'لیڈر' },
  { n: 91, ar: 'الْأَمِير',             tr: "Al-Amir",            en: 'The Commander',                  ur: 'امیر' },
  { n: 92, ar: 'ذُو الْخُلُقِ الْعَظِيم', tr: "Dhul-Khuluqil-'Azim", en: 'Of Great Character',        ur: 'عظیم اخلاق والے' },
  { n: 93, ar: 'الشُّكُور',             tr: 'Ash-Shakur',         en: 'The Grateful to Allah',          ur: 'اللہ کا شکر ادا کرنے والے' },
  { n: 94, ar: 'الْمَوْلَى',            tr: 'Al-Mawla',           en: 'The Patron',                     ur: 'سرپرست' },
  { n: 95, ar: 'الصَّبُور',             tr: 'As-Sabur',           en: 'The Patient',                    ur: 'صبر والے' },
  { n: 96, ar: 'الْجَامِع',             tr: "Al-Jami'",           en: 'The Gatherer of All Good',       ur: 'تمام خوبیوں کے جامع' },
  { n: 97, ar: 'الْمُنَبِّه',           tr: 'Al-Munabbih',        en: 'The One Who Awakens',            ur: 'بیدار کرنے والے' },
  { n: 98, ar: 'الْمُصْلِح',            tr: 'Al-Muslih',          en: 'The Reformer',                   ur: 'اصلاح کرنے والے' },
  { n: 99, ar: 'نِعْمَةُ اللّٰه',       tr: "Ni'matullah",        en: 'The Blessing of Allah',          ur: 'اللہ کی نعمت' },
];

const CARD_COLORS = [
  'from-green-400/30 to-green-600/20 border-green-400/50 text-green-700 dark:text-green-300',
  'from-emerald-400/30 to-teal-600/20 border-emerald-400/50 text-emerald-700 dark:text-emerald-300',
  'from-amber-400/30 to-yellow-600/20 border-amber-400/50 text-amber-700 dark:text-amber-300',
  'from-lime-400/30 to-green-600/20 border-lime-400/50 text-lime-700 dark:text-lime-300',
  'from-teal-400/30 to-cyan-600/20 border-teal-400/50 text-teal-700 dark:text-teal-300',
  'from-yellow-400/30 to-amber-600/20 border-yellow-400/50 text-yellow-700 dark:text-yellow-300',
  'from-green-500/30 to-emerald-600/20 border-green-500/50 text-green-800 dark:text-green-200',
];

export default function AsmaulNabi({ onBack }: AsmaulNabiProps) {
  const t = useT();
  const [selected, setSelected] = useState<number | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const currentAudio = useRef<Stoppable | null>(null);

  const playName = (idx: number, arabicName: string) => {
    currentAudio.current?.pause();
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();

    if (playingIdx === idx) {
      setPlayingIdx(null);
      return;
    }

    setPlayingIdx(idx);

    const url = `/api/tts?text=${encodeURIComponent(arabicName)}`;
    const audio = new Audio(url);
    currentAudio.current = { pause: () => audio.pause() };

    audio.onended = () => setPlayingIdx(null);
    audio.onerror = () => {
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
        {/* Green Islamic banner */}
        <div className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-1 rounded-full text-xs font-bold mb-2 tracking-wide">
          ﷺ  صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّم
        </div>
        <h1 className="text-2xl font-extrabold text-green-700 dark:text-green-400 mb-1">
          💚 {t('99 Names of Prophet Muhammad ﷺ', 'حضرت محمد ﷺ کے ۹۹ نام')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('Tap any name to hear it — learn and love the Prophet ﷺ!', 'کسی بھی نام پر کلک کرو — نبی ﷺ سے محبت بڑھاؤ!')}
        </p>
      </div>

      {/* Selected name popup */}
      {selectedName && (
        <div className="mb-5 p-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-400/10 border-2 border-green-400/40 text-center shadow-lg">
          <div className="text-4xl font-bold mb-2 text-green-700 dark:text-green-300" style={{ fontFamily: 'Noto Naskh Arabic, serif', direction: 'rtl' }}>
            {selectedName.ar}
          </div>
          <div className="text-lg font-bold text-foreground mb-1">{selectedName.tr}</div>
          <div className="text-base text-muted-foreground mb-3">
            {t(selectedName.en, selectedName.ur)}
          </div>
          <button
            onClick={() => playName(selectedName.n - 1, selectedName.ar)}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-bold text-sm active:scale-95 transition-all"
          >
            {playingIdx === selectedName.n - 1
              ? <><Loader2 size={16} className="animate-spin" /> {t('Playing...', 'چل رہا ہے...')}</>
              : <><Volume2 size={16} /> {t('Hear Name', 'نام سنو')}</>}
          </button>
        </div>
      )}

      {/* Names Grid */}
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
                isSelected ? 'ring-2 ring-green-500 scale-[1.03]' : 'hover:scale-[1.02]'
              } active:scale-95 transition-all text-left shadow-sm`}
            >
              <span className="absolute top-1 right-1 text-[10px] font-bold bg-white/40 dark:bg-black/30 rounded-full w-5 h-5 flex items-center justify-center">
                {name.n}
              </span>

              <div className="text-sm font-bold mb-1 text-right leading-tight" style={{ fontFamily: 'Noto Naskh Arabic, serif', direction: 'rtl', fontSize: '0.9rem' }}>
                {name.ar}
              </div>

              <div className="text-[10px] font-semibold opacity-80 truncate">{name.tr}</div>

              {isPlaying && (
                <div className="absolute bottom-1 left-1">
                  <Volume2 size={10} className="animate-pulse text-green-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-5 pb-4">
        {t('Allahumma salli ala Muhammad wa ala aali Muhammad 💚', 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ 💚')}
      </p>
    </div>
  );
}
