'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import Confetti from '@/components/confetti';

interface RamadanChallengeProps {
  onBack: () => void;
}

interface DailyChallenge {
  day: number;
  mandatory: string[];
  optional: string[];
  points: { mandatory: number; optional: number };
}

const RAMADAN_CHALLENGES: DailyChallenge[] = [
  {
    day: 1,
    mandatory: ['Pray Fajr on time', 'Recite 1 Surah', 'Be kind to someone'],
    optional: ['Learn a Dua', 'Read Islamic story'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 2,
    mandatory: ['Complete Salah on time', 'Help parents with chores', 'Learn Arabic alphabet'],
    optional: ['Memorize a verse', 'Fast the full day'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 3,
    mandatory: ['Pray all 5 times', 'Practice Wudu correctly', 'Smile and be friendly'],
    optional: ['Teach a friend about Islam', 'Write a journal entry'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 4,
    mandatory: ['Attend prayer', 'Give charity', 'Read Quran for 10 mins'],
    optional: ['Memorize 2 Hadiths', 'Make Dua for family'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 5,
    mandatory: ['Morning & Evening Dua', 'Help someone in need', 'No anger or arguments'],
    optional: ['Learn Islamic history', 'Draw Islamic art'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 6,
    mandatory: ['Tahajjud prayer', 'Recite 2 Surahs', 'Be honest always'],
    optional: ['Memorize a Dua', 'Teach younger sibling'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 7,
    mandatory: ['Pray on time', 'Control your tongue', 'Do good deeds'],
    optional: ['Write Quran verses', 'Complete Salah challenge'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 8,
    mandatory: ['Listen to Quran recitation', 'Fast the whole day', 'Make Dua for parents'],
    optional: ['Learn Prophet stories', 'Memorize Tawheed'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 9,
    mandatory: ['Attend Taraweeh prayer', 'Read Quran 2x today', 'Help without asking'],
    optional: ['Memorize Surah Al-Ikhlas', 'Teach about Prophet Muhammad'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 10,
    mandatory: ['Complete all 5 Salah', 'Practice patience', 'Be grateful'],
    optional: ['Memorize Islamic Duas', 'Draw Prophet stories'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 11,
    mandatory: ['Pray with concentration', 'Give to poor', 'Learn about Zakat'],
    optional: ['Memorize Arabic phrases', 'Study Islamic calendar'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 12,
    mandatory: ['Tahajjud and Fajr', 'Recite full Quran page', 'Control eating habits'],
    optional: ['Learn about Hajj', 'Memorize mosque rules'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 13,
    mandatory: ['Attend prayers', 'Be kind to animals', 'Make Dua earnestly'],
    optional: ['Teach about Prophet Jesus', 'Learn Islamic greetings'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 14,
    mandatory: ['Fast completely', 'Pray extra Rakats', 'Respect elders'],
    optional: ['Memorize 99 Names (part)', 'Write Islamic quotes'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 15,
    mandatory: ['All Salah on time', 'Read 2 pages Quran', 'Help 3 people'],
    optional: ['Learn Islamic history dates', 'Create Islamic poster'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 16,
    mandatory: ['Taraweeh prayer', 'Practice Islamic manners', 'Give sincere Dua'],
    optional: ['Memorize Ayat-ul-Kursi', 'Study Muslim countries'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 17,
    mandatory: ['Pray all 5 times', 'Control anger', 'Show gratitude'],
    optional: ['Learn about Laylat-ul-Qadr', 'Memorize Surat Al-Falaq'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 18,
    mandatory: ['Fast with sincerity', 'Help siblings study', 'Recite Quran 3 times'],
    optional: ['Write about Prophet Noah', 'Learn Islamic architecture'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 19,
    mandatory: ['All prayers with Jamaat', 'Be truthful always', 'Make Tahajjud Dua'],
    optional: ['Memorize Surah Al-Nas', 'Study Islamic science'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 20,
    mandatory: ['Pray Taraweeh', 'Complete Quran reading', 'Help parents fully'],
    optional: ['Learn about Zakat-ul-Fitr', 'Memorize Islamic dates'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 21,
    mandatory: ['All Salah on time', 'No wastage of food', 'Give charity'],
    optional: ['Memorize Kalma Tawheed', 'Write Islamic journal'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 22,
    mandatory: ['Tahajjud and Fajr', 'Fast fully', 'Make Dua for Ummah'],
    optional: ['Learn about Qadr', 'Study Prophet Muhammad'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 23,
    mandatory: ['Attend all prayers', 'Control desires', 'Show compassion'],
    optional: ['Memorize Taawwuz', 'Learn Islamic etiquette'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 24,
    mandatory: ['Pray with Jamaat', 'Recite Quran 4x', 'Be humble always'],
    optional: ['Memorize short Surahs', 'Write about prophets'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 25,
    mandatory: ['Complete 5 Salah', 'Last Asrah begins - extra effort', 'Give charity daily'],
    optional: ['Memorize 99 Names (more)', 'Create Islamic artwork'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 26,
    mandatory: ['Taraweeh + Tahajjud', 'Seek Laylat-ul-Qadr', 'Intense Dua'],
    optional: ['Memorize Ayaat', 'Study Islamic civilization'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 27,
    mandatory: ['All prayers + extra', 'Night prayer focus', 'Make sincere Tawbah'],
    optional: ['Laylat-ul-Qadr night special', 'Memorize Dua full'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 28,
    mandatory: ['Complete Quran reading', 'Pray all Sunnah', 'Thank Allah for Ramadan'],
    optional: ['Memorize Surah Fatiha', 'Write Ramadan reflections'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 29,
    mandatory: ['Fast until Maghrib', 'Final charity', 'Prepare for Eid'],
    optional: ['Learn Eid prayers', 'Make Eid decorations'],
    points: { mandatory: 15, optional: 5 }
  },
  {
    day: 30,
    mandatory: ['Eid prayer preparation', 'Give Zakat-ul-Fitr', 'Celebrate with family'],
    optional: ['Eid Mubarak celebration', 'Share Islamic joy'],
    points: { mandatory: 15, optional: 5 }
  }
];

export default function RamadanChallenge({ onBack }: RamadanChallengeProps) {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<{ day: number; tasks: string[] }>({
    day: 1,
    tasks: []
  });
  const [totalPoints, setTotalPoints] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Get today's day (1-30)
    const today = new Date();
    const ramadanStart = new Date(2025, 2, 1); // March 1, 2025
    const daysDiff = Math.floor((today.getTime() - ramadanStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const day = Math.max(1, Math.min(30, daysDiff));
    setCurrentDay(day);

    // Load from localStorage
    const saved = localStorage.getItem(`ramadan-day-${day}`);
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }

    const savedPoints = localStorage.getItem('ramadan-total-points');
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints));
    }
  }, []);

  const challenge = RAMADAN_CHALLENGES[currentDay - 1];

  const toggleTask = (task: string, isMandatory: boolean) => {
    const newTasks = completedTasks.tasks.includes(task)
      ? completedTasks.tasks.filter(t => t !== task)
      : [...completedTasks.tasks, task];

    setCompletedTasks({ day: currentDay, tasks: newTasks });
    localStorage.setItem(`ramadan-day-${currentDay}`, JSON.stringify({ day: currentDay, tasks: newTasks }));

    // Calculate points
    let points = 0;
    challenge.mandatory.forEach(task => {
      if (newTasks.includes(task)) points += challenge.points.mandatory / challenge.mandatory.length;
    });
    challenge.optional.forEach(task => {
      if (newTasks.includes(task)) points += challenge.points.optional / challenge.optional.length;
    });

    const newTotal = totalPoints + (points - (completedTasks.tasks.includes(task) ? (isMandatory ? challenge.points.mandatory / challenge.mandatory.length : challenge.points.optional / challenge.optional.length) : 0));
    setTotalPoints(Math.max(0, newTotal));
    localStorage.setItem('ramadan-total-points', newTotal.toString());

    // Celebration when all mandatory done
    if (newTasks.length === challenge.mandatory.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const mandatoryDone = challenge.mandatory.filter(t => completedTasks.tasks.includes(t)).length;
  const optionalDone = challenge.optional.filter(t => completedTasks.tasks.includes(t)).length;

  return (
    <div className="min-h-screen px-4 py-6">
      <Confetti active={showConfetti} />

      <button
        onClick={onBack}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all"
      >
        <ArrowLeft size={24} />
        <span>Back</span>
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-primary mb-2">
            🌙 Day {currentDay} of 30 🌙
          </h1>
          <p className="text-lg text-muted-foreground">Ramadan Challenge</p>
          <p className="text-2xl font-bold text-accent mt-3">Points: {Math.round(totalPoints)}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-sm">Day Progress</span>
            <span className="text-sm text-muted-foreground">{currentDay}/30</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
              style={{ width: `${(currentDay / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Mandatory Tasks */}
        <Card className="mb-6 p-6 border-2 border-primary/30 animate-slide-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✅ Must Do Today</span>
            <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">
              {mandatoryDone}/{challenge.mandatory.length}
            </span>
          </div>
          <div className="space-y-3">
            {challenge.mandatory.map((task, idx) => (
              <button
                key={idx}
                onClick={() => toggleTask(task, true)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center gap-3 ${
                  completedTasks.tasks.includes(task)
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  completedTasks.tasks.includes(task)
                    ? 'bg-primary border-primary'
                    : 'border-primary/30'
                }`}>
                  {completedTasks.tasks.includes(task) && (
                    <Check size={16} className="text-white" />
                  )}
                </div>
                <span className="text-base font-medium">{task}</span>
                {completedTasks.tasks.includes(task) && (
                  <span className="ml-auto text-primary">+{Math.round(challenge.points.mandatory / challenge.mandatory.length)}pts</span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Optional Tasks */}
        <Card className="p-6 border-2 border-accent/30 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⭐ Bonus Activities</span>
            <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-semibold">
              {optionalDone}/{challenge.optional.length}
            </span>
          </div>
          <div className="space-y-3">
            {challenge.optional.map((task, idx) => (
              <button
                key={idx}
                onClick={() => toggleTask(task, false)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center gap-3 ${
                  completedTasks.tasks.includes(task)
                    ? 'bg-accent/20 border-2 border-accent'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  completedTasks.tasks.includes(task)
                    ? 'bg-accent border-accent'
                    : 'border-accent/30'
                }`}>
                  {completedTasks.tasks.includes(task) && (
                    <Check size={16} className="text-white" />
                  )}
                </div>
                <span className="text-base font-medium">{task}</span>
                {completedTasks.tasks.includes(task) && (
                  <span className="ml-auto text-accent">+{Math.round(challenge.points.optional / challenge.optional.length)}pts</span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Completion Message */}
        {mandatoryDone === challenge.mandatory.length && (
          <div className="mt-6 p-4 bg-primary/10 border-2 border-primary rounded-lg text-center animate-pulse-grow">
            <p className="text-lg font-bold text-primary">
              🌟 Amazing! You completed today's must-dos! 🌟
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
