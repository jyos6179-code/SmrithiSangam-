import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Coffee,
  Heart,
  HelpCircle,
  Lock,
  PhoneCall,
  Play,
  Smile,
  Sparkles,
  Volume2
} from 'lucide-react';
import { CognitiveDomain, LanguageCode, PatientProfile, ReminderItem } from '../../types';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import { TRANSLATIONS } from '../../locales/translations';
import { VoicePromptBar } from '../common/VoicePromptBar';
import { DailyMoodCheckinCard } from './DailyMoodCheckinCard';
import { MoodCheckinModal } from './MoodCheckinModal';
import { MedicationConfirmModal } from './MedicationConfirmModal';
import { EmergencySOSModal } from './EmergencySOSModal';
import { SessionFatigueModal } from './SessionFatigueModal';
import { CaregiverIdentityModal } from '../common/CaregiverIdentityModal';

interface PatientHomeProps {
  patient: PatientProfile;
  selectedLanguage: LanguageCode;
  onLaunchGame: (domain: CognitiveDomain) => void;
  onOpenCaregiverMode: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const PatientHome: React.FC<PatientHomeProps> = ({
  patient,
  selectedLanguage,
  onLaunchGame,
  onOpenCaregiverMode,
  onLanguageChange,
}) => {
  const t = TRANSLATIONS[selectedLanguage];

  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [selectedReminderForConfirm, setSelectedReminderForConfirm] = useState<ReminderItem | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showFatigueModal, setShowFatigueModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [activeSessionMinutes, setActiveSessionMinutes] = useState(3); // Demo showing 3 minutes elapsed of 8 min cap

  // Load reminders for patient
  useEffect(() => {
    loadReminders();
    const unsub = storageService.subscribeSync(() => {
      loadReminders();
    });
    return () => unsub();
  }, [patient.id]);

  const loadReminders = () => {
    const list = storageService.getReminders(patient.id);
    setReminders(list);
  };

  // Get current time & greeting
  const now = new Date();
  const hours = now.getHours();
  let timeGreeting = t.greetingMorning;
  if (hours >= 12 && hours < 17) timeGreeting = t.greetingAfternoon;
  if (hours >= 17) timeGreeting = t.greetingEvening;

  const formattedDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const dailyDomains: {
    domain: CognitiveDomain;
    title: string;
    description: string;
    iconEmoji: string;
    bgGradient: string;
    borderCol: string;
    imgUrl?: string;
  }[] = [
    {
      domain: 'memory',
      title: t.domainNames.memory,
      description: t.domainDescriptions.memory,
      iconEmoji: '🪷',
      bgGradient: 'from-amber-700 to-amber-900',
      borderCol: 'border-amber-900',
      imgUrl: '/src/assets/images/ner_bamboo_craft_japi_1790522364386.jpg',
    },
    {
      domain: 'attention',
      title: t.domainNames.attention,
      description: t.domainDescriptions.attention,
      iconEmoji: '🍃',
      bgGradient: 'from-emerald-700 to-emerald-900',
      borderCol: 'border-emerald-900',
      imgUrl: '/src/assets/images/ner_assam_tea_garden_1790522336349.jpg',
    },
    {
      domain: 'routine',
      title: t.domainNames.routine,
      description: t.domainDescriptions.routine,
      iconEmoji: '☕',
      bgGradient: 'from-stone-700 to-stone-900',
      borderCol: 'border-stone-900',
      imgUrl: '/src/assets/images/ner_living_root_bridge_1790522352073.jpg',
    },
    {
      domain: 'pattern',
      title: t.domainNames.pattern,
      description: t.domainDescriptions.pattern,
      iconEmoji: '🦏',
      bgGradient: 'from-indigo-800 to-indigo-950',
      borderCol: 'border-indigo-950',
      imgUrl: '/src/assets/images/ner_bamboo_craft_japi_1790522364386.jpg',
    },
  ];

  const handleVoiceCommand = (command: string) => {
    const lower = command.toLowerCase();
    if (lower.includes('memory') || lower.includes('match')) {
      onLaunchGame('memory');
    } else if (lower.includes('tea') || lower.includes('attention') || lower.includes('leaf')) {
      onLaunchGame('attention');
    } else if (lower.includes('routine') || lower.includes('step') || lower.includes('order')) {
      onLaunchGame('routine');
    } else if (lower.includes('pattern') || lower.includes('rhino') || lower.includes('shadow')) {
      onLaunchGame('pattern');
    } else if (lower.includes('medicine') || lower.includes('pill')) {
      const pending = reminders.find(r => !r.takenToday);
      if (pending) setSelectedReminderForConfirm(pending);
    } else if (lower.includes('help') || lower.includes('sos') || lower.includes('danger')) {
      setShowSosModal(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Elderly Orientation Header: Big Day, Date & Greeting */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Patient Portrait Cue */}
            <div className="relative">
              <img
                src={patient.photoUrl}
                alt={patient.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-amber-400 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1.5 shadow-xs">
                <CheckCircle className="w-4 h-4" />
              </span>
            </div>

            <div>
              <span className="text-sm font-bold text-amber-900 tracking-wide uppercase">
                {timeGreeting}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                {patient.preferredName || patient.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-base text-slate-700 font-semibold">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>{formattedDate}</span>
              </div>
              <div className="text-xs text-amber-900 font-bold mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" />
                <span>{t.signedInAs} <strong>{patient.caregiverName}</strong></span>
                <span className="text-amber-400">·</span>
                <span>{t.caringFor} <strong>{patient.preferredName || patient.name}</strong></span>
                <button
                  onClick={() => setShowIdentityModal(true)}
                  className="ml-1 px-2 py-0.5 rounded-md bg-amber-200/90 hover:bg-amber-300 text-amber-950 text-[11px] font-black underline cursor-pointer"
                  title="Change who is signed in so your real name is used"
                >
                  Edit / Sign In As You
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar (Mood Check-in & Session Length Gauge) */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowMoodModal(true)}
              className="flex-1 sm:flex-initial min-h-[56px] px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-bold border-2 border-amber-300 flex items-center justify-center gap-2.5 shadow-sm active:scale-98 transition-transform cursor-pointer"
            >
              <Smile className="w-6 h-6 text-amber-700" />
              <span className="text-sm sm:text-base">Mood Check-in</span>
            </button>

            {/* Session Fatigue auto-capping trigger / visualizer */}
            <button
              onClick={() => setShowFatigueModal(true)}
              className="min-h-[56px] px-3.5 py-2.5 rounded-2xl bg-amber-200/70 hover:bg-amber-200 border border-amber-400 text-amber-950 text-xs font-bold flex items-center gap-2 cursor-pointer"
              title="Session duration cap: 8 minutes max to prevent cognitive fatigue"
            >
              <Coffee className="w-4 h-4 text-amber-800" />
              <span>{activeSessionMinutes}/8 min rest timer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Guidance Banner with spoken prompt in chosen dialect */}
      <VoicePromptBar
        promptText={`${timeGreeting}, ${patient.preferredName}. Choose an activity below or tap any reminder.`}
        selectedLanguage={selectedLanguage}
        onVoiceCommand={handleVoiceCommand}
      />

      {/* Daily Mood Check-In Component: 5 expressive emoji faces for elderly wellbeing */}
      <DailyMoodCheckinCard
        patient={patient}
        selectedLanguage={selectedLanguage}
      />

      {/* Today's Activities Queue (The 4 Cognitive Domains - ≥ 64px Touch Targets, 28sp+ Titles) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-8 bg-amber-700 rounded-full inline-block" />
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {t.todaysActivities}
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
            4 Exercises Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {dailyDomains.map((item) => (
            <button
              key={item.domain}
              onClick={() => onLaunchGame(item.domain)}
              className={`min-h-[110px] sm:min-h-[130px] rounded-3xl p-5 sm:p-6 bg-gradient-to-r ${item.bgGradient} text-white shadow-lg shadow-slate-900/15 border-2 ${item.borderCol} flex items-center justify-between text-left group hover:scale-101 active:scale-[0.99] transition-all cursor-pointer`}
              aria-label={`Start ${item.title}`}
            >
              <div className="flex items-center gap-4 sm:gap-5 flex-1 pr-2">
                <span className="text-4xl sm:text-5xl filter drop-shadow-md shrink-0">
                  {item.iconEmoji}
                </span>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black tracking-tight leading-tight group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/80 font-medium line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                    Level {patient.difficulties[item.domain]?.level || 2} · Self-Paced
                  </span>
                </div>
              </div>

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 group-hover:bg-white text-white group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Memory-Assist Reminders Queue (Medications & Hydration) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-8 bg-emerald-700 rounded-full inline-block" />
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {t.todaysReminders}
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
            {reminders.filter(r => r.takenToday).length}/{reminders.length} Completed
          </span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`rounded-3xl p-4 sm:p-5 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm ${
                reminder.takenToday
                  ? 'bg-emerald-50/80 border-emerald-300'
                  : 'bg-white border-amber-300 hover:border-amber-400'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-bold shadow-xs ${
                    reminder.takenToday
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {reminder.category === 'medication' ? '💊' : reminder.category === 'hydration' ? '💧' : '🚶'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                      {reminder.time}
                    </span>
                    {reminder.requirePhotoConfirmation && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                        Photo Required
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-slate-950 leading-snug">
                    {reminder.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {reminder.spokenPromptText}
                  </p>
                </div>
              </div>

              {/* Action Button: ≥64px Touch Target */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => audioService.speak(reminder.spokenPromptText, selectedLanguage)}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                  title="Listen to reminder instruction"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                {reminder.takenToday ? (
                  <div className="min-h-[56px] px-5 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-base flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                    <span>{t.iTookThis}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedReminderForConfirm(reminder)}
                    className="min-h-[56px] px-6 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-base flex items-center gap-2 shadow-md shadow-amber-900/15 cursor-pointer active:scale-98 transition-transform"
                  >
                    <span>{t.confirmTaken}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Big Emergency SOS Button (Always Accessible at Bottom of Patient Screen) */}
      <section className="pt-2">
        <button
          onClick={() => setShowSosModal(true)}
          className="w-full min-h-[72px] sm:min-h-[80px] rounded-3xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white p-5 flex items-center justify-between text-left shadow-xl shadow-rose-900/25 border-3 border-rose-700 transition-all cursor-pointer"
          aria-label="Trigger Emergency Assistance SOS Call"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-md">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs text-rose-200 font-bold uppercase tracking-wider block">
                1-Tap Urgent Connection
              </span>
              <span className="text-2xl sm:text-3xl font-black block tracking-tight">
                {t.sosEmergency}
              </span>
            </div>
          </div>

          <div className="hidden sm:block text-right text-xs text-rose-100 font-medium">
            Alerts {patient.caregiverName} & ASHA
          </div>
        </button>
      </section>

      {/* Modals */}
      {showMoodModal && (
        <MoodCheckinModal
          isOpen={showMoodModal}
          onClose={() => setShowMoodModal(false)}
          patient={patient}
          selectedLanguage={selectedLanguage}
        />
      )}

      {selectedReminderForConfirm && (
        <MedicationConfirmModal
          isOpen={!!selectedReminderForConfirm}
          onClose={() => setSelectedReminderForConfirm(null)}
          reminder={selectedReminderForConfirm}
          selectedLanguage={selectedLanguage}
        />
      )}

      {showSosModal && (
        <EmergencySOSModal
          isOpen={showSosModal}
          onClose={() => setShowSosModal(false)}
          patient={patient}
          selectedLanguage={selectedLanguage}
        />
      )}

      {showFatigueModal && (
        <SessionFatigueModal
          isOpen={showFatigueModal}
          onClose={() => setShowFatigueModal(false)}
          selectedLanguage={selectedLanguage}
        />
      )}

      {showIdentityModal && (
        <CaregiverIdentityModal
          isOpen={showIdentityModal}
          onClose={() => setShowIdentityModal(false)}
          selectedLanguage={selectedLanguage}
          onLanguageChange={(l) => {
            if (onLanguageChange) onLanguageChange(l);
          }}
        />
      )}
    </div>
  );
};

