import React, { useEffect, useState } from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, Volume2, X } from 'lucide-react';
import { LanguageCode, PatientProfile } from '../../types';
import { audioService } from '../../services/audioService';
import { TRANSLATIONS } from '../../locales/translations';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  selectedLanguage: LanguageCode;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  patient,
  selectedLanguage,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[selectedLanguage];
  const [calledContact, setCalledContact] = useState<string | null>(null);

  useEffect(() => {
    audioService.playSosAlarm();
    const prompt = `Emergency assistance mode activated. Alerting caregiver ${patient.caregiverName}.`;
    audioService.speak(prompt, selectedLanguage);
  }, []);

  const handleCall = (name: string, phone: string) => {
    audioService.playChime();
    setCalledContact(name);
    audioService.speak(`Calling ${name} at ${phone}`, selectedLanguage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/80 backdrop-blur-xs animate-in zoom-in-95 duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-rose-600 text-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-900/30 animate-pulse">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-black text-rose-700 uppercase tracking-widest">
                Priority Distress Call
              </span>
              <h2 className="text-2xl font-black text-slate-950">
                {t.sosEmergency}
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

        <p className="text-base font-bold text-rose-900 bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-6">
          Help is arriving. Tap below to immediately call your family caregiver or local ASHA health worker.
        </p>

        {calledContact && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 text-center mb-4">
            <span className="text-xs font-bold text-emerald-800">
              📞 Connecting call to {calledContact}...
            </span>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {/* Caregiver Contact */}
          <button
            onClick={() => handleCall(patient.caregiverName, patient.caregiverPhone)}
            className="w-full min-h-[72px] rounded-2xl bg-rose-600 hover:bg-rose-700 text-white p-4 flex items-center justify-between text-left shadow-lg shadow-rose-900/20 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div>
              <span className="text-xs text-rose-200 font-bold block uppercase">
                Primary Family Caregiver
              </span>
              <span className="text-xl font-black block">
                {patient.caregiverName}
              </span>
              <span className="text-sm text-rose-100 font-mono">
                {patient.caregiverPhone}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <PhoneCall className="w-6 h-6" />
            </div>
          </button>

          {/* ASHA Health Worker Contact */}
          <button
            onClick={() => handleCall(patient.ashaWorkerName, patient.ashaWorkerPhone)}
            className="w-full min-h-[72px] rounded-2xl bg-amber-700 hover:bg-amber-800 text-white p-4 flex items-center justify-between text-left shadow-lg shadow-amber-900/20 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div>
              <span className="text-xs text-amber-200 font-bold block uppercase">
                Sub-Centre ASHA Health Worker
              </span>
              <span className="text-xl font-black block">
                {patient.ashaWorkerName}
              </span>
              <span className="text-sm text-amber-100 font-mono">
                {patient.ashaWorkerPhone}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <PhoneCall className="w-6 h-6" />
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full min-h-[52px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors cursor-pointer"
        >
          Cancel Distress Call
        </button>
      </div>
    </div>
  );
};
