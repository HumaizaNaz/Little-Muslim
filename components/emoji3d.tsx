/**
 * Emoji3D — replaces flat emoji with Microsoft Fluent Emoji 3D images (free, open source)
 * CDN: https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets/
 */

const BASE = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets';

// Map emoji char → Fluent Emoji 3D path
const EMOJI_MAP: Record<string, string> = {
  '💧': `${BASE}/Droplet/3D/droplet_3d.png`,
  '🕌': `${BASE}/Mosque/3D/mosque_3d.png`,
  '🌙': `${BASE}/Crescent%20moon/3D/crescent_moon_3d.png`,
  '📖': `${BASE}/Open%20book/3D/open_book_3d.png`,
  '🤲': `${BASE}/Palms%20up%20together/3D/palms_up_together_3d.png`,
  '⭐': `${BASE}/Star/3D/star_3d.png`,
  '🌟': `${BASE}/Glowing%20star/3D/glowing_star_3d.png`,
  '💫': `${BASE}/Dizzy/3D/dizzy_3d.png`,
  '✨': `${BASE}/Sparkles/3D/sparkles_3d.png`,
  '🏆': `${BASE}/Trophy/3D/trophy_3d.png`,
  '📋': `${BASE}/Clipboard/3D/clipboard_3d.png`,
  '✅': `${BASE}/Check%20mark%20button/3D/check_mark_button_3d.png`,
  '🎖️': `${BASE}/Military%20medal/3D/military_medal_3d.png`,
  '📿': `${BASE}/Prayer%20beads/3D/prayer_beads_3d.png`,
  '🙌': `${BASE}/Raising%20hands/3D/raising_hands_3d.png`,
  '🤲': `${BASE}/Palms%20up%20together/3D/palms_up_together_3d.png`,
  '💭': `${BASE}/Thought%20balloon/3D/thought_balloon_3d.png`,
  '😊': `${BASE}/Slightly%20smiling%20face/3D/slightly_smiling_face_3d.png`,
  '💪': `${BASE}/Flexed%20biceps/3D/flexed_biceps_3d.png`,
  '🧠': `${BASE}/Brain/3D/brain_3d.png`,
  '👂': `${BASE}/Ear/3D/ear_3d.png`,
  '🦶': `${BASE}/Foot/3D/foot_3d.png`,
  '👃': `${BASE}/Nose/3D/nose_3d.png`,
  '👄': `${BASE}/Mouth/3D/mouth_3d.png`,
  '🙇': `${BASE}/Person%20bowing/3D/person_bowing_3d.png`,
  '⬆️': `${BASE}/Up%20arrow/3D/up_arrow_3d.png`,
  '🪑': `${BASE}/Chair/3D/chair_3d.png`,
  '📿': `${BASE}/Prayer%20beads/3D/prayer_beads_3d.png`,
  '☮️': `${BASE}/Peace%20symbol/3D/peace_symbol_3d.png`,
  '🌅': `${BASE}/Sunrise/3D/sunrise_3d.png`,
  '😴': `${BASE}/Sleeping%20face/3D/sleeping_face_3d.png`,
  '🏠': `${BASE}/House/3D/house_3d.png`,
  '🌱': `${BASE}/Seedling/3D/seedling_3d.png`,
  '📚': `${BASE}/Books/3D/books_3d.png`,
  '🎯': `${BASE}/Bullseye/3D/bullseye_3d.png`,
  '🔥': `${BASE}/Fire/3D/fire_3d.png`,
  '🌊': `${BASE}/Water%20wave/3D/water_wave_3d.png`,
  '💡': `${BASE}/Light%20bulb/3D/light_bulb_3d.png`,
  '👦': `${BASE}/Boy/3D/boy_3d.png`,
  '🏅': `${BASE}/Sports%20medal/3D/sports_medal_3d.png`,
};

interface Emoji3DProps {
  emoji: string;
  size?: number;       // px — default 64
  className?: string;
  alt?: string;
}

export default function Emoji3D({ emoji, size = 64, className = '', alt }: Emoji3DProps) {
  const src = EMOJI_MAP[emoji];

  // Fallback: render as text emoji if no 3D version mapped
  if (!src) {
    return (
      <span className={className} style={{ fontSize: size * 0.85 }}>
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt || emoji}
      width={size}
      height={size}
      className={`inline-block object-contain ${className}`}
      loading="lazy"
      onError={(e) => {
        // If CDN image fails, show text emoji
        const target = e.currentTarget;
        target.style.display = 'none';
        const span = document.createElement('span');
        span.textContent = emoji;
        span.style.fontSize = `${size * 0.85}px`;
        target.parentNode?.insertBefore(span, target);
      }}
    />
  );
}
