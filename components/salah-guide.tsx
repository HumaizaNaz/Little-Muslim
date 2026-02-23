'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, Loader2 } from 'lucide-react';
import { playScholarOrTTS, playStarSound } from '@/lib/audio-utils';
import { useT } from '@/lib/language-context';
import Emoji3D from '@/components/emoji3d';

interface SalahGuideProps {
  onBack: () => void;
}

const SALAH_STEPS = [
  {
    id: 1,
    name: 'Step 1: Takbeer-e-Tahrima',
    emoji: '🙌',
    arabic: 'الله أكبر',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest!',
    soundType: 'allahuakbar',
    instruction: 'Make intention of prayer. Raise hands to ears and say Takbir. This marks the beginning of Salah.'
  },
  {
    id: 2,
    name: 'Step 2a: Read Sana',
    emoji: '📖',
    arabic: 'سبحانك اللهم وبحمدك وتبارك اسمك وتعالى جدك ولا إله غيرك',
    transliteration: 'Subhana Kallahumma wa bihamdika watha-baara kasmuka watha\'aala jad-duka walaa ilaaha ghayruk',
    meaning: 'Glory be to you, O Allah, and all praises are due unto you, and blessed is your name and high is your majesty and none is worthy of worship but you',
    soundType: 'sana',
    instruction: 'Recite this glorification standing. Place right hand on left hand. Listen to hear the proper pronunciation.'
  },
  {
    id: 3,
    name: 'Step 2b: Ta\'awwudh & Tasmiyya',
    emoji: '🛡️',
    arabic: 'أعوذ بالله من الشيطان الرجيم، بسم الله الرحمن الرحيم',
    transliteration: 'A\'udhu bil-laahi minash Shaythaa-nir-rajeem. Bismillaah hir-Rahmaa nir-Raheem',
    meaning: 'I seek Allah\'s protection from Satan who is accursed. In the name of Allah, the most Kind and the most Merciful',
    soundType: 'taawwudh',
    instruction: 'Seek protection from Satan. Then recite Bismillah before Surah Fatiha.'
  },
  {
    id: 4,
    name: 'Step 2c: Recite Surah Al-Fatiha',
    emoji: '📚',
    arabic: 'الحمد لله رب العالمين الرحمن الرحيم مالك يوم الدين إياك نعبد وإياك نستعين اهدنا الصراط المستقيم صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين',
    transliteration: 'Alhamdul lil-laahi rab-bil aalameen, Ar rahmaa nir-raheem, Maaliki yawmid-deen, Iyyaa-ka na\'budu wa iyyaa-ka nasta\'een, Ihdinas siraatal mustaqeem, Siraatal Ladheena an\'amta alayhim, Ghay-ril maghdubi alayhim, Walad daal-leen. Ameen',
    meaning: 'All praise be to Allah, Lord of the Universe, Most Merciful, Master of the Day of Judgment. You alone we worship and to You alone we pray for help. Show us the straight way, the way of those whom you have blessed, who have not deserved your anger, nor gone astray. Amen',
    soundType: 'fatiha',
    instruction: 'Recite the opening chapter of the Quran (Surah Al-Fatiha) completely. This is obligatory in every Raka\'at. Click to hear the proper recitation.'
  },
  {
    id: 5,
    name: 'Step 2d: Read Surah Al-Ikhlas',
    emoji: '✨',
    arabic: 'قل هو الله أحد الله الصمد لم يلد ولم يولد ولم يكن له كفوا أحد',
    transliteration: 'Qul huwal laahu ahad. Allaah hus-Samad. Lam yalid walam yoolad. Walam yakul-lahu Kufuwan ahad',
    meaning: 'Say: He is Allah, the only one. Allah helps and does not need help. He does not produce a child, and He was not born of anyone. There is no one equal to Him',
    soundType: 'ikhlas',
    instruction: 'After Surah Al-Fatiha, recite Surah Al-Ikhlas or another short Surah. Listen to the proper recitation.'
  },
  {
    id: 6,
    name: 'Step 3: Perform Ruku (Bowing)',
    emoji: '🙇',
    arabic: 'سبحان ربي العظيم',
    transliteration: 'Subhaana Rabbi\'al Azeem',
    meaning: 'Glory to my Lord the Exalted',
    soundType: 'tasbih_ruku',
    instruction: 'Say Allahu Akbar before bowing. Bow with hands on knees, back straight. Say glorification 3-7 times while bowing.'
  },
  {
    id: 7,
    name: 'Step 4: Rise from Ruku',
    emoji: '⬆️',
    arabic: 'سمع الله لمن حمده، ربنا ولك الحمد',
    transliteration: 'Sami Allaahu Liman Hamidah, Rabbanaa lakal Hamd',
    meaning: 'Allah listens to him who praises Him. Oh our Lord, all praise is to you',
    soundType: 'tasmee',
    instruction: 'Rise up straight saying these words. Stand upright for a moment before going to Sujud.'
  },
  {
    id: 8,
    name: 'Step 5: Perform First Sujud (Prostration)',
    emoji: '🤲',
    arabic: 'سبحان ربي الأعلى',
    transliteration: 'Subhaana Rabbi yal A\'alaa',
    meaning: 'Glory to my Lord the Most High',
    soundType: 'tasbih_sujud',
    instruction: 'Say Allahu Akbar and prostrate. Forehead, nose, hands, knees, toes touch ground. Say glorification 3-7 times.'
  },
  {
    id: 9,
    name: 'Step 6: Sit Between Prostrations',
    emoji: '🪑',
    arabic: 'رب اغفر لي ورحمني',
    transliteration: 'Rabb ighfir li wa arhamni',
    meaning: 'My Lord, forgive me and have mercy on me',
    soundType: 'dua_sujud',
    instruction: 'Rise briefly to sitting position. You can make personal supplication. Say Allahu Akbar before second Sujud.'
  },
  {
    id: 10,
    name: 'Step 7: Perform Second Sujud (Prostration)',
    emoji: '🤲',
    arabic: 'سبحان ربي الأعلى',
    transliteration: 'Subhaana Rabbi yal A\'alaa',
    meaning: 'Glory to my Lord the Most High',
    soundType: 'tasbih_sujud',
    instruction: 'Prostrate again exactly like the first Sujud. Repeat glorification 3-7 times. One Raka\'at is now complete.'
  },
  {
    id: 11,
    name: 'Step 8: Tashahhud (Final Sitting)',
    emoji: '📿',
    arabic: 'التحيات لله والصلوات والطيبات، السلام عليك أيها النبي ورحمة الله وبركاته، السلام علينا وعلى عباد الله الصالحين، أشهد أن لا إله إلا الله، وأشهد أن محمداً عبده ورسوله',
    transliteration: 'Athahiyyaatu Lillahi Was Salawaatu Wattayyibatu. Assalamu Alaika Ayyuhannabi yu Warahmatullaahi Wabarka\'tuhu. Assalamu Alaina Wa\'alaa\'Ibaadillaahis Saa\'liheen. Ash\'had\'u\'Allahaa ilaha illallahu. Wa Ash\'hadu Anna Muhammadun Abd\'uhu Wa Rasooluh',
    meaning: 'All compliments, all physical prayer and all monetary worship are for Allah. Peace be upon you, Oh Prophet, and Allah\'s mercy and blessings. Peace be on us and on all righteous slaves of Allah. I bear witness that no one is worthy of worship except Allah. And I bear witness that Muhammad is His slave and Messenger',
    soundType: 'tashahhud',
    instruction: 'After 2nd Sujud, sit and recite complete Tashahhud. Listen to the proper recitation.'
  },
  {
    id: 12,
    name: 'Step 9: Salam (End Prayer)',
    emoji: '☮️',
    arabic: 'السلام عليكم ورحمة الله وبركاته',
    transliteration: 'Assalamu Alaikum Wa Rahmatullaahi Wa Barakatuhu',
    meaning: 'Peace, mercy, and blessings of Allah be upon you',
    soundType: 'salam',
    instruction: 'Turn head to right shoulder and say Salam, then to left shoulder and say it again. Your Salah is complete!'
  }
];

