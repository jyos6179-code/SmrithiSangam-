import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, RefreshCw } from 'lucide-react';
import { DomainDifficulty, LanguageCode, PatientProfile, SessionRecord } from '../../types';
import { audioService } from '../../services/audioService';
import { adaptiveEngine } from '../../services/adaptiveEngine';
import { storageService } from '../../services/storageService';
import { TRANSLATIONS } from '../../locales/translations';
import { VoicePromptBar } from '../common/VoicePromptBar';
import { GameResultModal } from './GameResultModal';

interface RoutineRecallGameProps {
  patient: PatientProfile;
  difficulty: DomainDifficulty;
  selectedLanguage: LanguageCode;
  onExit: () => void;
}

interface RoutineStep {
  correctStepNumber: number; // 1, 2, 3, 4
  text: Record<LanguageCode, string>;
  iconEmoji: string;
}

const TEA_SCENARIO: {
  title: Record<LanguageCode, string>;
  steps: RoutineStep[];
} = {
  title: {
    as: 'অসমীয়া কড়ক মচলা চাহ বনোৱাৰ ক্ৰম',
    mni: 'অসাম মশলা চা শাবগী পরিং',
    kha: 'Rukom Shet Sha Assam',
    lus: 'Assam Thingpui Lum Dan Indawt',
    hi: 'पारंपरिक असमिया मसाला चाय बनाने का क्रम',
    en: 'Brewing Authentic Assam Spiced Tea',
  },
  steps: [
    {
      correctStepNumber: 1,
      text: {
        as: '১. আদা আৰু ইলাচী খুন্দি লওক',
        mni: '১. য়াংঙৌ অমসুং ইলাইচি তেকথোকপা',
        kha: '1. Shut ia u sning bad u sla sha',
        lus: '1. Sawhthing leh thakthing chhut sawm',
        hi: '1. ताजा अदरक और इलायची को कूटें',
        en: '1. Crush fresh ginger & cardamom',
      },
      iconEmoji: '🫚',
    },
    {
      correctStepNumber: 2,
      text: {
        as: '২. কেতলিত পানী উতলাওক',
        mni: '২. কৈতলদা ঈশিং পুথোকপা',
        kha: '2. Shetthet ia ka um ba khluit',
        lus: '2. Belah tui chhuang so phawt rawh',
        hi: '2. केतली में साफ पानी उबालें',
        en: '2. Boil fresh water in kettle',
      },
      iconEmoji: '🫖',
    },
    {
      correctStepNumber: 3,
      text: {
        as: '৩. কড়ক অসমীয়া চাহপাত দিয়ক',
        mni: '৩. অসাম চা-মনা হাপ্পা',
        kha: '3. Theh ia u sla sha Assam',
        lus: '3. Assam thingpui hnah thlak rawh',
        hi: '3. कड़क असमिया चायपत्ती डालकर पकाएं',
        en: '3. Add bold Assam CTC tea leaves',
      },
      iconEmoji: '🍃',
    },
    {
      correctStepNumber: 4,
      text: {
        as: '৪. গাখীৰ দি চেকনীত বাকক',
        mni: '৪. শঙ্গোম হাপ্লগা চা চেনবা',
        kha: '4. Theh dud bad jiar sha ka khuri',
        lus: '4. Bawnghnute leih la, noah thli rawh',
        hi: '4. ताजा दूध मिलाएं और प्याले में छानें',
        en: '4. Pour fresh milk and strain into cup',
      },
      iconEmoji: '☕',
    },
  ],
};

