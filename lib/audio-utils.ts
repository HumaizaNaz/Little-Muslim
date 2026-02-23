// Audio utility for Islamic learning app

export const createAudioContext = () => {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

// ── Star / Reward chime sound ──
export const playStarSound = () => {
  const ctx = createAudioContext();
  if (!ctx) return;

  // Play a rising 3-note chime: C5 → E5 → G5
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = freq;

    const start = ctx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

    osc.start(start);
    osc.stop(start + 0.55);
  });
};

// ── Internal: get voices, waiting for async load if needed ──
const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        resolve(window.speechSynthesis.getVoices());
      }, { once: true });
      // Timeout fallback after 1.5s
      setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1500);
    }
  });
};

// ── Scholar Audio URLs (Mishary Alafasy via everyayah.com — proven reliable) ──
// Format: {surah_3digits}{verse_3digits}.mp3
const SCHOLAR_AUDIO_URLS: Record<string, string> = {
  fatiha:    'https://everyayah.com/data/Alafasy_128kbps/001001.mp3', // Al-Fatiha: Bismillah
  ikhlas:    'https://everyayah.com/data/Alafasy_128kbps/112001.mp3', // Al-Ikhlas: Qul huwallahu ahad
  bismillah: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3', // Bismillah
  tasmiyyah: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3', // Bismillah
};

// Play scholar audio (CDN for Quran, Google TTS for non-Quran phrases)
// Uses triedFallback flag to prevent double-firing from onerror + play().catch()
export const playScholarOrTTS = (
  phraseKey: string,
  arabicText: string,
  onPlay?: () => void,
  onEnd?: () => void,
  onError?: () => void
): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;

  const cdnUrl = SCHOLAR_AUDIO_URLS[phraseKey];
  const ttsUrl = `/api/tts?text=${encodeURIComponent(arabicText.slice(0, 200))}`;
  const primaryUrl = cdnUrl || ttsUrl;

  const audio = new Audio(primaryUrl);
  let triedFallback = false;

  const tryFallback = () => {
    if (triedFallback) return; // prevent double-trigger
    triedFallback = true;

    if (cdnUrl) {
      // CDN failed → fall back to Google TTS
      const fallback = new Audio(ttsUrl);
      fallback.onplay  = () => onPlay?.();
      fallback.onended = () => onEnd?.();
      fallback.onerror = () => onError?.();
      fallback.play().catch(() => onError?.());
    } else {
      onError?.();
    }
  };

  audio.onplay  = () => onPlay?.();
  audio.onended = () => onEnd?.();
  audio.onerror = tryFallback;
  audio.play().catch(tryFallback);
  return audio;
};

// ── Play Arabic via Google TTS API route ──
// Returns an Audio element on success, null on failure
export const playArabicViaAPI = (
  arabicText: string,
  onPlay?: () => void,
  onEnd?: () => void,
  onError?: () => void
): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;

  const url = `/api/tts?text=${encodeURIComponent(arabicText)}`;
  const audio = new Audio(url);

  audio.onplay    = () => onPlay?.();
  audio.onended   = () => onEnd?.();
  audio.onerror   = () => onError?.();

  audio.play().catch(() => onError?.());
  return audio;
};

// ── Speak Arabic text (Web Speech API fallback) ──
// Returns: 'playing' | 'no-arabic-voice' | 'not-supported'
export const speakArabic = async (
  arabicText: string
): Promise<'playing' | 'no-arabic-voice' | 'not-supported'> => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return 'not-supported';
  }

  window.speechSynthesis.cancel();

  const voices = await getVoices();
  const arabicVoice = voices.find(
    (v) => v.lang.startsWith('ar') || v.lang.toLowerCase().includes('arabic')
  );

  const utterance = new SpeechSynthesisUtterance(arabicText);
  utterance.rate = 0.7;
  utterance.pitch = 1.0;
  utterance.volume = 1;

  if (arabicVoice) {
    utterance.voice = arabicVoice;
    utterance.lang = arabicVoice.lang;
    window.speechSynthesis.speak(utterance);
    return 'playing';
  } else {
    // Try ar-SA anyway — some devices support it without listing the voice
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
    return 'no-arabic-voice';
  }
};

// ── Speak transliteration (romanized Arabic) in English voice ──
export const speakTransliteration = (text: string) => {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.75;
  utterance.pitch = 1.0;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
};

// ── General text-to-speech ──
export const speakText = (text: string, lang = 'en-US') => {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
};

// ── Namaz phrases (Arabic text) ──
const NAMAZ_PHRASES: Record<string, string> = {
  allahuakbar:     'الله أكبر',
  sana:            'سبحانك اللهم وبحمدك وتبارك اسمك وتعالى جدك ولا إله غيرك',
  taawwudh:        'أعوذ بالله من الشيطان الرجيم',
  tasmiyyah:       'بسم الله الرحمن الرحيم',
  fatiha:          'الحمد لله رب العالمين الرحمن الرحيم مالك يوم الدين إياك نعبد وإياك نستعين اهدنا الصراط المستقيم صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين',
  ikhlas:          'قل هو الله أحد الله الصمد لم يلد ولم يولد ولم يكن له كفوا أحد',
  tasbih_ruku:     'سبحان ربي العظيم',
  tasmee:          'سمع الله لمن حمده ربنا ولك الحمد',
  tasbih_sujud:    'سبحان ربي الأعلى',
  dua_sujud:       'رب اغفر لي ورحمني',
  tashahhud:       'التحيات لله والصلوات والطيبات السلام عليك أيها النبي ورحمة الله وبركاته السلام علينا وعلى عباد الله الصالحين أشهد أن لا إله إلا الله وأشهد أن محمداً عبده ورسوله',
  durood:          'اللهم صل على محمد وعلى آل محمد كما صليت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد',
  salam:           'السلام عليكم ورحمة الله وبركاته',
  subhanallah:     'سبحان الله',
  alhamdulillah:   'الحمد لله',
  allahuakbar_takbir: 'الله أكبر',
  bismillah:       'بسم الله الرحمن الرحيم',
};

export const playPhrase = (phrase: string) => {
  const text = NAMAZ_PHRASES[phrase];
  if (text) speakArabic(text);
};

export const playSound = (_type: string) => {
  // placeholder — no beep sound needed
};

export const stopAudio = () => {
  if (typeof window !== 'undefined') window.speechSynthesis.cancel();
};
