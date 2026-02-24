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

// ── Stoppable interface — compatible with HTMLAudioElement.pause() ──
export type Stoppable = { pause: () => void };

// ── Surahs that need all verses played sequentially ──
const SURAH_VERSE_COUNTS: Record<string, { surah: number; count: number }> = {
  fatiha: { surah: 1,   count: 7 }, // Al-Fatiha:  7 verses
  ikhlas: { surah: 112, count: 4 }, // Al-Ikhlas:  4 verses
};

// ── Play a full Quran surah by chaining verse-by-verse files ──
// everyayah.com Alafasy 128kbps — format: {surah3}{verse3}.mp3
const playVerseChain = (
  surahNum: number,
  verseCount: number,
  onPlay?: () => void,
  onEnd?: () => void,
  onError?: () => void
): Stoppable => {
  const base = 'https://everyayah.com/data/Alafasy_128kbps/';
  const s = String(surahNum).padStart(3, '0');
  let stopped = false;
  let audioEl: HTMLAudioElement | null = null;

  const playVerse = (v: number) => {
    if (stopped) return;
    if (v > verseCount) { onEnd?.(); return; }

    const url = `${base}${s}${String(v).padStart(3, '0')}.mp3`;
    audioEl = new Audio(url);

    if (v === 1) audioEl.onplay = () => onPlay?.();
    audioEl.onended = () => { if (!stopped) playVerse(v + 1); };
    audioEl.onerror = () => { if (!stopped) onError?.(); };
    audioEl.play().catch(() => { if (!stopped) onError?.(); });
  };

  playVerse(1);
  return { pause: () => { stopped = true; audioEl?.pause(); } };
};

// ── Scholar Audio URLs (Mishary Alafasy via everyayah.com — single-file phrases) ──
const SCHOLAR_AUDIO_URLS: Record<string, string> = {
  bismillah:          'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
  tasmiyyah:          'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
  allahuakbar:        'https://everyayah.com/data/Alafasy_128kbps/002185.mp3',
  allahuakbar_takbir: 'https://everyayah.com/data/Alafasy_128kbps/002185.mp3',
  tasbih_ruku:        'https://everyayah.com/data/Alafasy_128kbps/056074.mp3',
  tasbih_sujud:       'https://everyayah.com/data/Alafasy_128kbps/087001.mp3',
  subhanallah:        'https://everyayah.com/data/Alafasy_128kbps/087001.mp3',
};

// ── Play scholar audio (CDN → Google TTS → onError) ──
// For fatiha/ikhlas → plays ALL verses sequentially via playVerseChain
// Returns a Stoppable (has .pause()) so callers don't need to care about type
export const playScholarOrTTS = (
  phraseKey: string,
  arabicText: string,
  onPlay?: () => void,
  onEnd?: () => void,
  onError?: () => void
): Stoppable | null => {
  if (typeof window === 'undefined') return null;

  // Full surah? Play all verses sequentially
  const surahInfo = SURAH_VERSE_COUNTS[phraseKey];
  if (surahInfo) {
    return playVerseChain(surahInfo.surah, surahInfo.count, onPlay, onEnd, onError);
  }

  // Single-file CDN or Google TTS fallback
  const cdnUrl = SCHOLAR_AUDIO_URLS[phraseKey];
  const ttsUrl = `/api/tts?text=${encodeURIComponent(arabicText.slice(0, 200))}`;
  const primaryUrl = cdnUrl || ttsUrl;

  const audio = new Audio(primaryUrl);
  let triedFallback = false;

  const tryFallback = () => {
    if (triedFallback) return;
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
  return { pause: () => audio.pause() };
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