export const RoutineRecallGame: React.FC<RoutineRecallGameProps> = ({
  patient,
  difficulty,
  selectedLanguage,
  onExit,
}) => {
  const t = TRANSLATIONS[selectedLanguage];

  const [shuffledSteps, setShuffledSteps] = useState<RoutineStep[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<number[]>([]); // list of step numbers tapped
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [completedSession, setCompletedSession] = useState<SessionRecord | null>(null);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    // Shuffle steps so they are not in order 1, 2, 3, 4
    const shuffled = [...TEA_SCENARIO.steps].sort(() => Math.random() - 0.5);
    setShuffledSteps(shuffled);
    setSelectedSequence([]);
    setErrorCount(0);
    setStartTime(Date.now());
    setCompletedSession(null);

    audioService.speak(t.games.routineInstruction, selectedLanguage);
  };

  const handleStepTap = (step: RoutineStep) => {
    // Check if already tapped
    if (selectedSequence.includes(step.correctStepNumber)) return;

    const nextRequiredStep = selectedSequence.length + 1;
    const stepName = step.text[selectedLanguage] || step.text.en;

    audioService.speak(stepName, selectedLanguage);

    if (step.correctStepNumber === nextRequiredStep) {
      // Correct step
      audioService.playChime();
      const updated = [...selectedSequence, step.correctStepNumber];
      setSelectedSequence(updated);

      if (updated.length === TEA_SCENARIO.steps.length) {
        // Complete!
        audioService.speak(t.games.routineCorrectOrder, selectedLanguage);
        handleGameComplete(errorCount);
      }
    } else {
      // Out of order
      audioService.playSoftThud();
      setErrorCount(prev => prev + 1);

      // Helpful audio hint
      const hint = `Try to think: what should come at Step ${nextRequiredStep}?`;
      setTimeout(() => {
        audioService.speak(hint, selectedLanguage);
      }, 700);
    }
  };

  const handleReset = () => {
    setSelectedSequence([]);
    audioService.playSoftThud();
  };

  const handleGameComplete = (finalErrors: number) => {
    const elapsedMs = Math.max(4000, Date.now() - startTime);
    const accuracy = Math.max(30, Math.round(100 - (finalErrors * 20)));

    const rollingBefore = adaptiveEngine.calculateRollingAverage(
      storageService.getSessions(patient.id),
      'routine'
    );

    const { nextDifficulty, delta } = adaptiveEngine.computeNextDifficulty(
      difficulty,
      accuracy,
      elapsedMs / 4,
      finalErrors
    );

    const session: SessionRecord = {
      id: `sess-rout-${Date.now()}`,
      patientId: patient.id,
      domain: 'routine',
      gameTemplate: 'Daily Sequence Ordering',
      timestamp: new Date().toISOString(),
      accuracy,
      responseTimeMs: Math.round(elapsedMs / 4),
      completionRate: 100,
      errorCount: finalErrors,
      difficultyLevel: difficulty.level,
      parametersUsed: {
        timeLimitSec: difficulty.timeLimitSec,
        distractorCount: difficulty.distractorCount,
        itemCount: 4,
      },
      rollingAvgBefore: rollingBefore,
      rollingAvgAfter: Math.round((rollingBefore * 4 + accuracy) / 5),
      difficultyDelta: delta,
      synced: false,
    };

    storageService.saveSession(session);
    patient.difficulties.routine = nextDifficulty;
    storageService.savePatient(patient);

    const declineCandidate = adaptiveEngine.evaluateDeclineCandidate(
      patient,
      storageService.getSessions(patient.id),
      'routine'
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
            {t.domainNames.routine}
          </span>
          <div className="text-base font-extrabold text-slate-900">
            {TEA_SCENARIO.title[selectedLanguage]}
          </div>
        </div>
      </div>

      {/* Voice Prompt Bar */}
      <VoicePromptBar
        promptText={t.games.routineInstruction}
        selectedLanguage={selectedLanguage}
        className="mb-6"
      />

      {/* Sequence Progress slots (1, 2, 3, 4) */}
      <div className="bg-amber-100/60 rounded-3xl p-4 sm:p-6 border-2 border-amber-300 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-bold text-amber-900">
            Order Progress ({selectedSequence.length}/4 Steps Completed)
          </span>
          {selectedSequence.length > 0 && selectedSequence.length < 4 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start Sequence Over</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[1, 2, 3, 4].map((stepNum) => {
            const isCompleted = selectedSequence.includes(stepNum);
            const stepItem = TEA_SCENARIO.steps.find(s => s.correctStepNumber === stepNum);

            return (
              <div
                key={stepNum}
                className={`min-h-[70px] sm:min-h-[85px] rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102'
                    : 'bg-white/80 border-dashed border-amber-300 text-amber-900/50'
                }`}
              >
                <div className="text-xs font-black uppercase">Step {stepNum}</div>
                {isCompleted && stepItem ? (
                  <div className="flex items-center gap-1 mt-1 text-sm font-bold">
                    <span>{stepItem.iconEmoji}</span>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-xs font-semibold mt-1">Tap Below</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Cards to Tap */}
      <div className="space-y-3 sm:space-y-4">
        {shuffledSteps.map((step) => {
          const isDone = selectedSequence.includes(step.correctStepNumber);

          return (
            <button
              key={step.correctStepNumber}
              onClick={() => handleStepTap(step)}
              disabled={isDone}
              className={`w-full min-h-[72px] sm:min-h-[84px] rounded-2xl p-4 sm:p-5 flex items-center justify-between text-left transition-all duration-200 cursor-pointer shadow-sm border-2 select-none ${
                isDone
                  ? 'bg-emerald-50 border-emerald-400 opacity-60'
                  : 'bg-white hover:bg-amber-50 border-amber-300 hover:border-amber-500 active:scale-[0.99] shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                  {step.iconEmoji}
                </span>
                <span className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {step.text[selectedLanguage]}
                </span>
              </div>

              {isDone && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[3]" />
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
          domain="routine"
          selectedLanguage={selectedLanguage}
          onReturnHome={onExit}
        />
      )}
    </div>
  );
};
