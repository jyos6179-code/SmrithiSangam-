import React, { useEffect } from 'react';
import { Coffee, Heart, Home, Sparkles } from 'lucide-react';
import { LanguageCode } from '../../types';
import { audioService } from '../../services/audioService';
import { TRANSLATIONS } from '../../locales/translations';

interface SessionFatigueModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: LanguageCode;
}

export const SessionFatigueModal: React.FC<SessionFatigueModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[selectedLanguage];

  useEffect(() => {
    audioService.playChime();
    const prompt = `${t.sessionCapNotice} ${t.restWarmWater}`;
    audioService.speak(prompt, selectedLanguage);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-300 text-center text-slate-900">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 border-4 border-amber-200 shadow-md">
          <Coffee className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">
          Cognitive Fatigue Prevention (SIH26003)
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 mb-2">
          {t.sessionCapNotice}
        </h2>
        <p className="text-base text-slate-700 leading-relaxed mb-6 font-medium">
          {t.restWarmWater}
        </p>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-left text-xs text-amber-900 mb-6 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>Gentle Rest Protocol</span>
          </div>
          <p>
            Sessions are intentionally capped at 8 minutes. Short, enjoyable daily practice prevents mental exhaustion and protects cognitive baseline accuracy.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full min-h-[64px] rounded-2xl bg-amber-700 hover:bg-amber-800 text-white text-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-amber-900/20 cursor-pointer transition-transform active:scale-[0.99]"
        >
          <Home className="w-6 h-6" />
          <span>{t.returnHome}</span>
        </button>
      </div>
    </div>
  );
};
