import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Sparkles, Volume2 } from 'lucide-react';
import { DomainDifficulty, LanguageCode, PatientProfile, SessionRecord } from '../../types';
import { audioService } from '../../services/audioService';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { storageService } from '../../services/storageService';
import { TRANSLATIONS } from '../../locales/translations';
import { VoicePromptBar } from '../common/VoicePromptBar';
import { GameResultModal } from './GameResultModal';

interface MemoryGameProps {
  patient: PatientProfile;
  difficulty: DomainDifficulty;
  selectedLanguage: LanguageCode;
  onExit: () => void;
}

interface HeritageItem {
  id: string;
  name: Record<LanguageCode, string>;
  iconEmoji: string;
  colorBg: string;
  imgUrl?: string;
}

const HERITAGE_ITEMS: HeritageItem[] = [
  {
    id: 'japi',
    name: {
      as: 'ফুলজাপি',
      mni: 'জাপি (ꯖꯥꯄꯤ)',
      kha: 'Ka Tupia Japi',
      lus: 'Japi Lukhum',
      hi: 'जापी (बांस टोपी)',
      en: 'Assamese Japi Hat',
    },
    iconEmoji: '👒',
    colorBg: 'bg-amber-100 border-amber-300',
    imgUrl: '/src/assets/images/ner_bamboo_craft_japi_1790522364386.jpg',
  },
  {
    id: 'pepa',
    name: {
      as: 'ম’হৰ শিঙৰ পেঁপা',
      mni: 'মশীংগী পেপা',
      kha: 'Ka Jingput Pepa',
      lus: 'Pepa Tawtawrawt',
      hi: 'पेपा (सींग वाद्य)',
      en: 'Pepa Horn Flute',
    },
    iconEmoji: '🎺',
    colorBg: 'bg-orange-100 border-orange-300',
  },
  {
    id: 'gamusa',
    name: {
      as: 'ফুলাম গামোচা',
      mni: 'ফুলাম গামোচা (ꯒꯥꯃꯣꯆꯥ)',
      kha: 'Ka Jain Gamusa',
      lus: 'Gamusa Puan',
      hi: 'फुलाम गमोसा',
      en: 'Assamese Gamusa',
    },
    iconEmoji: '🧣',
    colorBg: 'bg-rose-100 border-rose-300',
  },
  {
    id: 'khasi_orange',
    name: {
      as: 'খাচী কমোলা',
      mni: 'খাসি চম্প্রা কমোলা',
      kha: 'U Soh Niamtra',
      lus: 'Serthlum Tui',
      hi: 'खासी संतरा',
      en: 'Cherrapunji Khasi Orange',
    },
    iconEmoji: '🍊',
    colorBg: 'bg-amber-100 border-amber-300',
  },
  {
    id: 'mizo_puan',
    name: {
      as: 'মিজো পুৱান বস্ত্ৰ',
      mni: 'মিজো পুয়ান ফিদম',
      kha: 'Ka Jainsem Mizo',
      lus: 'Mizo Puanchei',
      hi: 'मिज़ो पुआन',
      en: 'Mizo Puan Handloom',
    },
    iconEmoji: '🧵',
    colorBg: 'bg-emerald-100 border-emerald-300',
  },
  {
    id: 'tea_cup',
    name: {
      as: 'কড়ক অসমীয়া চাহ',
      mni: 'মশলা অসাম চা',
      kha: 'Ka Sha Assam',
      lus: 'Assam Thingpui Sen',
      hi: 'असमिया कड़क चाय',
      en: 'Fresh Assam Tea',
    },
    iconEmoji: '☕',
    colorBg: 'bg-stone-100 border-stone-300',
    imgUrl: '/src/assets/images/ner_assam_tea_garden_1790522336349.jpg',
  },
];

