'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, Loader2 } from 'lucide-react';
import Confetti from '@/components/confetti';
import { playArabicViaAPI, speakTransliteration, stopAudio, playStarSound } from '@/lib/audio-utils';
import { useT } from '@/lib/language-context';

interface DuasGameProps {
  onBack: () => void;
}

const DUAS_CATEGORIES = [
  {
    name: 'Sehri (Before Dawn)',
    emoji: '🌙',
    duas: [
      {
        arabic: 'نويت الصوم من فجر اليوم إلى غروب الشمس لله تعالى',
        transliteration: 'Nawaitu assawma min fajri haadhaa alyawmi ilaa ghurubi ashshamsi lillahi ta\'ala',
        translation: 'I intend to fast from dawn to sunset for Allah',
        dua: 'Fasting Intention'
      },
      {
        arabic: 'اللهم إني أسألك برحمتك أن تغفر لي',
        transliteration: 'Allahumma inni as\'aluka birahmatika an taghfira li',
        translation: 'O Allah, I ask You by Your mercy to forgive me',
        dua: 'For Forgiveness'
      },
      {
        arabic: 'سبحانك اللهم وبحمدك، اللهم اغفر لي',
        transliteration: 'Subhanak Allahumma wa bihamdik, Allahumma ighfir li',
        translation: 'Glory be to You O Allah, and praise be to You. O Allah, forgive me',
        dua: 'Glory & Forgiveness'
      },
      {
        arabic: 'اللهم بك أصبحنا وبك أمسينا، وبك نحيا وبك نموت، وإليك النشور',
        transliteration: 'Allahumma bika asbahna wa bika amsina, wa bika nahya wa bika namutu, wa ilaikal-nushur',
        translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and die, and to You is the return',
        dua: 'Morning Dua'
      },
      {
        arabic: 'اللهم أنت رب السماوات والأرض، وخالق كل شيء',
        transliteration: 'Allahumma anta Rabbus samawati wal ardi wa khaliq kulli shay\'in',
        translation: 'O Allah, You are the Lord of the heavens and earth, and Creator of all things',
        dua: 'Lord of All'
      },
      {
        arabic: 'استغفر الله من كل ذنب، واتوب إليه',
        transliteration: 'Astaghfirullaha min kulli dhanb, wa atoobu ilayh',
        translation: 'I seek forgiveness from Allah for every sin and repent to Him',
        dua: 'Repentance'
      }
    ]
  },
  {
    name: 'Iftar (After Sunset)',
    emoji: '🌅',
    duas: [
      {
        arabic: 'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله',
        transliteration: 'Dhahaba alththama\' waibtallat al\'uruqu wa thabbata al\'ajru in sha\'a Allah',
        translation: 'Thirst has gone and the veins are moistened, and the reward is confirmed, if Allah wills',
        dua: 'Breaking Fast'
      },
      {
        arabic: 'اللهم لك صمت وعلى رزقك أفطرت',
        transliteration: 'Allahumma laka sumtu wa \'ala rizqika aftartu',
        translation: 'O Allah, for You I have fasted and broken my fast with Your provision',
        dua: 'Fasting Gratitude'
      },
      {
        arabic: 'اللهم إني أسألك من فضلك ورحمتك',
        transliteration: 'Allahumma inni as\'aluka min fadlika wa rahmatika',
        translation: 'O Allah, I ask You from Your favor and mercy',
        dua: 'Asking Favor'
      },
      {
        arabic: 'اللهم تقبل منا الصيام والقيام',
        transliteration: 'Allahumma taqabbal minna assiyama wal qiyam',
        translation: 'O Allah, accept from us the fasting and the standing in prayer',
        dua: 'Acceptance'
      },
      {
        arabic: 'اللهم إن هذا شهر الرحمة والمغفرة',
        transliteration: 'Allahumma inna hadha shahru rahmatikal wamaghfiratikal',
        translation: 'O Allah, this is the month of Your mercy and forgiveness',
        dua: 'Ramadan Blessing'
      },
      {
        arabic: 'شهر رمضان الذي أنزل فيه القرآن',
        transliteration: 'Shahru Ramadana alladi unzila fihi al-Quran',
        translation: 'The month of Ramadan in which the Quran was revealed',
        dua: 'Quran Revelation'
      }
    ]
  },
  {
    name: 'Prayer (Salah)',
    emoji: '🕌',
    duas: [
      {
        arabic: 'سبحان الله وبحمده، سبحان الله العظيم',
        transliteration: 'Subhana Allahi wa bihamdihi, Subhana Allahill adheem',
        translation: 'Glory be to Allah and His praise, Glory be to Allah the Most Great',
        dua: 'During Ruku'
      },
      {
        arabic: 'سمع الله لمن حمده، ربنا ولك الحمد',
        transliteration: 'Samia Allahu liman hamidah, Rabbana wa laka al-hamad',
        translation: 'Allah hears those who praise Him, Our Lord, to You belongs all praise',
        dua: 'After Ruku'
      },
      {
        arabic: 'سبحان ربي الأعلى، سبحان ربي الأعلى',
        transliteration: 'Subhana Rabbi al-Ala, Subhana Rabbi al-Ala',
        translation: 'Glory be to my Lord the Most High, Glory be to my Lord the Most High',
        dua: 'During Sujud'
      },
      {
        arabic: 'اللهم اغفر لي وارحمني واهدني',
        transliteration: 'Allahumma ighfir li wa arhamni wa ahdini',
        translation: 'O Allah, forgive me, have mercy on me, and guide me',
        dua: 'During Tashahhud'
      },
      {
        arabic: 'التحيات لله والصلوات والطيبات',
        transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat',
        translation: 'All compliments, prayers and good words are for Allah',
        dua: 'Tashahhud'
      },
      {
        arabic: 'اللهم صل على محمد وعلى آل محمد',
        transliteration: 'Allahumma salli ala Muhammad wa ala ali Muhammad',
        translation: 'O Allah, send blessings upon Muhammad and the family of Muhammad',
        dua: 'Blessing the Prophet'
      }
    ]
  },
  {
    name: 'Sleeping',
    emoji: '😴',
    duas: [
      {
        arabic: 'اللهم باسمك أموت وأحيا',
        transliteration: 'Allahumma biismika amutu wa ahya',
        translation: 'O Allah, by Your name I die and live',
        dua: 'Sleep Dua'
      },
      {
        arabic: 'اللهم قني عذابك يوم تبعث عبادك',
        transliteration: 'Allahumma qini adhaba ka yawma tab\'ath ibadaka',
        translation: 'O Allah, protect me from Your punishment on the day You resurrect Your servants',
        dua: 'Protection at Sleep'
      },
      {
        arabic: 'الحمد لله الذي أطعمنا وسقانا',
        transliteration: 'Al-hamdu lillahi alladi at\'amana wa saqana',
        translation: 'All praise be to Allah who fed us and gave us drink',
        dua: 'Gratitude for Food'
      }
    ]
  },
  {
    name: 'Leaving Home & Entering',
    emoji: '🏠',
    duas: [
      {
        arabic: 'بسم الله توكلت على الله لا حول ولا قوة إلا بالله',
        transliteration: 'Bismillah, tawakkaltu \'ala Allah, la hawla wa la quwwata illa billah',
        translation: 'In the name of Allah, I rely on Allah. There is no might or power except in Allah',
        dua: 'Leaving Home'
      },
      {
        arabic: 'بسم الله الرحمن الرحيم',
        transliteration: 'Bismillahi ar-Rahmani ar-Rahim',
        translation: 'In the name of Allah, the Most Merciful, the Merciful',
        dua: 'Entering Home'
      },
      {
        arabic: 'اللهم إني أعوذ بك من شر ما فيها',
        transliteration: 'Allahumma inni a\'udhu bika min sharri ma feeha',
        translation: 'O Allah, I seek refuge in You from the evil within it',
        dua: 'Protection at Home'
      },
      {
        arabic: 'الحمد لله على كل حال',
        transliteration: 'Al-hamdu lillahi ala kulli hal',
        translation: 'All praise be to Allah in every condition',
        dua: 'Gratitude Always'
      }
    ]
  },
  {
    name: 'Daily Life',
    emoji: '✨',
    duas: [
      {
        arabic: 'اللهم إني أسألك العفو والعافية في الدنيا والآخرة',
        transliteration: 'Allahumma inni as\'aluka al-\'afwa wa al-\'aafiya fil dunya wa al-akhira',
        translation: 'O Allah, I ask You for pardon and well-being in this life and the next',
        dua: 'Health & Well-being'
      },
      {
        arabic: 'يا الله، يا قدير، يا عزيز',
        transliteration: 'Ya Allah, Ya Qadeer, Ya Aziz',
        translation: 'O Allah, O Mighty, O Powerful',
        dua: 'Power of Allah'
      },
      {
        arabic: 'اللهم آمين، اللهم آمين',
        transliteration: 'Allahumma Ameen, Allahumma Ameen',
        translation: 'O Allah, grant my supplication, O Allah, grant my supplication',
        dua: 'Amen - Grant My Prayer'
      },
      {
        arabic: 'الحمد لله على كل نعمة',
        transliteration: 'Al-hamdu lillahi ala kulli ni\'ma',
        translation: 'All praise be to Allah for every blessing',
        dua: 'Gratitude for Blessings'
      },
      {
        arabic: 'اللهم اجعل لي من أمري يسراً',
        transliteration: 'Allahumma ij\'al li min amri yusra',
        translation: 'O Allah, make my affairs easy for me',
        dua: 'Ease in Affairs'
      },
      {
        arabic: 'اللهم إني أسألك حسن الخلق',
        transliteration: 'Allahumma inni as\'aluka husna al-khulaq',
        translation: 'O Allah, I ask You for good character',
        dua: 'Good Character'
      },
      {
        arabic: 'رب اغفر لي وارحمني',
        transliteration: 'Rabbi ighfir li wa arhamni',
        translation: 'My Lord, forgive me and have mercy on me',
        dua: 'Mercy & Forgiveness'
      },
      {
        arabic: 'سبحان الله وبحمده سبحان الله العظيم',
        transliteration: 'Subhana Allahi wa bihamdihi Subhana Allahill adheem',
        translation: 'Glory be to Allah and His praise, Glory be to Allah the Most Great',
        dua: 'Glorification'
      }
    ]
  }
];

