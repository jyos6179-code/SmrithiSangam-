import React, { useState } from 'react';
import { Award, CheckCircle, Clock, Sparkles, X } from 'lucide-react';
import { CognitiveDomain, DomainDifficulty, PatientProfile } from '../../types';
import { audioService } from '../../services/audioService';

interface BaselineAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  onSaveBaselines: (patient: PatientProfile) => void;
}

export const BaselineAssessmentModal: React.FC<BaselineAssessmentModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSaveBaselines,
}) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);

  // Assessment answers
  const [orientationScore, setOrientationScore] = useState(3); // max 3
  const [wordRegistrationScore, setWordRegistrationScore] = useState(3); // max 3
  const [attentionScore, setAttentionScore] = useState(2); // max 2
  const [objectRecognitionScore, setObjectRecognitionScore] = useState(3); // max 3
  const [delayedRecallScore, setDelayedRecallScore] = useState(2); // max 3

  const steps = [
    {
      title: 'Step 1: Temporal & Spatial Orientation',
      instruction: 'Ask the elder: 1) What year is it? 2) What season or festival is approaching (e.g. Bihu / Chapchar Kut)? 3) What town/state are we currently in?',
      score: orientationScore,
      setScore: setOrientationScore,
      max: 3,
      domainImpact: 'Routine & Executive Function',
    },
    {
      title: 'Step 2: Immediate 3-Word Memory Registration',
      instruction: 'Caregiver clearly reads aloud 3 culturally familiar words: "Tea Leaf", "Japi", "Brahmaputra". Have the elder repeat them immediately.',
      score: wordRegistrationScore,
      setScore: setWordRegistrationScore,
      max: 3,
      domainImpact: 'Short-Term Memory',
    },
    {
      title: 'Step 3: Sustained Attention & Number Sequencing',
      instruction: 'Ask the elder to count backward from 20 by 2s (20, 18, 16, 14, 12) or recite days of week in reverse order.',
      score: attentionScore,
      setScore: setAttentionScore,
      max: 2,
      domainImpact: 'Visual Attention & Working Memory',
    },
    {
      title: 'Step 4: North Eastern Cultural Object Recognition',
      instruction: 'Show pictures of: 1) Kaziranga Rhino, 2) Assamese Japi or Mizo Puan, 3) Living Root Bridge. Score for correct identification without hints.',
      score: objectRecognitionScore,
      setScore: setObjectRecognitionScore,
      max: 3,
      domainImpact: 'Pattern & Visuospatial Recognition',
    },
    {
      title: 'Step 5: Delayed 3-Word Recall',
      instruction: 'Ask the elder: "A few moments ago, we named three words. Can you tell me any of those three words again?" (Tea Leaf, Japi, Brahmaputra).',
      score: delayedRecallScore,
      setScore: setDelayedRecallScore,
      max: 3,
      domainImpact: 'Longitudinal Memory Consolidation',
    },
  ];

  const handleNext = () => {
    audioService.playChime();
    if (currentStep + 1 < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate normalized domain scores (0 to 100)
      const memoryRaw = (wordRegistrationScore + delayedRecallScore) / 6; // max 6
      const attentionRaw = attentionScore / 2; // max 2
      const routineRaw = orientationScore / 3; // max 3
      const patternRaw = objectRecognitionScore / 3; // max 3

      const domainBaselines: Record<CognitiveDomain, number> = {
        memory: Math.round(memoryRaw * 100),
        attention: Math.round(attentionRaw * 100),
        routine: Math.round(routineRaw * 100),
        pattern: Math.round(patternRaw * 100),
      };

      const baselineScoreOverall = Math.round(
        (domainBaselines.memory + domainBaselines.attention + domainBaselines.routine + domainBaselines.pattern) / 4
      );

      // Determine starting level (1 to 5) for each domain
      const determineLevel = (score: number): number => {
        if (score >= 85) return 3;
        if (score >= 65) return 2;
        return 1;
      };

      const difficulties: Record<CognitiveDomain, DomainDifficulty> = {
        memory: {
          domain: 'memory',
          level: determineLevel(domainBaselines.memory),
          timeLimitSec: 75,
          distractorCount: 4,
          stimulusComplexity: 'simple',
          cueDelaySec: 6,
          consecutiveHighs: 0,
          consecutiveLows: 0,
        },
        attention: {
          domain: 'attention',
          level: determineLevel(domainBaselines.attention),
          timeLimitSec: 60,
          distractorCount: 6,
          stimulusComplexity: 'moderate',
          cueDelaySec: 5,
          consecutiveHighs: 0,
          consecutiveLows: 0,
        },
        routine: {
          domain: 'routine',
          level: determineLevel(domainBaselines.routine),
          timeLimitSec: 75,
          distractorCount: 4,
          stimulusComplexity: 'simple',
          cueDelaySec: 6,
          consecutiveHighs: 0,
          consecutiveLows: 0,
        },
        pattern: {
          domain: 'pattern',
          level: determineLevel(domainBaselines.pattern),
          timeLimitSec: 90,
          distractorCount: 2,
          stimulusComplexity: 'simple',
          cueDelaySec: 8,
          consecutiveHighs: 0,
          consecutiveLows: 0,
        },
      };

      const updatedPatient: PatientProfile = {
        ...patient,
        baselineScoreOverall,
        domainBaselines,
        difficulties,
      };

      onSaveBaselines(updatedPatient);
      audioService.playVictory();
      onClose();
    }
  };

  const active = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                MoCA / MMSE-Aligned Baseline Protocol
              </span>
              <h2 className="text-xl font-bold text-slate-950">
                Baseline Cognitive Assessment
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-amber-700'
                  : idx < currentStep
                  ? 'bg-emerald-600'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-6">
          <span className="text-xs font-bold text-amber-900 block uppercase tracking-wider mb-1">
            {active.title}
          </span>
          <p className="text-sm text-slate-800 font-medium leading-relaxed mb-3">
            {active.instruction}
          </p>
          <span className="text-[11px] font-bold text-amber-800/80 block">
            Target Domain: <strong>{active.domainImpact}</strong>
          </span>
        </div>

        {/* Score selector */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Points Awarded (Elder correctly responded):
          </label>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: active.max + 1 }, (_, i) => i).map((scoreVal) => (
              <button
                key={scoreVal}
                type="button"
                onClick={() => active.setScore(scoreVal)}
                className={`py-3 rounded-xl font-bold text-base border-2 transition-all cursor-pointer ${
                  active.score === scoreVal
                    ? 'bg-amber-700 border-amber-800 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {scoreVal} / {active.max}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full min-h-[52px] rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-900/15 cursor-pointer active:scale-98 transition-transform"
        >
          <span>{currentStep + 1 === steps.length ? 'Finalize Baseline Calibration' : 'Continue to Next Step'}</span>
        </button>
      </div>
    </div>
  );
};
