import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { DomainDifficulty, LanguageCode, PatientProfile, SessionRecord } from '../../types';
import { audioService } from '../../services/audioService';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { storageService } from '../../services/storageService';
import { TRANSLATIONS } from '../../locales/translations';
import { VoicePromptBar } from '../common/VoicePromptBar';
import { GameResultModal } from './GameResultModal';

interface PatternGameProps {
  patient: PatientProfile;
  difficulty: DomainDifficulty;
  selectedLanguage: LanguageCode;
  onExit: () => void;
}

interface HeritageSilhouetteItem {
  id: string;
  name: Record<LanguageCode, string>;
  stateRegion: string;
  iconEmoji: string;
  imgUrl?: string;
  silhouetteSvg: string; // SVG path representation of the silhouette
}

const REGIONAL_ITEMS: HeritageSilhouetteItem[] = [
  {
    id: 'rhino',
    name: {
      as: 'এশিঙীয়া গঁড়',
      mni: 'এক-শিংগা য়োনো (ꯁꯃꯛ)',
      kha: 'U Kynnah Shing',
      lus: 'Samak Keipui',
      hi: 'काजीरंगा का एक सींग वाला गैंडा',
      en: 'Kaziranga One-Horned Rhino',
    },
    stateRegion: 'Kaziranga, Assam',
    iconEmoji: '🦏',
    silhouetteSvg: 'M 10 50 Q 25 30 50 35 Q 65 25 80 30 Q 90 20 95 32 Q 92 45 88 55 Q 85 70 75 75 L 70 65 L 60 75 L 45 75 L 40 65 L 25 75 L 15 65 Z',
  },
  {
    id: 'root_bridge',
    name: {
      as: 'জীৱন্ত শিপাৰ সাঁকো',
      mni: 'উমীদগী শাবা থোং',
      kha: 'Ka Jingkieng Jri',
      lus: 'Thing Zung Lei',
      hi: 'चेरापूंजी का जीवित जड़ पुल',
      en: 'Cherrapunji Living Root Bridge',
    },
    stateRegion: 'East Khasi Hills, Meghalaya',
    iconEmoji: '🌿',
    imgUrl: '/src/assets/images/ner_living_root_bridge_1790522352073.jpg',
    silhouetteSvg: 'M 5 60 C 20 40 40 45 60 40 C 75 35 90 55 95 60 L 95 65 C 80 50 60 55 40 50 C 20 45 5 70 5 65 Z',
  },
  {
    id: 'japi_hat',
    name: {
      as: 'ফুলজাপি',
      mni: 'জাপি (ꯖꯥꯄꯤ)',
      kha: 'Ka Tupia Japi Khasi',
      lus: 'Zoram Lukhum Japi',
      hi: 'सजी हुई असमिया जापी',
      en: 'Handcrafted Assamese Japi Hat',
    },
    stateRegion: 'Nalbari & Kamrup, Assam',
    iconEmoji: '👒',
    imgUrl: '/src/assets/images/ner_bamboo_craft_japi_1790522364386.jpg',
    silhouetteSvg: 'M 50 15 L 85 75 L 15 75 Z',
  },
  {
    id: 'tea_garden',
    name: {
      as: 'সেউজীয়া চাহ বাগিচা',
      mni: 'চা-মরক (ꯆꯥ-ꯃꯔꯣꯛ)',
      kha: 'Ka Kper Sha',
      lus: 'Thingpui Hmun',
      hi: 'असम का चाय बागान',
      en: 'Rolling Assam Tea Hills',
    },
    stateRegion: 'Dibrugarh & Jorhat, Assam',
    iconEmoji: '🌱',
    imgUrl: '/src/assets/images/ner_assam_tea_garden_1790522336349.jpg',
    silhouetteSvg: 'M 10 70 Q 30 40 50 65 Q 70 45 90 70 Z',
  },
];

