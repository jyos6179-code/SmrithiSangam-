import React, { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles, Target } from 'lucide-react';
import { DomainDifficulty, LanguageCode, PatientProfile, SessionRecord } from '../../types';
import { audioService } from '../../services/audioService';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { storageService } from '../../services/storageService';
import { TRANSLATIONS } from '../../locales/translations';
import { VoicePromptBar } from '../common/VoicePromptBar';
import { GameResultModal } from './GameResultModal';

interface AttentionGameProps {
  patient: PatientProfile;
  difficulty: DomainDifficulty;
  selectedLanguage: LanguageCode;
  onExit: () => void;
}

interface AttentionRound {
  targetIndex: number;
  items: {
    id: string;
    isTarget: boolean;
    iconEmoji: string;
    label: string;
    bgColor: string;
  }[];
}

export const AttentionGame: React.FC<AttentionGameProps> = ({
  patient,
  difficulty,
  selectedLanguage,
  onExit,
}) => {
  const t = TRANSLATIONS[selectedLanguage];
  const totalRounds = 3;

  const [currentRound, setCurrentRound] = useState(0);
  const [roundData, setRoundData] = useState<AttentionRound | null>(null);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const [totalErrors, setTotalErrors] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [completedSession, setCompletedSession] = useState<SessionRecord | null>(null);

  // Distractors scale directly with difficulty level
  const distractorCount = difficulty.distractorCount;

  useEffect(() => {
    generateRound(0);
    audioService.speak(t.games.attentionInstruction, selectedLanguage);
  }, [difficulty.level]);

  const generateRound = (roundIdx: number) => {
    const distractors = distractorCount;
    const totalItems = distractors + 1;
    const targetIdx = Math.floor(Math.random() * totalItems);

    // Cultural stimuli themes:
    // Round 0: Assam Tea Foliage: Golden two-leaves-and-a-bud vs regular green leaf
    // Round 1: Traditional Crafts: Colorful Red Gamusa vs neutral cloths
    // Round 2: North Eastern Birds: Bright Hornbill vs regular sparrows
    const themes = [
      {
        target: { iconEmoji: '✨🌱', label: 'Golden Tea Shoot', bgColor: 'bg-amber-100 border-amber-400' },
        distractor: { iconEmoji: '🍃', label: 'Green Leaf', bgColor: 'bg-emerald-50 border-emerald-300' },
      },
      {
        target: { iconEmoji: '🧣', label: 'Assamese Gamusa', bgColor: 'bg-rose-100 border-rose-400' },
        distractor: { iconEmoji: '⚪', label: 'Plain Cloth', bgColor: 'bg-slate-100 border-slate-300' },
      },
      {
        target: { iconEmoji: '🦜', label: 'Great Hornbill', bgColor: 'bg-amber-100 border-amber-500' },
        distractor: { iconEmoji: '🐦', label: 'Common Bird', bgColor: 'bg-sky-50 border-sky-300' },
      }
    ];

    const currentTheme = themes[roundIdx % themes.length];
    const items = [];

    for (let i = 0; i < totalItems; i++) {
      if (i === targetIdx) {
        items.push({
          id: `target-${i}`,
          isTarget: true,
          iconEmoji: currentTheme.target.iconEmoji,
          label: currentTheme.target.label,
          bgColor: currentTheme.target.bgColor,
        });
      } else {
        items.push({
          id: `distractor-${i}`,
          isTarget: false,
          iconEmoji: currentTheme.distractor.iconEmoji,
          label: currentTheme.distractor.label,
          bgColor: currentTheme.distractor.bgColor,
        });
      }
    }

    setRoundData({
      targetIndex: targetIdx,
      items,
    });
    setRoundStartTime(Date.now());
  };

  const handleItemClick = (isTarget: boolean) => {
    const responseTime = Date.now() - roundStartTime;

    if (isTarget) {
      audioService.playChime();
      audioService.speak(t.games.attentionFound, selectedLanguage);
      setLatencies(prev => [...prev, responseTime]);

      if (currentRound + 1 < totalRounds) {
        setCurrentRound(prev => prev + 1);
        setTimeout(() => {
          generateRound(currentRound + 1);
        }, 500);
      } else {
        handleGameComplete(totalErrors, [...latencies, responseTime]);
      }
    } else {
      audioService.playSoftThud();
      setTotalErrors(prev => prev + 1);
    }
  };

  const handleGameComplete = (finalErrors: number, allLatencies: number[]) => {
    const avgResponseTime = Math.round(
      allLatencies.reduce((a, b) => a + b, 0) / Math.max(1, allLatencies.length)
    );

    const accuracy = Math.max(20, Math.round(100 - (finalErrors * 25)));
    const rollingBefore = adaptiveEngine.calculateRollingAverage(
      storageService.getSessions(patient.id),
      'attention'
    );

    const { nextDifficulty, delta } = adaptiveEngine.computeNextDifficulty(
      difficulty,
      accuracy,
      avgResponseTime,
      finalErrors
    );

    const session: SessionRecord = {
      id: `sess-att-${Date.now()}`,
      patientId: patient.id,
      domain: 'attention',
      gameTemplate: 'Selective Tea Garden Focus',
      timestamp: new Date().toISOString(),
      accuracy,
      responseTimeMs: avgResponseTime,
      completionRate: 100,
      errorCount: finalErrors,
      difficultyLevel: difficulty.level,
      parametersUsed: {
        timeLimitSec: difficulty.timeLimitSec,
        distractorCount: difficulty.distractorCount,
        itemCount: roundData ? roundData.items.length : 6,
      },
      rollingAvgBefore: rollingBefore,
      rollingAvgAfter: Math.round((rollingBefore * 4 + accuracy) / 5),
      difficultyDelta: delta,
      synced: false,
    };

    storageService.saveSession(session);
    patient.difficulties.attention = nextDifficulty;
    storageService.savePatient(patient);

    const declineCandidate = adaptiveEngine.evaluateDeclineCandidate(
      patient,
      storageService.getSessions(patient.id),
      'attention'
    );
    if (declineCandidate) {
      storageService.saveAlert(declineCandidate);
    }

    setCompletedSession(session);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Header */}
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
            {t.domainNames.attention}
          </span>
          <div className="text-base font-extrabold text-slate-900">
            Round {currentRound + 1} of {totalRounds} · Level {difficulty.level}
          </div>
        </div>
      </div>

      {/* Voice Prompt Bar */}
      <VoicePromptBar
        promptText={t.games.attentionInstruction}
        selectedLanguage={selectedLanguage}
        className="mb-6"
      />

      {/* Tea Garden Visual Canvas with High Contrast Items */}
      <div className="relative bg-gradient-to-b from-emerald-100/80 via-emerald-50/60 to-amber-50/90 rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-md min-h-[360px] flex flex-col justify-center">
        {/* Subtle Tea Garden Scenery Backdrop */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-800 text-white text-xs font-bold tracking-wide">
            🌱 Assam Tea Garden Canopy · Find the Unique Highlight
          </span>
        </div>

        {roundData && (
          <div
            className={`grid gap-4 sm:gap-6 justify-center mx-auto ${
              roundData.items.length <= 4
                ? 'grid-cols-2 sm:grid-cols-4 max-w-xl'
                : roundData.items.length <= 6
                ? 'grid-cols-2 sm:grid-cols-3 max-w-xl'
                : 'grid-cols-3 sm:grid-cols-4 max-w-2xl'
            }`}
          >
            {roundData.items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.isTarget)}
                className={`min-h-[110px] sm:min-h-[140px] rounded-3xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer shadow-md border-3 select-none hover:scale-103 active:scale-95 ${item.bgColor}`}
                aria-label={`Foliage item ${idx + 1}`}
              >
                <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-xs">
                  {item.iconEmoji}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result Modal */}
      {completedSession && (
        <GameResultModal
          session={completedSession}
          domain="attention"
          selectedLanguage={selectedLanguage}
          onReturnHome={onExit}
        />
      )}
    </div>
  );
};
