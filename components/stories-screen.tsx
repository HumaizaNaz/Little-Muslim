'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoriesScreenProps {
  onBack: () => void;
}

const STORIES = [
  {
    id: 1,
    title: 'Prophet Noah and the Ark',
    emoji: '🚤',
    color: 'border-blue-400/40',
    slides: [
      { text: 'Prophet Nuh (Noah) lived for 950 years. He spent his whole life calling people to believe in only one Allah.', emoji: '🧓' },
      { text: 'The people laughed at him and refused to listen. Only a few believers were with him.', emoji: '😔' },
      { text: 'Allah told Prophet Nuh to build a huge ark — a great ship. People laughed even more!', emoji: '🪵' },
      { text: 'Prophet Nuh brought two of every kind of animal onto the ark, along with the believers.', emoji: '🐘' },
      { text: 'Then the great flood came! Water poured from the sky and rose from the ground.', emoji: '🌊' },
      { text: 'The believers on the ark were safe. When the water stopped, the ark rested on a mountain. Allah had saved them!', emoji: '⛰️' }
    ],
    lesson: 'Never give up calling people to good, even if they laugh at you. Allah rewards patience.',
    quizQuestion: 'What is the main lesson from Prophet Nuh\'s story?',
    quizOptions: [
      { text: 'Build big boats to be safe', key: 'a' },
      { text: 'Patience and faith in Allah will always be rewarded', key: 'b' },
      { text: 'Animals are very important', key: 'c' }
    ],
    correctKey: 'b'
  },
  {
    id: 2,
    title: 'Prophet Yusuf\'s Amazing Journey',
    emoji: '👑',
    color: 'border-yellow-400/40',
    slides: [
      { text: 'Prophet Yusuf (Joseph) was the son of Prophet Yaqub. His father loved him dearly, and Yusuf could interpret dreams.', emoji: '👨‍👦' },
      { text: 'His older brothers became very jealous of Yusuf. One day they threw him into a deep dark well!', emoji: '🕳️' },
      { text: 'A passing caravan found him and took him to Egypt, where he was sold as a slave. But Yusuf stayed patient and trusted Allah.', emoji: '🐪' },
      { text: 'In Egypt, Yusuf was put in prison even though he did nothing wrong. He spent years there but never lost hope in Allah.', emoji: '🏛️' },
      { text: 'The king of Egypt had a strange dream. Only Yusuf could explain it — 7 good years then 7 difficult years of hunger!', emoji: '🌾' },
      { text: 'The king was so impressed that he made Yusuf a great ruler. His brothers came for food and he forgave them with love!', emoji: '👑' }
    ],
    lesson: 'Be honest and patient in hardship. Allah has a beautiful plan for those who trust Him.',
    quizQuestion: 'Why did Yusuf become a great ruler in Egypt?',
    quizOptions: [
      { text: 'He was very strong and powerful', key: 'a' },
      { text: 'He could interpret the king\'s dream and was honest', key: 'b' },
      { text: 'His father helped him', key: 'c' }
    ],
    correctKey: 'b'
  },
  {
    id: 3,
    title: 'The Elephant and the Birds',
    emoji: '🐘',
    color: 'border-green-400/40',
    slides: [
      { text: 'A powerful king named Abraha built a great church and wanted everyone to come there instead of the Kaaba in Mecca.', emoji: '⛪' },
      { text: 'Abraha was angry when people still loved the Kaaba. So he gathered a huge army — with a giant war elephant!', emoji: '⚔️' },
      { text: 'The people of Mecca were terrified. They had no army to fight back. They ran to the mountains for safety.', emoji: '😟' },
      { text: 'But when the elephant reached Mecca, it refused to move forward! It sat down and would not go near the Kaaba.', emoji: '🐘' },
      { text: 'Then Allah sent thousands of tiny birds from the sea, each carrying three small stones.', emoji: '🦅' },
      { text: 'The birds dropped the stones on the army and they were completely destroyed! The Kaaba was protected by Allah alone.', emoji: '✨' }
    ],
    lesson: 'Allah protects His sacred places. No power in the world can defeat Allah\'s plan.',
    quizQuestion: 'How did Allah protect the Kaaba from Abraha\'s army?',
    quizOptions: [
      { text: 'The people of Mecca fought back bravely', key: 'a' },
      { text: 'Allah sent small birds with stones to destroy the army', key: 'b' },
      { text: 'A big storm came and stopped them', key: 'c' }
    ],
    correctKey: 'b'
  },
  {
    id: 4,
    title: 'Prophet Ibrahim and the Fire',
    emoji: '🔥',
    color: 'border-orange-400/40',
    slides: [
      { text: 'Prophet Ibrahim (Abraham) lived among people who worshipped idols — statues made of stone and wood.', emoji: '🗿' },
      { text: 'Young Ibrahim would ask: "How can a statue that cannot speak, move, or hear be a god?" He refused to worship idols.', emoji: '🤔' },
      { text: 'One day when people left for a festival, Ibrahim went into the temple and broke all the idols — except the biggest one!', emoji: '🔨' },
      { text: 'When people came back and asked who broke the idols, Ibrahim said: "Ask the big one — he is the chief!" They were angry!', emoji: '😠' },
      { text: 'The king Nimrod ordered Ibrahim to be thrown into a huge fire. The fire burned for days. Everyone watched.', emoji: '🔥' },
      { text: 'But Allah said to the fire: "Be cool and safe for Ibrahim!" And Ibrahim walked out of the fire perfectly safe — not even burnt!', emoji: '🌟' }
    ],
    lesson: 'Stand up for the truth even when everyone is against you. Allah will always protect those who are truthful.',
    quizQuestion: 'What happened when Ibrahim was thrown into the fire?',
    quizOptions: [
      { text: 'He was badly burned', key: 'a' },
      { text: 'He ran away quickly', key: 'b' },
      { text: 'Allah made the fire cool and safe — Ibrahim was not hurt', key: 'c' }
    ],
    correctKey: 'c'
  },
  {
    id: 5,
    title: 'Prophet Musa and the Sea',
    emoji: '🌊',
    color: 'border-teal-400/40',
    slides: [
      { text: 'Prophet Musa (Moses) was sent to Pharaoh — the most powerful and cruel king in the world.', emoji: '👑' },
      { text: 'Pharaoh kept the Children of Israel as slaves and treated them very badly. Musa told him: "Free my people! Allah commands you!"', emoji: '⛓️' },
      { text: 'Pharaoh refused and Allah sent many signs — locusts, frogs, blood in the rivers. Still Pharaoh did not listen!', emoji: '🐸' },
      { text: 'Finally Allah told Musa to lead his people out of Egypt at night. But Pharaoh and his huge army chased after them!', emoji: '🌙' },
      { text: 'They reached the Red Sea — water in front, Pharaoh\'s army behind. The people were afraid. But Musa said: "Allah is with us!"', emoji: '😨' },
      { text: 'Allah told Musa to strike the sea with his staff. The water split and made a path! All the believers crossed safely. When Pharaoh followed — the water came back!', emoji: '🌊' }
    ],
    lesson: 'When you trust in Allah completely, He will make a way even when there seems to be no way.',
    quizQuestion: 'What did Musa do when his people were trapped between the sea and the army?',
    quizOptions: [
      { text: 'He panicked and ran away', key: 'a' },
      { text: 'He trusted Allah and struck the sea — it split open!', key: 'b' },
      { text: 'He fought Pharaoh\'s army', key: 'c' }
    ],
    correctKey: 'b'
  },
  {
    id: 6,
    title: 'The First Revelation — Cave of Hira',
    emoji: '🌙',
    color: 'border-purple-400/40',
    slides: [
      { text: 'Prophet Muhammad ﷺ loved to spend time alone in a cave called Hira on a mountain near Mecca. He would think and pray to Allah.', emoji: '⛰️' },
      { text: 'He was very troubled by how people around him worshipped idols, fought each other, and treated the poor badly.', emoji: '😔' },
      { text: 'One night — the Night of Power — the Angel Jibreel (Gabriel) came to him in the cave. He said: "IQRA! Read!"', emoji: '👼' },
      { text: 'The Prophet ﷺ said: "I cannot read!" Jibreel held him tightly and again said "IQRA!" Three times this happened.', emoji: '📖' },
      { text: 'Then the first verses of the Quran came: "Read in the name of your Lord who created. He created man from a clot of blood."', emoji: '✨' },
      { text: 'The Prophet ﷺ ran home to his beloved wife Khadijah. She comforted him. And so began the greatest mission in history — sharing Islam with the whole world!', emoji: '🌍' }
    ],
    lesson: 'The Quran is Allah\'s gift to us. We should read it, learn it, and live by it every day.',
    quizQuestion: 'What was the very first word revealed to Prophet Muhammad ﷺ?',
    quizOptions: [
      { text: 'Bismillah — In the name of Allah', key: 'a' },
      { text: 'Iqra — Read!', key: 'b' },
      { text: 'Alhamdulillah — Praise be to Allah', key: 'c' }
    ],
    correctKey: 'b'
  }
];

