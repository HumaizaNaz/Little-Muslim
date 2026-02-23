'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, Loader2 } from 'lucide-react';
import { playScholarOrTTS } from '@/lib/audio-utils';
import { useT } from '@/lib/language-context';
import Emoji3D from '@/components/emoji3d';

interface WuduGuideProps {
  onBack: () => void;
}

const WUDU_STEPS = [
  {
    id: 1,
    name: 'Niyyah — Intention',
    emoji: '💭',
    arabic: 'نَوَيْتُ أَنْ أَتَوَضَّأَ لِرَفْعِ الْحَدَثِ وَاسْتِبَاحَةِ الصَّلَاةِ لِلَّهِ تَعَالَى',
    transliteration: 'Nawaytu an atawadda\'a li raf\'il hadathi was tibaahatis salaati lillahi ta\'ala',
    meaning: 'I intend to perform Wudu to remove impurity and to make prayer permissible, for the sake of Allah',
    instruction: 'Niyyah dil mein karo. Zuban se kehna zarori nahi. Sirf Allah ke liye wudu karne ka irada karo.',
    tip: '💡 Niyyah dil ka amal hai — andar se karo',
    soundType: null
  },
  {
    id: 2,
    name: 'Bismillah — Shuru karo',
    emoji: '🌟',
    arabic: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ',
    transliteration: 'Bismillahir Rahmanir Raheem',
    meaning: 'In the name of Allah, the Most Gracious, the Most Merciful',
    instruction: 'Wudu shuru karne se pehle Bismillah kaho. Ye sunnat hai aur bohot zaroori hai.',
    tip: '💡 Bismillah ke baghair wudu sunnat ke bina hogi',
    soundType: 'bismillah'
  },
  {
    id: 3,
    name: 'Haath Dhoye — 3 Baar',
    emoji: '🤲',
    arabic: 'بِسْمِ اللهِ',
    transliteration: 'Bismillah',
    meaning: 'In the name of Allah',
    instruction: 'Dono haath kalai tak 3 baar dhoo. Unglion ke beech mein paani pahunchao. Pahle seedha haath, phir ulta haath.',
    tip: '💡 Ring ya ghadi utaar lo pehle',
    soundType: 'bismillah'
  },
  {
    id: 4,
    name: 'Madmada — Muh Khangalna',
    emoji: '👄',
    arabic: 'اَللّٰهُمَّ أَعِنِّيْ عَلٰى تِلَاوَةِ الْقُرْآنِ',
    transliteration: 'Allahumma a\'inni \'ala tilawatil Quran',
    meaning: 'O Allah, help me in the recitation of the Quran',
    instruction: 'Muh mein paani leke 3 baar achhi tarah khangalo. Daanton aur zaaban ko bhi saaf karo. Miswaak karna aur bhi afzal hai.',
    tip: '💡 Miswaak karna sunnat-e-muakkadah hai',
    soundType: 'bismillah'
  },
  {
    id: 5,
    name: 'Istinshaq — Naak Mein Paani',
    emoji: '👃',
    arabic: 'اَللّٰهُمَّ لَا تَحْرِمْنِيْ رَائِحَةَ الْجَنَّةِ',
    transliteration: 'Allahumma la tahrimni ra\'ihatal jannah',
    meaning: 'O Allah, do not deprive me of the fragrance of Paradise',
    instruction: 'Seedhe haath se 3 baar naak mein paani chadhao (Istinshaq). Phir ulte haath se naak saaf karo (Istinthar). Roza ho toh dhyan se karo.',
    tip: '💡 Roza mein naak ke andar zyada paani na lejo',
    soundType: 'bismillah'
  },
  {
    id: 6,
    name: 'Chehra Dhona — 3 Baar',
    emoji: '😊',
    arabic: 'اَللّٰهُمَّ بَيِّضْ وَجْهِيْ يَوْمَ تَبْيَضُّ وُجُوْهٌ وَتَسْوَدُّ وُجُوْهٌ',
    transliteration: 'Allahumma bayyid wajhi yawma tabyaddu wujohun wa taswaddu wujohun',
    meaning: 'O Allah, whiten my face on the day when faces will be whitened and faces will be darkened',
    instruction: 'Poora chehra 3 baar dhoo — peshani se thaadi tak, ek kaan se doosre kaan tak. Daadhi mein paani pahunchao (khilal karo).',
    tip: '💡 Daadhi mein ungli se paani pahunchana farz hai',
    soundType: 'bismillah'
  },
  {
    id: 7,
    name: 'Seedha Baazoo — Kohni Tak',
    emoji: '💪',
    arabic: 'اَللّٰهُمَّ أَعْطِنِيْ كِتَابِيْ بِيَمِيْنِيْ',
    transliteration: 'Allahumma a\'tini kitabi biyamini',
    meaning: 'O Allah, give me my book of deeds in my right hand',
    instruction: 'Seedha (daayan) haath unglion se kohni tak 3 baar dhoo. Yaqeen karo poori jagah bheegi ho. Ungliyon ke beech khilal karo.',
    tip: '💡 Kohni bhi poori tarah dhoye',
    soundType: 'bismillah'
  },
  {
    id: 8,
    name: 'Ulta Baazoo — Kohni Tak',
    emoji: '💪',
    arabic: 'اَللّٰهُمَّ لَا تُعْطِنِيْ كِتَابِيْ بِشِمَالِيْ',
    transliteration: 'Allahumma la tu\'tini kitabi bishimali',
    meaning: 'O Allah, do not give me my book of deeds in my left hand',
    instruction: 'Ulta (baayan) haath unglion se kohni tak 3 baar dhoo. Seedhe haath ki tarah poori taraf achi tarah bheegi ho.',
    tip: '💡 Hamesha seedhe se shuru karo',
    soundType: 'bismillah'
  },
  {
    id: 9,
    name: 'Masah — Sar Ka',
    emoji: '🧠',
    arabic: 'اَللّٰهُمَّ حَرِّمْ شَعْرِيْ وَبَشَرِيْ عَلَى النَّارِ',
    transliteration: 'Allahumma harrim sha\'ri wa bashari \'alan naar',
    meaning: 'O Allah, forbid my hair and skin from the Fire',
    instruction: 'Dono haath gile karo aur sirf ek baar poore sar par masah karo. Aage se peechhe aur peechhe se aage. Ye dhona nahi, sirf masah hai.',
    tip: '💡 Sar ka masah sirf 1 baar — 3 baar nahi',
    soundType: 'bismillah'
  },
  {
    id: 10,
    name: 'Masah — Kaanon Ka',
    emoji: '👂',
    arabic: 'اَللّٰهُمَّ اجْعَلْنِيْ مِنَ الَّذِيْنَ يَسْتَمِعُوْنَ الْقَوْلَ فَيَتَّبِعُوْنَ أَحْسَنَهُ',
    transliteration: 'Allahumma aj\'alni minal ladhina yastami\'onal qawla fayattabi\'oona ahsanahu',
    meaning: 'O Allah, make me among those who listen to the word and follow the best of it',
    instruction: 'Shahaadat (index) ungli se kaanon ke andar aur anghothe (thumb) se kaanon ke peechhe masah karo. Sar wale pani se karo, naya paani lene ki zaroorat nahi.',
    tip: '💡 Kaanon ka masah sar ke saath karo',
    soundType: 'bismillah'
  },
  {
    id: 11,
    name: 'Masah — Gardan Ka',
    emoji: '🙆',
    arabic: 'اَللّٰهُمَّ فُكَّ رَقَبَتِيْ مِنَ النَّارِ',
    transliteration: 'Allahumma fukka raqabati minan naar',
    meaning: 'O Allah, free my neck from the Fire',
    instruction: 'Dono haathon ki peeth se gardan ka masah karo. Ye sunnat hai. Gale ke aage masah nahi karna. Sirf gardan ke peechhe.',
    tip: '💡 Gardan ka masah sunnat hai, farz nahi',
    soundType: 'bismillah'
  },
  {
    id: 12,
    name: 'Seedha Paon — Tokhne Tak',
    emoji: '🦶',
    arabic: 'اَللّٰهُمَّ ثَبِّتْ قَدَمَيَّ عَلَى الصِّرَاطِ',
    transliteration: 'Allahumma thabbit qadamayya \'alas siraat',
    meaning: 'O Allah, keep my feet firm on the bridge (on the Day of Judgment)',
    instruction: 'Seedha (daayan) paon unglion se tokhne tak 3 baar dhoo. Chote unglee se shuru karke paon ki unglion ke beech khilal karo.',
    tip: '💡 Paon ki unglion ke beech achhi tarah dhoo',
    soundType: 'bismillah'
  },
  {
    id: 13,
    name: 'Ulta Paon — Tokhne Tak',
    emoji: '🦶',
    arabic: 'اَللّٰهُمَّ ثَبِّتْ قَدَمَيَّ عَلَى الصِّرَاطِ',
    transliteration: 'Allahumma thabbit qadamayya \'alas siraat',
    meaning: 'O Allah, keep my feet firm on the bridge (on the Day of Judgment)',
    instruction: 'Ulta (baayan) paon 3 baar dhoo. Bilkul usi tarah jaise seedha paon dhoya. Hamesha seedhe se shuru karo.',
    tip: '💡 Wudu seedhe se shuru hoti hai — daayan haath, daayan paon pehle',
    soundType: 'bismillah'
  },
  {
    id: 14,
    name: 'Wudu ke Baad ki Dua',
    emoji: '🤲',
    arabic: 'أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ، اَللّٰهُمَّ اجْعَلْنِيْ مِنَ التَّوَّابِيْنَ وَاجْعَلْنِيْ مِنَ الْمُتَطَهِّرِيْنَ',
    transliteration: 'Ash-hadu alla ilaha illallahu wahdahu la sharika lah, wa ash-hadu anna Muhammadan \'abduhu wa rasooluh. Allahumma ij\'alni minat-tawwabina waj\'alni minal mutatahhireen',
    meaning: 'I testify there is no god but Allah alone, no partner has He, and I testify that Muhammad is His servant and messenger. O Allah, make me of those who repent often and keep themselves pure.',
    instruction: 'Wudu mukammal hone ke baad aasmaan ki taraf nazar karke yeh dua padho. Hadith mein aaya hai jenne yeh dua padha uske liye jannat ke 8 darwaaze khul jaate hain.',
    tip: '💡 Wudu ke baad yeh dua zaroor padho — jannat ke darwaaze khul jaate hain',
    soundType: 'tashahhud'
  }
];

