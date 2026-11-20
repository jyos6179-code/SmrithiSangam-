import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Check, Clock, Home, Sparkles, TrendingUp } from 'lucide-react';
import { CognitiveDomain, LanguageCode, SessionRecord } from '../../types';
import { audioService } from '../../services/audioService';
import { TRANSLATIONS } from '../../locales/translations';

interface GameResultModalProps {
  session: SessionRecord;
  domain: CognitiveDomain;
  selectedLanguage: LanguageCode;
  onReturnHome: () => void;
  onPlayAgain?: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  session,
  domain,
  selectedLanguage,
  onReturnHome,
  onPlayAgain,
}) => {
  const t = TRANSLATIONS[selectedLanguage];

  useEffect(() => {
    audioService.playVictory();

    // Pleasant celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d97706', '#059669', '#2563eb', '#f59e0b'],
      });
    } catch {
      // safe
    }

    // Audio praise in patient's native dialect
    const praiseText = `${t.wellDone}! ${session.accuracy >= 80 ? 'Wonderful accuracy!' : 'Good exercise practice today.'}`;
    audioService.speak(praiseText, selectedLanguage);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-300 text-center text-slate-900">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border-4 border-emerald-200 shadow-md">
          <Award className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-amber-800 tracking-wider">
          {t.domainNames[domain]}
        </span>
        <h2 className="text-3xl font-extrabold text-slate-950 mt-1 mb-2">
          {t.wellDone}
        </h2>
        <p className="text-base text-slate-600 mb-6">
          You completed today's exercise with steady effort.
        </p>

        {/* Big metrics cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <span className="text-xs font-bold text-amber-900 flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Accuracy
            </span>
            <div className="text-3xl font-black text-amber-950 mt-1 tabular-nums">
              {session.accuracy}%
            </div>
            <span className="text-[11px] text-amber-800/70">
              {session.errorCount === 0 ? 'Zero Errors' : `${session.errorCount} minor errors`}
            </span>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Avg Speed
            </span>
            <div className="text-3xl font-black text-emerald-950 mt-1 tabular-nums">
              {(session.responseTimeMs / 1000).toFixed(1)}s
            </div>
            <span className="text-[11px] text-emerald-800/70">Comfortable pace</span>
          </div>
        </div>

        {/* Adaptive AI Feedback */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Rule-Based Adaptive Adjustment</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {session.accuracy >= 80
              ? 'Great performance! The cognitive engine recorded this strong result to maintain your stimulation trajectory.'
              : 'Well practiced! The cognitive engine will keep visual distractors gentle to ensure a calming routine next time.'}
          </p>
        </div>

        {/* Big single action button (≥ 64px height) */}
        <button
          onClick={onReturnHome}
          className="w-full min-h-[64px] rounded-2xl bg-amber-700 hover:bg-amber-800 active:scale-[0.99] text-white text-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-amber-900/20 transition-all cursor-pointer"
        >
          <Home className="w-7 h-7" />
          <span>{t.returnHome}</span>
        </button>
      </div>
    </div>
  );
};