export default function StoriesScreen({ onBack }: StoriesScreenProps) {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  if (selectedStory !== null) {
    const story = STORIES[selectedStory];

    if (showQuiz) {
      const story = STORIES[selectedStory];

      return (
        <div className="min-h-screen flex flex-col px-4 py-6">
          <button
            onClick={() => { setShowQuiz(false); setCurrentSlide(0); }}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all"
          >
            <ArrowLeft size={24} />
            <span>Back to Story</span>
          </button>

          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md p-8 text-center border-2 border-primary/30 bg-card/50 backdrop-blur">
              <div className="text-6xl mb-4">❓</div>
              <h2 className="text-xl font-bold text-primary mb-6">{story.quizQuestion}</h2>

              <div className="space-y-3 mb-8">
                {story.quizOptions.map((option) => {
                  let style = 'border-muted bg-card hover:border-primary';
                  if (quizAnswer === option.key) {
                    style = option.key === story.correctKey
                      ? 'border-green-500 bg-green-50 dark:bg-green-950'
                      : 'border-red-500 bg-red-50 dark:bg-red-950';
                  }
                  return (
                    <button
                      key={option.key}
                      onClick={() => setQuizAnswer(option.key)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left text-sm font-medium ${style}`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {quizAnswer && (
                <div className="mb-6 p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
                  <p className="text-sm font-semibold text-primary">
                    {quizAnswer === story.correctKey
                      ? '✅ Bilkul sahi! Shabash!'
                      : '💭 Dobara sochein...'}
                  </p>
                </div>
              )}

              {quizAnswer === story.correctKey && (
                <div className="mb-6">
                  <div className="text-5xl animate-bounce mb-2">🌟</div>
                  <p className="font-bold text-accent">+3 Stars!</p>
                </div>
              )}

              <Button
                onClick={() => {
                  if (quizAnswer === story.correctKey) {
                    const saved = parseInt(localStorage.getItem('stars') || '0');
                    localStorage.setItem('stars', String(saved + 3));
                  }
                  setShowQuiz(false);
                  setSelectedStory(null);
                  setCurrentSlide(0);
                  setQuizAnswer(null);
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Back to Stories
              </Button>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col px-4 py-6">
        <button
          onClick={() => {
            setSelectedStory(null);
            setCurrentSlide(0);
          }}
          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all"
        >
          <ArrowLeft size={24} />
          <span>Back to Stories</span>
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Story Slide */}
          <Card className="w-full max-w-md p-8 text-center border-2 border-accent/30 bg-card/50 backdrop-blur mb-8">
            <div className="text-7xl mb-6">{story.slides[currentSlide].emoji}</div>
            <p className="text-lg text-foreground leading-relaxed mb-6">{story.slides[currentSlide].text}</p>
          </Card>

          {/* Progress */}
          <div className="w-full max-w-md mb-8">
            <div className="flex gap-1">
              {story.slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    idx <= currentSlide ? 'bg-accent' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Slide {currentSlide + 1} of {story.slides.length}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 w-full max-w-md mb-8">
            <Button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              variant="outline"
              size="lg"
            >
              <ChevronLeft />
            </Button>

            <Button
              onClick={() => {
                if (currentSlide < story.slides.length - 1) {
                  setCurrentSlide(currentSlide + 1);
                } else {
                  setShowQuiz(true);
                }
              }}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {currentSlide === story.slides.length - 1 ? 'Take Quiz' : 'Next'}
            </Button>

            {currentSlide < story.slides.length - 1 && (
              <Button
                onClick={() => setCurrentSlide(Math.min(story.slides.length - 1, currentSlide + 1))}
                size="lg"
                variant="outline"
              >
                <ChevronRight />
              </Button>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground py-4">
          <p>📖 Lesson: {story.lesson}</p>
        </div>
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
      <h1 className="text-4xl font-bold text-primary mb-8">Islamic Stories</h1>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {STORIES.map((story, idx) => (
          <Card
            key={story.id}
            onClick={() => { setSelectedStory(idx); setCurrentSlide(0); setQuizAnswer(null); }}
            className={`cursor-pointer hover:shadow-lg transition-all duration-300 p-6 border-2 ${story.color} bg-card/50 backdrop-blur`}
          >
            <div className="text-5xl mb-4">{story.emoji}</div>
            <h2 className="text-xl font-bold text-primary mb-1">{story.title}</h2>
            <p className="text-muted-foreground text-xs mb-4">{story.slides.length} slides · Quiz included</p>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Read Story
            </Button>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>Learn from the stories of the Prophets and great Muslims!</p>
      </div>
    </div>
  );
}
