export type LanguageCode = 'as' | 'mni' | 'kha' | 'lus' | 'hi' | 'en';

export type CognitiveDomain = 'memory' | 'attention' | 'routine' | 'pattern';

export interface DomainDifficulty {
  domain: CognitiveDomain;
  level: number; // 1 to 5
  timeLimitSec: number;
  distractorCount: number;
  stimulusComplexity: 'simple' | 'moderate' | 'complex';
  cueDelaySec: number;
  consecutiveHighs: number;
  consecutiveLows: number;
}

export interface PatientProfile {
  id: string;
  name: string;
  preferredName: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  language: LanguageCode;
  state: 'Assam' | 'Manipur' | 'Meghalaya' | 'Mizoram' | 'Nagaland' | 'Arunachal Pradesh' | 'Tripura' | 'Sikkim';
  locationTown: string;
  photoUrl: string;
  caregiverName: string;
  caregiverPhone: string;
  caregiverRelationship: string;
  ashaWorkerName: string;
  ashaWorkerPhone: string;
  clinicalStage: 'Mild Cognitive Impairment' | 'Early Stage Dementia' | 'Moderate Dementia';
  baselineScoreOverall: number; // 0 to 100
  domainBaselines: Record<CognitiveDomain, number>; // 0 to 100
  difficulties: Record<CognitiveDomain, DomainDifficulty>;
  personalizedStimuli: {
    id: string;
    label: string;
    imageUrl: string;
    relation: string;
  }[];
  createdAt: string;
  lastActiveAt: string;
}

export interface SessionRecord {
  id: string;
  patientId: string;
  domain: CognitiveDomain;
  gameTemplate: string;
  timestamp: string;
  accuracy: number; // 0 to 100
  responseTimeMs: number;
  completionRate: number; // 0 to 100
  errorCount: number;
  difficultyLevel: number;
  parametersUsed: {
    timeLimitSec: number;
    distractorCount: number;
    itemCount: number;
  };
  rollingAvgBefore: number;
  rollingAvgAfter: number;
  difficultyDelta: number; // -1, 0, +1
  synced: boolean;
}

export interface ReminderItem {
  id: string;
  patientId: string;
  title: string;
  category: 'medication' | 'hydration' | 'walk' | 'meal' | 'doctor';
  time: string; // e.g. "08:30"
  spokenPromptText: string;
  pictureUrl?: string;
  requirePhotoConfirmation: boolean;
  takenToday: boolean;
  takenTimestamp?: string;
  photoProofUrl?: string;
  repeatDaily: boolean;
}

export interface MoodLog {
  id: string;
  patientId: string;
  timestamp: string;
  moodLevel: 1 | 2 | 3 | 4 | 5; // 5: Very Happy/Peaceful, 4: Content, 3: Neutral, 2: Tired/Confused, 1: Agitated/Sad
  label: string;
  spokenFeedback: string;
}

export interface DeclineAlert {
  id: string;
  patientId: string;
  domain: CognitiveDomain;
  triggeredAt: string;
  baselineScore: number;
  rollingAvg: number;
  dropPercentage: number;
  consecutiveDropSessions: number;
  severity: 'mild' | 'moderate' | 'significant';
  clinicianNotes: string;
  suggestedAction: string;
  acknowledged: boolean;
}

export interface SyncQueueItem {
  id: string;
  type: 'session' | 'reminder' | 'mood' | 'profile' | 'alert';
  payload: any;
  createdAt: string;
  status: 'pending' | 'synced' | 'retrying';
  retryCount: number;
}

export interface RuleEngineConfig {
  rollingWindowSize: number; // e.g. 5 sessions
  upgradeAccuracyThreshold: number; // e.g. 80%
  downgradeAccuracyThreshold: number; // e.g. 50%
  declineAlertMarginPercent: number; // e.g. 15% drop below baseline
  declineConsecutiveSessions: number; // e.g. 3 consecutive sessions
  maxSessionMinutes: number; // e.g. 8 minutes
}

export interface CaregiverAuth {
  signedIn: boolean;
  caregiverName: string;
  caregiverPhone: string;
  caregiverRelationship: string;
  patientName: string;
  patientPreferredName: string;
  patientAge: number;
  patientGender: 'female' | 'male' | 'other';
  ashaWorkerName: string;
  ashaWorkerPhone: string;
  language: LanguageCode;
  state: 'Assam' | 'Manipur' | 'Meghalaya' | 'Mizoram' | 'Nagaland' | 'Arunachal Pradesh' | 'Tripura' | 'Sikkim';
}

