import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { LanguageCode } from '../../types';
import { audioService } from '../../services/audioService';
import { TRANSLATIONS } from '../../locales/translations';

interface VoicePromptBarProps {
  promptText: string;
  selectedLanguage: LanguageCode;
  autoSpeak?: boolean;
  onVoiceCommand?: (command: string) => void;
  className?: string;
}

export const VoicePromptBar: React.FC<VoicePromptBarProps> = ({
  promptText,
  selectedLanguage,
  autoSpeak = true,
  onVoiceCommand,
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastVoiceRecognized, setLastVoiceRecognized] = useState<string | null>(null);

  const t = TRANSLATIONS[selectedLanguage];

  // Auto-speak prompt when prompt text or language changes
  useEffect(() => {
    if (autoSpeak && promptText) {
      speakNow();
    }
    return () => {
      audioService.stopSpeaking();
    };
  }, [promptText, selectedLanguage]);

  const speakNow = () => {
    setIsSpeaking(true);
    audioService.speak(promptText, selectedLanguage, () => {
      setIsSpeaking(false);
    });
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      audioService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakNow();
    }
  };

  const handleStartListening = () => {
    if (isListening) {
      audioService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setLastVoiceRecognized(null);
    audioService.playChime();

    audioService.startListening(
      (transcript) => {
        setIsListening(false);
        setLastVoiceRecognized(transcript);
        if (onVoiceCommand) {
          onVoiceCommand(transcript);
        }
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <div
      className={`bg-amber-100/90 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm transition-all ${className}`}
      role="region"
      aria-label="Voice Guidance System"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left / Center: Large font spoken prompt with speaker indicator */}
        <div className="flex items-center gap-3.5 flex-1 w-full">
          <button
            onClick={handleToggleSpeak}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md ${
              isSpeaking
                ? 'bg-amber-600 text-white ring-4 ring-amber-300 scale-105'
                : 'bg-white text-amber-800 hover:bg-amber-50 border-2 border-amber-300'
            }`}
            title="Listen to this instruction again"
            aria-label="Listen to voice prompt"
          >
            {isSpeaking ? (
              <div className="flex items-end gap-1 h-6">
                <span className="w-1 bg-white rounded-full animate-voice-wave h-4" />
                <span className="w-1 bg-white rounded-full animate-voice-wave h-6" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 bg-white rounded-full animate-voice-wave h-3" style={{ animationDelay: '0.4s' }} />
                <span className="w-1 bg-white rounded-full animate-voice-wave h-5" style={{ animationDelay: '0.1s' }} />
              </div>
            ) : (
              <Volume2 className="w-7 h-7 sm:w-8 sm:h-8" />
            )}
          </button>

          <div className="flex-1">
            <span className="text-[11px] font-bold text-amber-800 tracking-wider flex items-center gap-1.5">
              <span>{isSpeaking ? t.speakingPrompt : t.listenPrompt}</span>
              {isSpeaking && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              )}
            </span>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight mt-0.5">
              "{promptText}"
            </p>
            {lastVoiceRecognized && (
              <p className="text-xs font-semibold text-emerald-800 mt-1">
                Heard: "{lastVoiceRecognized}"
              </p>
            )}
          </div>
        </div>

        {/* Right: Big Voice Input Action (Speech-to-Text trigger) */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleStartListening}
            className={`min-h-[56px] min-w-[56px] px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm transition-all cursor-pointer shadow-md ${
              isListening
                ? 'bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-2 border-amber-400'
            }`}
            title="Speak a voice command"
            aria-label="Tap to speak"
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 text-white" />
                <span className="text-base font-bold">Listening... Speak now</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 text-amber-700" />
                <span className="text-sm font-bold text-amber-900">Voice Command</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
