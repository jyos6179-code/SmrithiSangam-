import React from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
import { LanguageCode, MoodLog, PatientProfile } from '../../types';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { TRANSLATIONS } from '../../locales/translations';

interface MoodCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  selectedLanguage: LanguageCode;
}

export const MoodCheckinModal: React.FC<MoodCheckinModalProps> = ({
  isOpen,
  onClose,
  patient,
  selectedLanguage,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[selectedLanguage];

  const moodOptions: {
    level: 5 | 4 | 3 | 2 | 1;
    emoji: string;
    label: string;
    bgColor: string;
    borderColor: string;
  }[] = [
    { level: 5, emoji: '😊', label: t.moods.level5, bgColor: 'bg-emerald-50', borderColor: 'border-emerald-400' },
    { level: 4, emoji: '🙂', label: t.moods.level4, bgColor: 'bg-teal-50', borderColor: 'border-teal-300' },
    { level: 3, emoji: '😐', label: t.moods.level3, bgColor: 'bg-amber-50', borderColor: 'border-amber-300' },
    { level: 2, emoji: '😕', label: t.moods.level2, bgColor: 'bg-orange-50', borderColor: 'border-orange-300' },
    { level: 1, emoji: '😔', label: t.moods.level1, bgColor: 'bg-rose-50', borderColor: 'border-rose-300' },
  ];

  const handleSelectMood = (opt: typeof moodOptions[0]) => {
    audioService.playChime();

    const moodLog: MoodLog = {
      id: `mood-${Date.now()}`,
      patientId: patient.id,
      timestamp: new Date().toISOString(),
      moodLevel: opt.level,
      label: opt.label,
      spokenFeedback: `Aita selected mood: ${opt.label}`,
    };

    storageService.saveMoodLog(moodLog);

    const feedback = `${opt.label}. ${t.restWarmWater}`;
    audioService.speak(feedback, selectedLanguage);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-300 text-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-amber-700" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                Daily Wellbeing Check-In
              </span>
              <h2 className="text-xl font-bold text-slate-950">
                {t.moodCheckinTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Tap the face that best reflects your feelings right now.
        </p>

        <div className="space-y-3">
          {moodOptions.map((opt) => (
            <button
              key={opt.level}
              onClick={() => handleSelectMood(opt)}
              className={`w-full min-h-[68px] rounded-2xl p-4 flex items-center gap-4 text-left transition-all border-2 cursor-pointer shadow-xs hover:scale-101 active:scale-98 ${opt.bgColor} ${opt.borderColor}`}
            >
              <span className="text-4xl filter drop-shadow-xs">{opt.emoji}</span>
              <span className="text-lg font-bold text-slate-900 leading-snug">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
