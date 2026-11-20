import React, { useEffect, useState } from 'react';
import { CognitiveDomain, LanguageCode, PatientProfile } from './types';
import { NetworkStatus, storageService } from './services/storageService';
import { Header } from './components/common/Header';
import { MedicalDisclaimerModal } from './components/common/MedicalDisclaimerModal';
import { DeviceFrameWrapper } from './components/common/DeviceFrameWrapper';
import { PatientHome } from './components/patient/PatientHome';
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';
import { MemoryGame } from './components/games/MemoryGame';
import { AttentionGame } from './components/games/AttentionGame';
import { RoutineRecallGame } from './components/games/RoutineRecallGame';
import { PatternGame } from './components/games/PatternGame';

export default function App() {
  const [activePatient, setActivePatient] = useState<PatientProfile>(storageService.getActivePatient());
  const [currentMode, setCurrentMode] = useState<'patient' | 'caregiver'>('patient');
  const [activeGameDomain, setActiveGameDomain] = useState<CognitiveDomain | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(activePatient?.language || 'as');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(storageService.getNetworkStatus());
  const [isDeviceFrame, setIsDeviceFrame] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(!storageService.isDisclaimerAccepted());

  useEffect(() => {
    const unsub = storageService.subscribeSync(() => {
      const patient = storageService.getActivePatient();
      setActivePatient(patient);
      if (patient && !selectedLanguage) {
        setSelectedLanguage(patient.language);
      }
      setNetworkStatus(storageService.getNetworkStatus());
    });
    return () => unsub();
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    if (activePatient) {
      activePatient.language = lang;
      storageService.savePatient(activePatient);
    }
  };

  const handleNetworkChange = (status: NetworkStatus) => {
    setNetworkStatus(status);
    storageService.setNetworkStatus(status);
  };

  const handleDisclaimerAccept = () => {
    storageService.setDisclaimerAccepted(true);
    setIsDisclaimerOpen(false);
  };

  const handleLaunchGame = (domain: CognitiveDomain) => {
    setActiveGameDomain(domain);
  };

  const handleExitGame = () => {
    setActiveGameDomain(null);
  };

  // Render current view
  const renderContent = () => {
    if (currentMode === 'caregiver') {
      return (
        <CaregiverDashboard
          onReturnToPatientMode={() => {
            setCurrentMode('patient');
            setActiveGameDomain(null);
          }}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      );
    }

    // Patient Mode
    if (activeGameDomain === 'memory') {
      return (
        <MemoryGame
          patient={activePatient}
          difficulty={activePatient.difficulties.memory}
          selectedLanguage={selectedLanguage}
          onExit={handleExitGame}
        />
      );
    }

    if (activeGameDomain === 'attention') {
      return (
        <AttentionGame
          patient={activePatient}
          difficulty={activePatient.difficulties.attention}
          selectedLanguage={selectedLanguage}
          onExit={handleExitGame}
        />
      );
    }

    if (activeGameDomain === 'routine') {
      return (
        <RoutineRecallGame
          patient={activePatient}
          difficulty={activePatient.difficulties.routine}
          selectedLanguage={selectedLanguage}
          onExit={handleExitGame}
        />
      );
    }

    if (activeGameDomain === 'pattern') {
      return (
        <PatternGame
          patient={activePatient}
          difficulty={activePatient.difficulties.pattern}
          selectedLanguage={selectedLanguage}
          onExit={handleExitGame}
        />
      );
    }

    // Default: Patient Daily Routine Home Screen
    return (
      <PatientHome
        patient={activePatient}
        selectedLanguage={selectedLanguage}
        onLaunchGame={handleLaunchGame}
        onOpenCaregiverMode={() => setCurrentMode('caregiver')}
        onLanguageChange={handleLanguageChange}
      />
    );
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-900 flex flex-col font-sans">
      <Header
        currentMode={currentMode}
        onSwitchMode={(mode) => {
          setCurrentMode(mode);
          setActiveGameDomain(null);
        }}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        networkStatus={networkStatus}
        onNetworkChange={handleNetworkChange}
        isDeviceFrame={isDeviceFrame}
        onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      <DeviceFrameWrapper
        isDeviceFrame={isDeviceFrame}
        networkStatus={networkStatus}
      >
        {renderContent()}
      </DeviceFrameWrapper>

      {/* Mandatory First-Launch and callable Medical Disclaimer (SIH26003) */}
      <MedicalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onAccept={handleDisclaimerAccept}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
}
