import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, Heart, Sparkles, Volume2 } from 'lucide-react';
import { LanguageCode, MoodLog, PatientProfile } from '../../types';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { TRANSLATIONS } from '../../locales/translations';

interface DailyMoodCheckinCardProps {
  patient: PatientProfile;
  selectedLanguage: LanguageCode;
  className?: string;
  compact?: boolean;
}

export const DailyMoodCheckinCard: React.FC<DailyMoodCheckinCardProps> = ({
  patient,
  selectedLanguage,
  className = '',
  compact = false,
}) => {
  const t = TRANSLATIONS[selectedLanguage];
  const [selectedMood, setSelectedMood] = useState<MoodLog | null>(null);
  const [recentLogs, setRecentLogs] = useState<MoodLog[]>([]);
  const [justLogged, setJustLogged] = useState(false);

  useEffect(() => {
    loadMoods();
    const unsub = storageService.subscribeSync(() => {
      loadMoods();
    });
    return () => unsub();
  }, [patient.id]);

  const loadMoods = () => {
    const logs = storageService.getMoodLogs(patient.id);
    setRecentLogs(logs);

    // Check if there is already a mood log from today
    const todayStr = new Date().toDateString();
    const todayLog = logs.find(log => new Date(log.timestamp).toDateString() === todayStr);
    if (todayLog) {
      setSelectedMood(todayLog);
    }
  };

  const emojiOptions: {
    level: 5 | 4 | 3 | 2 | 1;
    emoji: string;
    label: string;
    sublabel: string;
    bgColor: string;
    activeBorder: string;
    textColor: string;
    audioVoiceSnippet: string;
  }[] = [
    {
      level: 5,
      emoji: '😊',
      label: t.moods.level5,
      sublabel: t.moods.level5Sub,
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/90',
      activeBorder: 'border-emerald-500 ring-4 ring-emerald-200/80 bg-emerald-100',
      textColor: 'text-emerald-950',
      audioVoiceSnippet: t.moods.level5Sub
    },
    {
      level: 4,
      emoji: '🙂',
      label: t.moods.level4,
      sublabel: t.moods.level4Sub,
      bgColor: 'bg-teal-50 hover:bg-teal-100/90',
      activeBorder: 'border-teal-500 ring-4 ring-teal-200/80 bg-teal-100',
      textColor: 'text-teal-950',
      audioVoiceSnippet: t.moods.level4Sub
    },
    {
      level: 3,
      emoji: '😐',
      label: t.moods.level3,
      sublabel: t.moods.level3Sub,
      bgColor: 'bg-amber-50 hover:bg-amber-100/90',
      activeBorder: 'border-amber-500 ring-4 ring-amber-200/80 bg-amber-100',
      textColor: 'text-amber-950',
      audioVoiceSnippet: t.moods.level3Sub
    },
    {
      level: 2,
      emoji: '😕',
      label: t.moods.level2,
      sublabel: t.moods.level2Sub,
      bgColor: 'bg-orange-50 hover:bg-orange-100/90',
      activeBorder: 'border-orange-500 ring-4 ring-orange-200/80 bg-orange-100',
      textColor: 'text-orange-950',
      audioVoiceSnippet: t.moods.level2Sub
    },
    {
      level: 1,
      emoji: '😔',
      label: t.moods.level1,
      sublabel: t.moods.level1Sub,
      bgColor: 'bg-rose-50 hover:bg-rose-100/90',
      activeBorder: 'border-rose-500 ring-4 ring-rose-200/80 bg-rose-100',
      textColor: 'text-rose-950',
      audioVoiceSnippet: t.moods.level1Sub
    },
  ];

  const handleSelect = (opt: typeof emojiOptions[0]) => {
    audioService.playChime();

    const newLog: MoodLog = {
      id: `mood-${Date.now()}`,
      patientId: patient.id,
      timestamp: new Date().toISOString(),
      moodLevel: opt.level,
      label: opt.label,
      spokenFeedback: `${patient.preferredName || patient.name}: ${opt.label}`,
    };

    // Store locally alongside session performance records
    storageService.saveMoodLog(newLog);
    setSelectedMood(newLog);
    setJustLogged(true);

    // Warm spoken feedback in patient's dialect
    const spokenFeedback = `${opt.label}. ${t.wellDone}!`;
    audioService.speak(spokenFeedback, selectedLanguage);

    setTimeout(() => {
      setJustLogged(false);
    }, 2500);
  };

  return (
    <section
      className={`bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-md ${className}`}
      aria-label="Daily Mood and Wellbeing Check-in"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
            <Heart className="w-6 h-6 fill-amber-700 text-amber-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
              Daily Emotional Wellbeing (1-Tap Check-In)
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
              {t.moodCheckinTitle}
            </h3>
          </div>
        </div>

        {selectedMood && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Today's Mood: {selectedMood.label} ({new Date(selectedMood.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})
            </span>
          </div>
        )}
      </div>

      {/* Instruction Voice Prompt Cue */}
      <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 rounded-2xl px-4 py-2.5 mb-5 text-xs text-amber-950">
        <p className="font-semibold text-sm">
          {t.moodCheckinSubtitle}
        </p>
        <button
          onClick={() => audioService.speak(t.moodCheckinTitle, selectedLanguage)}
          className="shrink-0 ml-3 p-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 cursor-pointer shadow-xs transition-colors"
          title="Listen to instruction"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* 5 Expressive Emoji Faces Grid (Touch targets ≥ 64px, large typography, high contrast) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {emojiOptions.map((opt) => {
          const isSelected = selectedMood?.moodLevel === opt.level;

          return (
            <button
              key={opt.level}
              onClick={() => handleSelect(opt)}
              className={`min-h-[110px] sm:min-h-[135px] rounded-3xl p-3 sm:p-4 border-3 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer select-none group relative shadow-xs hover:shadow-md active:scale-95 ${
                isSelected
                  ? opt.activeBorder
                  : `${opt.bgColor} border-slate-200/80 hover:border-amber-400`
              }`}
              aria-pressed={isSelected}
              aria-label={`${opt.label} - ${opt.sublabel}`}
            >
              {/* Selected Badge Check */}
              {isSelected && (
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}

              {/* Expressive Emoji Face */}
              <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-xs group-hover:scale-110 transition-transform">
                {opt.emoji}
              </span>

              {/* Native Dialect Label */}
              <span className={`text-xs sm:text-sm font-extrabold leading-tight ${opt.textColor}`}>
                {opt.label}
              </span>

              {/* Subtitle */}
              <span className="text-[10px] text-slate-500 font-semibold mt-0.5 hidden sm:block">
                {opt.sublabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Confirmation Toast / Feedback Banner */}
      {justLogged && (
        <div className="mt-4 p-3 bg-emerald-600 text-white rounded-2xl text-center text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-200 flex items-center justify-center gap-2 shadow-md">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>Wellbeing logged successfully! Stored locally with today's session records.</span>
        </div>
      )}

      {/* Micro History Timeline (Past 3 check-ins) */}
      {recentLogs.length > 0 && !compact && (
        <div className="mt-5 pt-4 border-t border-amber-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <span className="font-bold text-amber-900">
            Recent Mood Entries on Device:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto">
            {recentLogs.slice(-3).reverse().map((log) => {
              const opt = emojiOptions.find(o => o.level === log.moodLevel);
              return (
                <span
                  key={log.id}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 font-medium text-slate-800 flex items-center gap-1.5 shrink-0"
                >
                  <span className="text-base">{opt?.emoji || '😊'}</span>
                  <span>{log.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    · {new Date(log.timestamp).toLocaleDateString('en-IN', { month: 'numeric', day: 'numeric' })}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