export default function WuduGuide({ onBack }: WuduGuideProps) {
  const t = useT();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Stop audio when step changes
    return () => {
      currentAudio.current?.pause();
    };
  }, [currentStep]);

  const step = WUDU_STEPS[currentStep];

  const handleNext = () => {
    currentAudio.current?.pause();
    setAudioStatus('idle');

    if (currentStep < WUDU_STEPS.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      setShowCompletion(true);
    }
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6">
        <Card className="w-full max-w-md p-8 text-center border-2 border-primary">
          <div className="mb-6 animate-bounce flex justify-center"><Emoji3D emoji="✨" size={80} /></div>
          <h2 className="text-3xl font-bold text-primary mb-4">{t('Wudu Complete!', 'وضو مکمل!')}</h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t('You are now ready to perform Salah. Your Wudu is valid!', 'اب تم نماز کے لیے تیار ہو۔ تمہارا وضو درست ہے!')}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {t('Remember to maintain your Wudu and keep a clean heart for prayer', 'وضو برقرار رکھو اور نماز کے لیے دل صاف رکھو')}
          </p>
          <Button
            onClick={() => {
              setCurrentStep(0);
              setCompletedSteps([]);
              setShowCompletion(false);
              onBack();
            }}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {t('Back to Home', 'گھر واپس')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all"
      >
        <ArrowLeft size={24} />
        <span>{t('Back', 'واپس')}</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl p-8 border-2 border-primary/30 bg-card/50 backdrop-blur mb-8 animate-slide-in">
          <div className={`mb-6 flex justify-center ${
            completedSteps.includes(currentStep) ? 'animate-pulse' : 'animate-bounce'
          }`}>
            <Emoji3D emoji={step.emoji} size={96} />
          </div>

          <h2 className="text-3xl font-bold text-primary mb-2">{step.name}</h2>

          {/* Progress — big & kid-friendly */}
          <div className="w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-extrabold text-primary">
                💧 Qadam {currentStep + 1} / {WUDU_STEPS.length}
              </span>
              <span className="text-base font-bold text-accent">
                {Math.round(((currentStep + 1) / WUDU_STEPS.length) * 100)}% ✅
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-5 overflow-hidden">
              <div
                className="h-5 rounded-full bg-gradient-to-r from-blue-400 to-primary transition-all duration-500"
                style={{ width: `${((currentStep + 1) / WUDU_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Islamic Details */}
          <div className="bg-accent/10 rounded-lg p-6 mb-6 border-l-4 border-accent">
            <p className="arabic-text text-accent mb-3">
              {step.arabic}
            </p>
            <p className="transliteration text-muted-foreground italic mb-3">
              {step.transliteration}
            </p>
            <p className="text-base text-foreground">
              <span className="font-bold text-primary">{t('Translation: ', 'ترجمہ: ')}</span>
              {step.meaning}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-primary/10 rounded-lg p-4 mb-4 border-l-4 border-primary">
            <p className="text-sm text-foreground">
              <span className="font-bold text-primary">{t('How to do it: ', 'کیسے کریں: ')}</span>
              {step.instruction}
            </p>
          </div>

          {/* Hear the Dua Button */}
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
            className="w-full mb-4 py-4 bg-accent/20 hover:bg-accent/30 border-2 border-accent rounded-xl transition-all flex items-center justify-center gap-2 text-accent font-bold text-base active:scale-95"
          >
            {audioStatus === 'loading'
              ? <><Loader2 size={20} className="animate-spin" /> Loading...</>
              : audioStatus === 'playing'
              ? <><Volume2 size={20} /> {t('Stop Audio', 'آواز بند کرو')}</>
              : <><Volume2 size={20} /> {t('Hear the Dua (Scholar Audio)', 'دعا سنو (عالم کی آواز)')}</>}
          </button>

          {/* Tip */}
          {step.tip && (
            <div className="bg-secondary/20 rounded-lg p-3 mb-6 border border-secondary/40">
              <p className="text-sm text-foreground">{step.tip}</p>
            </div>
          )}

          {/* Step counter */}
          <div className="text-center text-sm text-muted-foreground mb-6">
            Step {currentStep + 1} of {WUDU_STEPS.length}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                className="flex-1"
              >
                {t('Previous', 'پچھلا')}
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 bg-primary hover:bg-primary/90 font-bold"
            >
              {currentStep === WUDU_STEPS.length - 1 ? t('Complete Wudu', 'وضو مکمل') : t('Next Step', 'اگلا قدم')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
