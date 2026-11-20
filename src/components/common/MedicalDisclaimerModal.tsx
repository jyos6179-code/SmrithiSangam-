import React from 'react';
import { AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../locales/translations';

interface MedicalDisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
  selectedLanguage: LanguageCode;
}

export const MedicalDisclaimerModal: React.FC<MedicalDisclaimerModalProps> = ({
  isOpen,
  onAccept,
  selectedLanguage,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[selectedLanguage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-200 text-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-800 tracking-wider">
              {t.mDonerHeader} · {t.teamTag}
            </span>
            <h2 className="text-xl font-bold text-slate-950">
              Important Health Notice & Disclaimer
            </h2>
          </div>
        </div>

        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 text-sm text-amber-950 leading-relaxed space-y-2 mb-6">
          <p className="font-semibold text-base text-amber-900">
            {t.medicalDisclaimer}
          </p>
          <div className="text-xs text-amber-900/80 space-y-1.5 pt-1">
            <div className="flex items-start gap-2">
              <span className="text-amber-700 font-bold">•</span>
              <span><strong>Monitoring Support Only:</strong> SmrithiSangam is engineered to provide self-directed cognitive stimulation exercises, routine reminders, and longitudinal behavioral tracking for family caregivers and ASHA community workers.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-700 font-bold">•</span>
              <span><strong>No Clinical Prescription:</strong> It does not replace comprehensive neuropsychological assessments (e.g. clinical MoCA, MMSE, neuroimaging, or physician review).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-700 font-bold">•</span>
              <span><strong>Emergency Protocol:</strong> If an elderly patient shows sudden acute confusion, delirium, slurred speech, or physical distress, contact local emergency healthcare immediately.</span>
            </div>
          </div>
        </div>

        <button
          onClick={onAccept}
          className="w-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-amber-700 hover:bg-amber-800 active:scale-[0.99] text-white text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-900/15 transition-all cursor-pointer"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{t.disclaimerAcknowledge}</span>
        </button>
      </div>
    </div>
  );
};