export const PatternGame: React.FC<PatternGameProps> = ({
  patient,
  difficulty,
  selectedLanguage,
  onExit,
}) => {
  const t = TRANSLATIONS[selectedLanguage];
  const totalRounds = 3;

  const [currentRound, setCurrentRound] = useState(0);
  const [activeItem, setActiveItem] = useState<HeritageSilhouetteItem>(REGIONAL_ITEMS[0]);
  const [choiceItems, setChoiceItems] = useState<HeritageSilhouetteItem[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const [totalErrors, setTotalErrors] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [completedSession, setCompletedSession] = useState<SessionRecord | null>(null);

  useEffect(() => {
    initRound(0);
    audioService.speak(t.games.patternInstruction, selectedLanguage);
  }, []);

  const initRound = (roundIdx: number) => {
    const target = REGIONAL_ITEMS[roundIdx % REGIONAL_ITEMS.length];
    setActiveItem(target);

    // Pick distractors
    const otherItems = REGIONAL_ITEMS.filter(item => item.id !== target.id);
    const distractors = otherItems.slice(0, 2); // 3 total choices
    const choices = [target, ...distractors].sort(() => Math.random() - 0.5);

    setChoiceItems(choices);
    setRoundStartTime(Date.now());
  };

  const handleChoiceClick = (choice: HeritageSilhouetteItem) => {
    const latency = Date.now() - roundStartTime;

    if (choice.id === activeItem.id) {
      audioService.playChime();
      audioService.speak(t.games.patternMatched, selectedLanguage);
      const updatedLatencies = [...latencies, latency];
      setLatencies(updatedLatencies);

      if (currentRound + 1 < totalRounds) {
        setCurrentRound(prev => prev + 1);
        setTimeout(() => {
          initRound(currentRound + 1);
        }, 600);
      } else {
        handleGameComplete(totalErrors, updatedLatencies);
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

    const accuracy = Math.max(25, Math.round(100 - (finalErrors * 25)));
    const rollingBefore = adaptiveEngine.calculateRollingAverage(
      storageService.getSessions(patient.id),
      'pattern'
    );

    const { nextDifficulty, delta } = adaptiveEngine.computeNextDifficulty(
      difficulty,
      accuracy,
      avgResponseTime,
      finalErrors
    );

    const session: SessionRecord = {
      id: `sess-pat-${Date.now()}`,
      patientId: patient.id,
      domain: 'pattern',
      gameTemplate: 'Heritage Silhouette Match',
      timestamp: new Date().toISOString(),
      accuracy,
      responseTimeMs: avgResponseTime,
      completionRate: 100,
      errorCount: finalErrors,
      difficultyLevel: difficulty.level,
      parametersUsed: {
        timeLimitSec: difficulty.timeLimitSec,
        distractorCount: difficulty.distractorCount,
        itemCount: 3,
      },
      rollingAvgBefore: rollingBefore,
      rollingAvgAfter: Math.round((rollingBefore * 4 + accuracy) / 5),
      difficultyDelta: delta,
      synced: false,
    };

    storageService.saveSession(session);
    patient.difficulties.pattern = nextDifficulty;
    storageService.savePatient(patient);

    const declineCandidate = adaptiveEngine.evaluateDeclineCandidate(
      patient,
      storageService.getSessions(patient.id),
      'pattern'
    );
    if (declineCandidate) {
      storageService.saveAlert(declineCandidate);
    }

    setCompletedSession(session);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Bar */}
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
            {t.domainNames.pattern}
          </span>
          <div className="text-base font-extrabold text-slate-900">
            Silhouette {currentRound + 1} of {totalRounds}
          </div>
        </div>
      </div>

      {/* Voice Prompt Bar */}
      <VoicePromptBar
        promptText={t.games.patternInstruction}
        selectedLanguage={selectedLanguage}
        className="mb-6"
      />

      {/* Silhouette Inspection Showcase Box */}
      <div className="bg-amber-900/90 rounded-3xl p-6 sm:p-8 text-center text-amber-50 border-3 border-amber-950 shadow-lg mb-8 flex flex-col items-center justify-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-2">
          Mystery Regional Silhouette · Look at the Outline
        </span>

        {/* High-contrast Silhouette Frame */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-amber-950/80 border-4 border-amber-600/50 flex items-center justify-center p-4 shadow-inner">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-300 filter drop-shadow-md">
            <path d={activeItem.silhouetteSvg} />
          </svg>
        </div>

        <span className="text-xs font-medium text-amber-200/80 mt-3">
          Region: {activeItem.stateRegion}
        </span>
      </div>

      {/* Choice Cards (≥ 72px touch targets) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {choiceItems.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoiceClick(choice)}
            className="min-h-[96px] sm:min-h-[140px] rounded-3xl p-4 bg-white hover:bg-amber-50/80 border-3 border-amber-300 hover:border-amber-600 active:scale-[0.98] transition-all flex sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-4 cursor-pointer shadow-md"
          >
            {choice.imgUrl ? (
              <img
                src={choice.imgUrl}
                alt={choice.name[selectedLanguage]}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl shadow-xs shrink-0"
              />
            ) : (
              <span className="text-4xl sm:text-5xl filter drop-shadow-xs shrink-0">
                {choice.iconEmoji}
              </span>
            )}
            <div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                {choice.name[selectedLanguage]}
              </div>
              <div className="text-xs text-amber-800 font-semibold mt-0.5">
                {choice.stateRegion}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Result Modal */}
      {completedSession && (
        <GameResultModal
          session={completedSession}
          domain="pattern"
          selectedLanguage={selectedLanguage}
          onReturnHome={onExit}
        />
      )}
    </div>
  );
};