export default function DuasGame({ onBack }: DuasGameProps) {
  const t = useT();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDua, setSelectedDua] = useState<number | null>(null);
  const [learned, setLearned] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing' | 'no-voice'>('idle');
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedLearned = localStorage.getItem('learned-duas');
    if (savedLearned) {
      try { setLearned(JSON.parse(savedLearned)); } catch {}
    }
  }, []);

  // Stop audio when leaving dua detail screen
  useEffect(() => {
    return () => {
      currentAudio.current?.pause();
      stopAudio();
    };
  }, [selectedDua]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedDua, selectedCategory]);

  const handleLearnDua = (duaTitle: string) => {
    if (!learned.includes(duaTitle)) {
      const newLearned = [...learned, duaTitle];
      setLearned(newLearned);
      localStorage.setItem('learned-duas', JSON.stringify(newLearned));
      const savedStars = parseInt(localStorage.getItem('stars') || '0');
      localStorage.setItem('stars', String(savedStars + 2));
      playStarSound();
    }
  };

  if (selectedCategory !== null && selectedDua !== null) {
    const dua = DUAS_CATEGORIES[selectedCategory].duas[selectedDua];
    const isLearned = learned.includes(dua.dua);

    return (
      <div className="min-h-screen flex flex-col px-4 py-6">
        <Confetti active={showConfetti} />
        
        <button
          onClick={() => setSelectedDua(null)}
          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all"
        >
          <ArrowLeft size={24} />
          <span>{t('Back', 'واپس')}</span>
        </button>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md p-8 text-center border-2 border-chart-3/30 bg-card/50 backdrop-blur animate-slide-in">
            <div className="text-6xl mb-6">🤲</div>

            <h2 className="text-2xl font-bold text-primary mb-6">{dua.dua}</h2>

            {/* Arabic Text */}
            <div className="bg-primary/10 rounded-lg p-4 mb-6 border-2 border-primary/30">
              <p className="arabic-text text-primary mb-2">{dua.arabic}</p>
              <p className="text-xs text-muted-foreground">(Arabic)</p>
            </div>

            {/* Transliteration */}
            <div className="bg-accent/10 rounded-lg p-4 mb-6 border-2 border-accent/30">
              <p className="transliteration text-foreground italic mb-2">{dua.transliteration}</p>
              <p className="text-xs text-muted-foreground">(Transliteration)</p>
            </div>

            {/* Translation */}
            <div className="bg-secondary/10 rounded-lg p-4 mb-8 border-2 border-secondary/30">
              <p className="text-sm text-foreground mb-2">{dua.translation}</p>
              <p className="text-xs text-muted-foreground">(English)</p>
            </div>

            {/* Audio Button */}
            <button
              onClick={() => {
                if (audioStatus === 'loading' || audioStatus === 'playing') return;
                currentAudio.current?.pause();
                setAudioStatus('loading');
                currentAudio.current = playArabicViaAPI(
                  dua.arabic,
                  () => setAudioStatus('playing'),
                  () => setAudioStatus('idle'),
                  () => {
                    setAudioStatus('no-voice');
                    speakTransliteration(dua.transliteration);
                    setTimeout(() => setAudioStatus('idle'), 4000);
                  }
                );
                if (!currentAudio.current) {
                  setAudioStatus('no-voice');
                  speakTransliteration(dua.transliteration);
                }
              }}
              className="w-full mb-2 py-4 bg-chart-3/20 hover:bg-chart-3/30 border-2 border-chart-3 rounded-lg transition-all flex items-center justify-center gap-2 text-chart-3 font-semibold"
            >
              {audioStatus === 'loading'
                ? <><Loader2 size={20} className="animate-spin" /> Loading...</>
                : audioStatus === 'playing'
                ? <><Volume2 size={20} /> {t('Playing Arabic...', 'چل رہی ہے...')}</>
                : <><Volume2 size={20} /> {t('Hear the Dua (Arabic)', 'دعا سنو (عربی)')}</>}
            </button>

            {audioStatus === 'no-voice' && (
              <p className="text-xs text-center text-muted-foreground mb-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 rounded px-3 py-2">
                ⚠️ Arabic voice aapke device pe install nahi — Roman mein sun rahe hain.<br />
                <span className="text-xs">Windows: Settings → Time &amp; Language → Arabic language pack install karo</span>
              </p>
            )}

            {/* Learned Status */}
            <div className="mb-8">
              {isLearned ? (
                <div className="bg-primary/20 border-2 border-primary rounded-lg p-4 animate-pulse-grow">
                  <p className="text-primary font-bold mb-2">✓ {t('Learned!', 'یاد ہو گئی!')}</p>
                  <div className="text-4xl animate-pulse">⭐</div>
                  <p className="text-sm text-primary/70 mt-2">+2 Stars</p>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    handleLearnDua(dua.dua);
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 2000);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 font-bold text-lg"
                >
                  {t('Mark as Learned 📝', 'یاد ہو گئی 📝')}
                </Button>
              )}
            </div>

            <Button
              onClick={() => setSelectedDua(null)}
              variant="outline"
              className="w-full"
            >
              Next Dua
            </Button>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground py-4">
          <p>Remember these duas daily! They bring barakah (blessings) 💫</p>
        </div>
      </div>
    );
  }

  if (selectedCategory !== null) {
    const category = DUAS_CATEGORIES[selectedCategory];

    return (
      <div className="min-h-screen flex flex-col px-4 py-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all"
        >
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-primary mb-8">{category.name}</h1>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {category.duas.map((dua, idx) => (
            <Card
              key={idx}
              onClick={() => setSelectedDua(idx)}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 p-6 border-2 border-chart-3/20 hover:border-chart-3/50 bg-card/50 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-primary mb-2">{dua.dua}</h3>
                  <p className="text-sm text-muted-foreground">{dua.translation}</p>
                </div>
                <div className="text-3xl">
                  {learned.includes(dua.dua) ? '✓' : '→'}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={() => setSelectedCategory(null)}
          variant="outline"
          className="w-full"
        >
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all"
      >
        <ArrowLeft size={24} />
        <span>Back</span>
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold text-primary mb-2">{t('Duas Mini-Game', 'دعائیں سیکھو')}</h1>
      <p className="text-muted-foreground mb-8">{t('Learn beautiful prayers for everyday moments', 'ہر وقت کی خوبصورت دعائیں سیکھو')}</p>

      {/* Progress */}
      <Card className="w-full p-6 border-2 border-primary/20 bg-card/50 backdrop-blur mb-8">
        <p className="text-sm text-muted-foreground mb-2">Duas Learned</p>
        <div className="flex gap-1">
          {Array(Math.min(learned.length + 1, 10)).fill(0).map((_, i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-full ${
                i < learned.length ? 'bg-chart-3' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-right text-sm font-semibold text-chart-3 mt-2">{learned.length} learned</p>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {DUAS_CATEGORIES.map((category, idx) => (
          <Card
            key={idx}
            onClick={() => setSelectedCategory(idx)}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 p-6 border-2 border-chart-3/20 hover:border-chart-3/50 bg-card/50 backdrop-blur"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4">{category.emoji}</div>
              <h2 className="text-xl font-bold text-primary mb-2">{category.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{category.duas.length} duas to learn</p>
              <Button className="w-full bg-chart-3 hover:bg-chart-3/90 text-white">
                Start
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>Learn duas and earn stars! Duas are powerful gifts from Allah. 💫</p>
      </div>
    </div>
  );
}