export default function SalahGuide({ onBack }: SalahGuideProps) {
  const t = useT();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  // Stop audio when step changes
  useEffect(() => {
    return () => {
      currentAudio.current?.pause();
    };
  }, [currentStep]);

  const step = SALAH_STEPS[currentStep];

  const handleNext = () => {
    currentAudio.current?.pause();
    setAudioStatus('idle');

    if (currentStep < SALAH_STEPS.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      setShowCompletion(true);
      playStarSound();
      const savedStars = localStorage.getItem('stars');
      const newStars = (parseInt(savedStars || '0') || 0) + 10;
      localStorage.setItem('stars', newStars.toString());
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCompletedSteps(completedSteps.filter(s => s !== currentStep - 1));
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowCompletion(false);
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full text-center border-2 border-primary/30 bg-card/50 backdrop-blur">
          <div className="mb-4 animate-bounce flex justify-center"><Emoji3D emoji="🌟" size={80} /></div>
          <h2 className="text-3xl font-bold text-primary mb-4">{t('Excellent!', 'شاباش!')}</h2>
          <p className="text-muted-foreground mb-2">{t('You completed all the Salah steps!', 'تم نے نماز کے تمام قدم مکمل کر لیے!')}</p>
          <p className="text-lg font-bold text-accent mb-6">+10 {t('Stars', 'ستارے')}</p>

          <div className="flex gap-3">
            <Button
              onClick={handleReset}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t('Try Again', 'دوبارہ کرو')}
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              {t('Back Home', 'گھر واپس')}
            </Button>
          </div>
        </Card>
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
        <span>{t('Back', 'واپس')}</span>
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Progress — big & kid-friendly */}
        <div className="w-full max-w-2xl mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-extrabold text-primary">
              🕌 {t('Step', 'قدم')} {currentStep + 1} / {SALAH_STEPS.length}
            </span>
            <span className="text-base font-bold text-accent">
              {Math.round(((currentStep + 1) / SALAH_STEPS.length) * 100)}% ✅
            </span>
          </div>
          {/* Thick colored progress bar */}
          <div className="w-full bg-muted rounded-full h-5 overflow-hidden">
            <div
              className="h-5 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${((currentStep + 1) / SALAH_STEPS.length) * 100}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex gap-1 mt-2">
            {SALAH_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  idx < currentStep ? 'bg-primary' :
                  idx === currentStep ? 'bg-accent animate-pulse' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Card */}
        <Card className="w-full max-w-2xl p-8 border-2 border-primary/30 bg-card/50 backdrop-blur mb-8 animate-slide-in">
          <div className={`mb-6 flex justify-center ${
            completedSteps.includes(currentStep) ? 'animate-pulse' : 'animate-bounce'
          }`}>
            <Emoji3D emoji={step.emoji} size={96} />
          </div>

          <h2 className="text-3xl font-bold text-primary mb-2">{step.name}</h2>
          <p className="text-lg text-muted-foreground mb-6">{step.instruction}</p>

          {/* Islamic Duas Display */}
          <div className="bg-accent/10 rounded-lg p-6 mb-6 border-l-4 border-accent">
            {/* Arabic */}
            <p className="arabic-text text-accent mb-3">
              {step.arabic}
            </p>
            
            {/* Transliteration */}
            <p className="transliteration text-muted-foreground italic mb-3">
              {step.transliteration}
            </p>
            
            {/* English Meaning */}
            <p className="text-base text-foreground">
              <span className="font-bold text-primary">{t('Translation: ', 'ترجمہ: ')}</span>
              {step.meaning}
            </p>
          </div>

          {/* Sound Button for Duas */}
          <button
            onClick={() => {
              if (audioStatus === 'loading' || audioStatus === 'playing') {
                currentAudio.current?.pause();
                setAudioStatus('idle');
                return;
              }
              currentAudio.current?.pause();
              setAudioStatus('loading');
              currentAudio.current = playScholarOrTTS(
                step.soundType || '',
                step.arabic,
                () => setAudioStatus('playing'),
                () => setAudioStatus('idle'),
                () => setAudioStatus('idle')
              );
              if (!currentAudio.current) setAudioStatus('idle');
            }}
            className="w-full mb-6 py-4 bg-accent/20 hover:bg-accent/30 border-2 border-accent rounded-xl transition-all flex items-center justify-center gap-2 text-accent font-bold text-base active:scale-95"
          >
            {audioStatus === 'loading'
              ? <><Loader2 size={20} className="animate-spin" /> Loading...</>
              : audioStatus === 'playing'
              ? <><Volume2 size={20} /> {t('Stop Audio', 'آواز بند کرو')}</>
              : <><Volume2 size={20} /> {t('Hear the Dua (Scholar Audio)', 'دعا سنو (عالم کی آواز)')}</>}
          </button>

          {/* Instructions */}
          <div className="bg-primary/10 rounded-lg p-4 mb-6 border-l-4 border-primary">
            <p className="text-sm text-foreground">
              <span className="font-bold text-primary">{t('How to do it: ', 'کیسے کریں: ')}</span>
              {step.instruction}
            </p>
          </div>

          {/* Step counter */}
          <div className="text-center text-xs text-muted-foreground mb-4">
            {t('Step', 'قدم')} {currentStep + 1} {t('of', 'میں سے')} {SALAH_STEPS.length}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4 w-full max-w-md">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            {t('Previous', 'پچھلا')}
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {currentStep === SALAH_STEPS.length - 1 ? t('Complete', 'مکمل') : t('Next', 'اگلا')}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>{t('Remember: Salah connects us to Allah. Practice makes perfect!', 'یاد رکھو: نماز ہمیں اللہ سے جوڑتی ہے۔ مشق سے کمال آتا ہے!')}</p>
      </div>
    </div>
  );
}