interface CardState {
  cardId: number;
  item: HeritageItem;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  patient,
  difficulty,
  selectedLanguage,
  onExit,
}) => {
  const t = TRANSLATIONS[selectedLanguage];

  // Number of unique pairs based on level: level 1 -> 2 pairs (4 cards); level 2-3 -> 3 pairs (6 cards); level 4-5 -> 4 pairs (8 cards)
  const numPairs = difficulty.level <= 1 ? 2 : difficulty.level <= 3 ? 3 : 4;

  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchesFound, setMatchesFound] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [completedSession, setCompletedSession] = useState<SessionRecord | null>(null);

  // Initialize deck
  useEffect(() => {
    initGame();
  }, [difficulty.level]);

  const initGame = () => {
    const selectedItems = HERITAGE_ITEMS.slice(0, numPairs);
    const deck: CardState[] = [];

    selectedItems.forEach((item, index) => {
      deck.push({
        cardId: index * 2,
        item,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        cardId: index * 2 + 1,
        item,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchesFound(0);
    setErrorCount(0);
    setStartTime(Date.now());
    setCompletedSession(null);

    // Initial voice instruction
    audioService.speak(t.games.memoryInstruction, selectedLanguage);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;

    const clickedCard = cards.find(c => c.cardId === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    audioService.playChime();

    // Speak item name in patient's language
    const itemName = clickedCard.item.name[selectedLanguage] || clickedCard.item.name.en;
    audioService.speak(itemName, selectedLanguage);

    const newCards = cards.map(c => (c.cardId === cardId ? { ...c, isFlipped: true } : c));
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = newCards.find(c => c.cardId === newFlipped[0])!;
      const secondCard = newCards.find(c => c.cardId === newFlipped[1])!;

      if (firstCard.item.id === secondCard.item.id) {
        // MATCH!
        setTimeout(() => {
          audioService.playChime();
          const matchedCards = newCards.map(c =>
            c.item.id === firstCard.item.id ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setFlippedCards([]);
          const nextMatches = matchesFound + 1;
          setMatchesFound(nextMatches);

          if (nextMatches === numPairs) {
            handleGameComplete(errorCount);
          }
        }, 600);
      } else {
        // MISMATCH
        setTimeout(() => {
          audioService.playSoftThud();
          const unFlippedCards = newCards.map(c =>
            c.cardId === newFlipped[0] || c.cardId === newFlipped[1]
              ? { ...c, isFlipped: false }
              : c
          );
          setCards(unFlippedCards);
          setFlippedCards([]);
          setErrorCount(prev => prev + 1);
        }, 1100);
      }
    }
  };

  const handleGameComplete = (finalErrors: number) => {
    const elapsedMs = Math.max(3000, Date.now() - startTime);
    const totalMoves = numPairs + finalErrors;
    const accuracy = Math.round((numPairs / totalMoves) * 100);

    const rollingBefore = adaptiveEngine.calculateRollingAverage(
      storageService.getSessions(patient.id),
      'memory'
    );

    // Compute next difficulty via rule engine
    const { nextDifficulty, delta } = adaptiveEngine.computeNextDifficulty(
      difficulty,
      accuracy,
      elapsedMs / totalMoves,
      finalErrors
    );

    const session: SessionRecord = {
      id: `sess-mem-${Date.now()}`,
      patientId: patient.id,
      domain: 'memory',
      gameTemplate: 'Heritage Memory Match',
      timestamp: new Date().toISOString(),
      accuracy,
      responseTimeMs: Math.round(elapsedMs / totalMoves),
      completionRate: 100,
      errorCount: finalErrors,
      difficultyLevel: difficulty.level,
      parametersUsed: {
        timeLimitSec: difficulty.timeLimitSec,
        distractorCount: difficulty.distractorCount,
        itemCount: numPairs * 2,
      },
      rollingAvgBefore: rollingBefore,
      rollingAvgAfter: Math.round((rollingBefore * 4 + accuracy) / 5),
      difficultyDelta: delta,
      synced: false,
    };

    // Save session in local DB
    storageService.saveSession(session);

    // Update patient's domain difficulty in profile
    patient.difficulties.memory = nextDifficulty;
    storageService.savePatient(patient);

    // Evaluate decline alert
    const declineCandidate = adaptiveEngine.evaluateDeclineCandidate(
      patient,
      storageService.getSessions(patient.id),
      'memory'
    );
    if (declineCandidate) {
      storageService.saveAlert(declineCandidate);
    }

    setCompletedSession(session);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Bar with back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-slate-800 font-bold hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-5 h-5 text-amber-800" />
          <span>Exit Game</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            {t.domainNames.memory}
          </span>
          <div className="text-base font-extrabold text-slate-900">
            Level {difficulty.level} ({numPairs} Pairs)
          </div>
        </div>
      </div>

      {/* Voice Prompt Bar */}
      <VoicePromptBar
        promptText={t.games.memoryInstruction}
        selectedLanguage={selectedLanguage}
        className="mb-6"
        onVoiceCommand={(cmd) => {
          if (cmd.toLowerCase().includes('first') || cmd.toLowerCase().includes('one')) {
            handleCardClick(cards[0]?.cardId);
          }
        }}
      />

      {/* Cards Grid */}
      <div
        className={`grid gap-4 sm:gap-6 ${
          numPairs <= 2
            ? 'grid-cols-2 max-w-md mx-auto'
            : numPairs === 3
            ? 'grid-cols-2 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.cardId}
              onClick={() => handleCardClick(card.cardId)}
              disabled={card.isMatched}
              className={`relative min-h-[130px] sm:min-h-[160px] rounded-3xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer shadow-md border-3 select-none ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-400 opacity-90 scale-[0.98]'
                  : isRevealed
                  ? `${card.item.colorBg} scale-102 shadow-lg`
                  : 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-900 hover:scale-101 active:scale-98'
              }`}
              aria-label={
                isRevealed
                  ? `${card.item.name[selectedLanguage]} card`
                  : 'Flipped down heritage card. Tap to reveal.'
              }
            >
              {isRevealed ? (
                <>
                  {card.item.imgUrl ? (
                    <img
                      src={card.item.imgUrl}
                      alt={card.item.name[selectedLanguage]}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl mb-2 shadow-xs border border-white"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-xs">
                      {card.item.iconEmoji}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                    {card.item.name[selectedLanguage]}
                  </span>
                  {card.isMatched && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-amber-100">
                  <span className="text-3xl sm:text-4xl mb-1">🪷</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-100/90 tracking-wide">
                    Tap to open
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Result Modal */}
      {completedSession && (
        <GameResultModal
          session={completedSession}
          domain="memory"
          selectedLanguage={selectedLanguage}
          onReturnHome={onExit}
        />
      )}
    </div>
  );
};
