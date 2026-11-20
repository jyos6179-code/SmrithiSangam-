import React, { useState } from 'react';
import { Camera, CheckCircle, Clock, Pill, Sparkles, X } from 'lucide-react';
import { LanguageCode, ReminderItem } from '../../types';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { TRANSLATIONS } from '../../locales/translations';

interface MedicationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: ReminderItem | null;
  selectedLanguage: LanguageCode;
}

export const MedicationConfirmModal: React.FC<MedicationConfirmModalProps> = ({
  isOpen,
  onClose,
  reminder,
  selectedLanguage,
}) => {
  if (!isOpen || !reminder) return null;

  const t = TRANSLATIONS[selectedLanguage];
  const [photoProof, setPhotoProof] = useState<string | null>(reminder.photoProofUrl || null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleSimulateCapture = () => {
    setIsCapturing(true);
    audioService.playChime();

    // Simulate instant capture of pill blister strip / medicine glass
    setTimeout(() => {
      // Use authentic regional craft / medicine representation image
      const mockPhoto = '/src/assets/images/ner_bamboo_craft_japi_1790522364386.jpg';
      setPhotoProof(mockPhoto);
      setIsCapturing(false);
      audioService.speak(t.photoConfirmed, selectedLanguage);
    }, 800);
  };

  const handleConfirmIntake = () => {
    audioService.playVictory();
    storageService.confirmReminderTaken(reminder.id, photoProof || undefined);

    const feedback = `${t.iTookThis}! ${t.photoConfirmed}.`;
    audioService.speak(feedback, selectedLanguage);

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-300 text-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Memory-Assist Dose Confirmation
              </span>
              <h2 className="text-xl font-bold text-slate-950 leading-tight">
                {reminder.title}
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

        {/* Time and audio cue */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 mb-6">
          <Clock className="w-4 h-4 text-emerald-700" />
          <span>Scheduled Time: <strong>{reminder.time}</strong></span>
        </div>

        {/* Optional / Required Photo Verification Box */}
        {reminder.requirePhotoConfirmation && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-4 text-center mb-6">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              📸 {t.photoProofRequired}
            </span>

            {photoProof ? (
              <div className="relative">
                <img
                  src={photoProof}
                  alt="Dose Verification"
                  className="w-full h-36 object-cover rounded-2xl border-2 border-emerald-400 shadow-sm"
                />
                <span className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulateCapture}
                disabled={isCapturing}
                className="w-full min-h-[56px] rounded-2xl bg-white hover:bg-amber-50 border-2 border-amber-400 text-amber-900 font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Camera className="w-5 h-5 text-amber-700" />
                <span>{isCapturing ? 'Snapping photo...' : t.snapPhoto}</span>
              </button>
            )}
          </div>
        )}

        {/* Large Confirm Button (≥ 64px) */}
        <button
          onClick={handleConfirmIntake}
          className="w-full min-h-[64px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xl font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
        >
          <CheckCircle className="w-7 h-7" />
          <span>{t.confirmTaken}</span>
        </button>
      </div>
    </div>
  );
};
