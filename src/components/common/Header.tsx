import React, { useState } from 'react';
import {
  Activity,
  Download,
  Heart,
  HelpCircle,
  Lock,
  Radio,
  Smartphone,
  User,
  Volume2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { NetworkStatus, storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import { LANGUAGE_METADATA, TRANSLATIONS } from '../../locales/translations';
import { CaregiverIdentityModal } from './CaregiverIdentityModal';
import { ExportCenterModal } from './ExportCenterModal';

interface HeaderProps {
  currentMode: 'patient' | 'caregiver';
  onSwitchMode: (mode: 'patient' | 'caregiver') => void;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  networkStatus: NetworkStatus;
  onNetworkChange: (status: NetworkStatus) => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onOpenDisclaimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSwitchMode,
  selectedLanguage,
  onLanguageChange,
  networkStatus,
  onNetworkChange,
  isDeviceFrame,
  onToggleDeviceFrame,
  onOpenDisclaimer,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [bhashiniActive, setBhashiniActive] = useState(true);

  const t = TRANSLATIONS[selectedLanguage];
  const auth = storageService.getCaregiverAuth();

  const handleCaregiverAccess = () => {
    if (currentMode === 'caregiver') {
      onSwitchMode('patient');
    } else {
      setShowPinModal(true);
      setPinInput('');
      setPinError(false);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234
    if (pinInput === '1234') {
      setShowPinModal(false);
      onSwitchMode('caregiver');
    } else {
      setPinError(true);
      audioService.playSoftThud();
    }
  };

  const handleToggleBhashini = () => {
    const next = !bhashiniActive;
    setBhashiniActive(next);
    audioService.toggleBhashiniMode(next);
    audioService.playChime();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
        {/* Top bar contract: 1 row, 3 zones */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Zone 1: Single text element wordmark + cultural badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSwitchMode('patient')}
              className="text-left group cursor-pointer focus:outline-hidden"
              title="SmrithiSangam Home"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
                  <Heart className="w-4 h-4 fill-white" />
                </span>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none group-hover:text-amber-800 transition-colors">
                    {t.appName}
                  </h1>
                  <span className="text-[11px] text-amber-800/80 font-medium hidden sm:inline">
                    {t.tagline}
                  </span>
                </div>
              </div>
            </button>

            {/* Language Selector written in pure authentic native scripts */}
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
              title="Change Language"
            >
              <option value="as">অসমীয়া</option>
              <option value="mni">মৈতৈলোন্ (ꯃꯤꯇꯩꯂꯣꯟ)</option>
              <option value="kha">Ka Ktien Khasi</option>
              <option value="lus">Mizo ṭawng</option>
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Zone 2: Navigation controls & Network status */}
          <div className="hidden md:flex items-center gap-3 text-xs font-medium text-slate-600">
            {/* Real Signed-In Person / Caregiver Button */}
            <button
              onClick={() => setShowIdentityModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-slate-900 transition-colors cursor-pointer text-xs shadow-2xs"
              title="View and update signed-in person's real name and patient profile"
            >
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-extrabold text-slate-900">{auth.caregiverName}</span>
              <span className="text-amber-800/80 font-medium">({auth.caregiverRelationship || 'Caregiver'})</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600">Elder:</span>
              <span className="font-extrabold text-amber-900">{auth.patientPreferredName || auth.patientName}</span>
            </button>
            {/* Bhashini Voice Indicator */}
            <button
              onClick={handleToggleBhashini}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                bhashiniActive
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
              title="Bhashini NER Speech API Engine (Simulated/Active)"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bhashini Voice: {bhashiniActive ? 'ON' : 'Standard'}</span>
            </button>

            {/* Network / Hill Area Sync Selector */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => onNetworkChange('online')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  networkStatus === 'online' ? 'bg-white text-emerald-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Online with continuous cloud sync"
              >
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span>Online</span>
              </button>

              <button
                onClick={() => onNetworkChange('2g_weak')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  networkStatus === '2g_weak' ? 'bg-white text-amber-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Weak 2G Hill Network - Batched Sync"
              >
                <Radio className="w-3 h-3 text-amber-600" />
                <span>2G Hill</span>
              </button>

              <button
                onClick={() => onNetworkChange('offline')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  networkStatus === 'offline' ? 'bg-white text-rose-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Zero Connectivity - Pure Local DB Mode"
              >
                <WifiOff className="w-3 h-3 text-rose-600" />
                <span>Offline</span>
              </button>
            </div>

            {/* Disclaimer trigger */}
            <button
              onClick={onOpenDisclaimer}
              className="flex items-center gap-1 text-slate-500 hover:text-amber-800 transition-colors cursor-pointer"
              title="Read Medical Disclaimer (SIH26003)"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Disclaimer</span>
            </button>
          </div>

          {/* Zone 3: Primary Actions (Caregiver PIN switch & Device Frame Toggle) */}
          <div className="flex items-center gap-2">
            {/* Low-End Android Phone Simulator Toggle (Crucial for SIH26003 evaluation!) */}
            <button
              onClick={onToggleDeviceFrame}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isDeviceFrame
                  ? 'bg-amber-100 border-amber-400 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle Low-End Android Mobile Device Frame"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-700" />
              <span>{isDeviceFrame ? 'Full View' : 'Android Mobile View'}</span>
            </button>

            {/* Download Files Button (HTML, CSV, JSON) */}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-300 bg-amber-100/90 hover:bg-amber-200 text-amber-950 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              title="Download Patient Data & Clinical Report in HTML, CSV, or JSON File Format"
            >
              <Download className="w-3.5 h-3.5 text-amber-800" />
              <span>Download Files</span>
            </button>

            {/* Caregiver Mode Toggle Button (with PIN lock) */}
            <button
              onClick={handleCaregiverAccess}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs ${
                currentMode === 'caregiver'
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-amber-700 hover:bg-amber-800 text-white'
              }`}
            >
              {currentMode === 'caregiver' ? (
                <>
                  <Activity className="w-3.5 h-3.5" />
                  <span>Exit to Patient Mode</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Caregiver / ASHA Portal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Caregiver PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900">
              Caregiver & ASHA Verification
            </h3>
            <p className="text-xs text-slate-600 text-center mt-1 mb-4">
              Enter 4-digit caregiver security PIN to access clinical analytics and settings (Default PIN: <strong className="font-mono text-amber-800">1234</strong>).
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="• • • •"
                  autoFocus
                  className="w-full text-center text-3xl tracking-widest font-mono py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
                {pinError && (
                  <p className="text-xs text-rose-600 text-center mt-1.5 font-medium">
                    Incorrect PIN. Try 1234.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors cursor-pointer"
                >
                  Unlock Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Caregiver Real Name & Identity Modal */}
      {showIdentityModal && (
        <CaregiverIdentityModal
          isOpen={showIdentityModal}
          onClose={() => setShowIdentityModal(false)}
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
        />
      )}

      {/* Downloadable Files Export Center Modal */}
      {showExportModal && (
        <ExportCenterModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          patient={storageService.getActivePatient()}
          sessions={storageService.getSessions(storageService.getActivePatient()?.id)}
          alerts={storageService.getAlerts(storageService.getActivePatient()?.id)}
          reminders={storageService.getReminders(storageService.getActivePatient()?.id)}
          moodLogs={storageService.getMoodLogs(storageService.getActivePatient()?.id)}
        />
      )}
    </>
  );
};
