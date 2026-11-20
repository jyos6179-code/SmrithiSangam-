import {
  CaregiverAuth,
  CognitiveDomain,
  DeclineAlert,
  MoodLog,
  PatientProfile,
  ReminderItem,
  SessionRecord,
  SyncQueueItem
} from '../types';

export type NetworkStatus = 'online' | '2g_weak' | 'offline';

const STORAGE_KEYS = {
  PATIENTS: 'smrithi_patients_v1',
  ACTIVE_PATIENT: 'smrithi_active_patient_id_v1',
  SESSIONS: 'smrithi_sessions_v1',
  REMINDERS: 'smrithi_reminders_v1',
  MOODS: 'smrithi_moods_v1',
  ALERTS: 'smrithi_alerts_v1',
  SYNC_QUEUE: 'smrithi_sync_queue_v1',
  DISCLAIMER_ACCEPTED: 'smrithi_disclaimer_accepted_v1',
  NETWORK_STATUS: 'smrithi_simulated_network_status_v1',
  CAREGIVER_AUTH: 'smrithi_caregiver_auth_v1',
};

class StorageService {
  private networkStatus: NetworkStatus = 'online';
  private syncListeners: (() => void)[] = [];

  constructor() {
    this.initDatabase();
  }

  // Ensure default demo data is populated on first launch
  private initDatabase() {
    const existing = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (!existing) {
      this.seedInitialData();
    }
    const savedNetwork = localStorage.getItem(STORAGE_KEYS.NETWORK_STATUS);
    if (savedNetwork) {
      this.networkStatus = savedNetwork as NetworkStatus;
    }
  }

  private seedInitialData() {
    // Authentic North East India patients
    const patient1: PatientProfile = {
      id: 'patient-ner-01',
      name: 'Ananya Phukan',
      preferredName: 'Aita Ananya',
      age: 74,
      gender: 'female',
      language: 'as',
      state: 'Assam',
      locationTown: 'Guwahati, Kamrup Metro',
      photoUrl: '/src/assets/images/ner_elderly_grandmother_1790522377092.jpg',
      caregiverName: 'Partha Phukan (Son)',
      caregiverPhone: '+91 94350 12847',
      caregiverRelationship: 'Son & Primary Caregiver',
      ashaWorkerName: 'Runu Barman (ASHA Facilitator)',
      ashaWorkerPhone: '+91 98640 44219',
      clinicalStage: 'Early Stage Dementia',
      baselineScoreOverall: 76,
      domainBaselines: {
        memory: 78,
        attention: 80,
        routine: 75,
        pattern: 72,
      },
      difficulties: {
        memory: {
          domain: 'memory',
          level: 2,
          timeLimitSec: 75,
          distractorCount: 4,
          stimulusComplexity: 'simple',
          cueDelaySec: 6,
          consecutiveHighs: 1,
          consecutiveLows: 0,
        },
        attention: {
          domain: 'attention',
          level: 3,
          timeLimitSec: 60,
          distractorCount: 6,
          stimulusComplexity: 'moderate',
          cueDelaySec: 5,
          consecutiveHighs: 0,
          consecutiveLows: 0,
        },
        routine: {
          domain: 'routine',
          level: 2,
          timeLimitSec: 75,
          distractorCount: 4,
          stimulusComplexity: 'simple',
          cueDelaySec: 6,
          consecutiveHighs: 0,
          consecutiveLows: 0,
        },
        pattern: {
          domain: 'pattern',
          level: 1,
          timeLimitSec: 90,
          distractorCount: 2,
          stimulusComplexity: 'simple',
          cueDelaySec: 8,
          consecutiveHighs: 0,
          consecutiveLows: 2,
        },
      },
      personalizedStimuli: [
        {
          id: 'stim-01',
          label: 'Aita\'s Traditional Cane Chair in Verandah',
          imageUrl: '/src/assets/images/ner_bamboo_craft_japi_1790522364386.jpg',
          relation: 'Favorite morning tea spot',
        },
        {
          id: 'stim-02',
          label: 'Moni & Rahul (Grandchildren)',
          imageUrl: '/src/assets/images/ner_assam_tea_garden_1790522336349.jpg',
          relation: 'Grandchildren visiting during Bihu',
        }
      ],
      createdAt: '2026-08-15T09:00:00.000Z',
      lastActiveAt: new Date().toISOString(),
    };

    const patient2: PatientProfile = {
      id: 'patient-ner-02',
      name: 'Lalthansanga Sailo',
      preferredName: 'Pu Thanga',
      age: 79,
      gender: 'male',
      language: 'lus',
      state: 'Mizoram',
      locationTown: 'Aizawl, Khatla',
      photoUrl: '/src/assets/images/ner_bamboo_craft_japi_1790522364386.jpg',
      caregiverName: 'Lalrinpuii Sailo (Daughter)',
      caregiverPhone: '+91 98623 55912',
      caregiverRelationship: 'Daughter',
      ashaWorkerName: 'Zomawii (ASHA)',
      ashaWorkerPhone: '+91 94361 77283',
      clinicalStage: 'Mild Cognitive Impairment',
      baselineScoreOverall: 82,
      domainBaselines: {
        memory: 84,
        attention: 81,
        routine: 85,
        pattern: 79,
      },
      difficulties: {
        memory: { domain: 'memory', level: 3, timeLimitSec: 60, distractorCount: 6, stimulusComplexity: 'moderate', cueDelaySec: 5, consecutiveHighs: 0, consecutiveLows: 0 },
        attention: { domain: 'attention', level: 3, timeLimitSec: 60, distractorCount: 6, stimulusComplexity: 'moderate', cueDelaySec: 5, consecutiveHighs: 0, consecutiveLows: 0 },
        routine: { domain: 'routine', level: 3, timeLimitSec: 60, distractorCount: 6, stimulusComplexity: 'moderate', cueDelaySec: 5, consecutiveHighs: 0, consecutiveLows: 0 },
        pattern: { domain: 'pattern', level: 3, timeLimitSec: 60, distractorCount: 6, stimulusComplexity: 'moderate', cueDelaySec: 5, consecutiveHighs: 0, consecutiveLows: 0 },
      },
      personalizedStimuli: [],
      createdAt: '2026-08-20T10:00:00.000Z',
      lastActiveAt: new Date().toISOString(),
    };

    const patient3: PatientProfile = {
      id: 'patient-ner-03',
      name: 'Ningthoujam Chaoba Devi',
      preferredName: 'Ima Chaoba',
      age: 81,
      gender: 'female',
      language: 'mni',
      state: 'Manipur',
      locationTown: 'Imphal West, Uripok',
      photoUrl: '/src/assets/images/ner_living_root_bridge_1790522352073.jpg',
      caregiverName: 'N. Tomba Singh (Grandson)',
      caregiverPhone: '+91 98561 33491',
      caregiverRelationship: 'Grandson',
      ashaWorkerName: 'M. Shanti Devi (ASHA)',
      ashaWorkerPhone: '+91 97740 66128',
      clinicalStage: 'Moderate Dementia',
      baselineScoreOverall: 64,
      domainBaselines: {
        memory: 62,
        attention: 65,
        routine: 68,
        pattern: 60,
      },
      difficulties: {
        memory: { domain: 'memory', level: 1, timeLimitSec: 90, distractorCount: 2, stimulusComplexity: 'simple', cueDelaySec: 8, consecutiveHighs: 0, consecutiveLows: 0 },
        attention: { domain: 'attention', level: 1, timeLimitSec: 90, distractorCount: 2, stimulusComplexity: 'simple', cueDelaySec: 8, consecutiveHighs: 0, consecutiveLows: 0 },
        routine: { domain: 'routine', level: 1, timeLimitSec: 90, distractorCount: 2, stimulusComplexity: 'simple', cueDelaySec: 8, consecutiveHighs: 0, consecutiveLows: 0 },
        pattern: { domain: 'pattern', level: 1, timeLimitSec: 90, distractorCount: 2, stimulusComplexity: 'simple', cueDelaySec: 8, consecutiveHighs: 0, consecutiveLows: 0 },
      },
      personalizedStimuli: [],
      createdAt: '2026-08-25T11:00:00.000Z',
      lastActiveAt: new Date().toISOString(),
    };

    const patient4: PatientProfile = {
      id: 'patient-ner-04',
      name: 'Badaplin Syiem',
      preferredName: 'Mei Badap',
      age: 76,
      gender: 'female',
      language: 'kha',
      state: 'Meghalaya',
      locationTown: 'Shillong, Mawlai',
      photoUrl: '/src/assets/images/ner_living_root_bridge_1790522352073.jpg',
      caregiverName: 'Iaphibanroi Syiem (Daughter)',
      caregiverPhone: '+91 94367 88201',
      caregiverRelationship: 'Daughter',
      ashaWorkerName: 'Mary Lyngdoh (ASHA)',
      ashaWorkerPhone: '+91 98560 11482',
      clinicalStage: 'Mild Cognitive Impairment',
      baselineScoreOverall: 79,
      domainBaselines: {
        memory: 80,
        attention: 78,
        routine: 82,
        pattern: 76,
      },
      difficulties: {
        memory: { domain: 'memory', level: 2, timeLimitSec: 75, distractorCount: 4, stimulusComplexity: 'simple', cueDelaySec: 6, consecutiveHighs: 0, consecutiveLows: 0 },
        attention: { domain: 'attention', level: 2, timeLimitSec: 75, distractorCount: 4, stimulusComplexity: 'simple', cueDelaySec: 6, consecutiveHighs: 0, consecutiveLows: 0 },
        routine: { domain: 'routine', level: 2, timeLimitSec: 75, distractorCount: 4, stimulusComplexity: 'simple', cueDelaySec: 6, consecutiveHighs: 0, consecutiveLows: 0 },
        pattern: { domain: 'pattern', level: 2, timeLimitSec: 75, distractorCount: 4, stimulusComplexity: 'simple', cueDelaySec: 6, consecutiveHighs: 0, consecutiveLows: 0 },
      },
      personalizedStimuli: [],
      createdAt: '2026-09-01T08:00:00.000Z',
      lastActiveAt: new Date().toISOString(),
    };

    const patients = [patient1, patient2, patient3, patient4];
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT, patient1.id);

    // Seed longitudinal sessions for Ananya Phukan (demonstrating steady trend in memory/attention, but sudden decline in pattern recognition)
    const baseDate = new Date('2026-09-10T10:00:00.000Z');
    const sessions: SessionRecord[] = [];

    // Memory sessions (healthy stable performance: 75%-85%)
    for (let day = 0; day < 12; day++) {
      const d = new Date(baseDate.getTime() + day * 86400000 + 3600000);
      sessions.push({
        id: `sess-mem-${day}`,
        patientId: patient1.id,
        domain: 'memory',
        gameTemplate: 'Heritage Memory Match',
        timestamp: d.toISOString(),
        accuracy: 75 + ((day * 7) % 15),
        responseTimeMs: 3400 + ((day * 130) % 800),
        completionRate: 100,
        errorCount: (day % 3 === 0) ? 1 : 0,
        difficultyLevel: 2,
        parametersUsed: { timeLimitSec: 75, distractorCount: 4, itemCount: 6 },
        rollingAvgBefore: 77,
        rollingAvgAfter: 78,
        difficultyDelta: 0,
        synced: true,
      });
    }

    // Attention sessions (steady: 78%-88%)
    for (let day = 0; day < 12; day++) {
      const d = new Date(baseDate.getTime() + day * 86400000 + 7200000);
      sessions.push({
        id: `sess-att-${day}`,
        patientId: patient1.id,
        domain: 'attention',
        gameTemplate: 'Selective Tea Garden Focus',
        timestamp: d.toISOString(),
        accuracy: 80 + ((day * 5) % 12),
        responseTimeMs: 2900 + ((day * 110) % 600),
        completionRate: 100,
        errorCount: 0,
        difficultyLevel: 3,
        parametersUsed: { timeLimitSec: 60, distractorCount: 6, itemCount: 7 },
        rollingAvgBefore: 81,
        rollingAvgAfter: 82,
        difficultyDelta: 0,
        synced: true,
      });
    }

    // Routine recall sessions (stable: 72%-80%)
    for (let day = 0; day < 12; day++) {
      const d = new Date(baseDate.getTime() + day * 86400000 + 10800000);
      sessions.push({
        id: `sess-rout-${day}`,
        patientId: patient1.id,
        domain: 'routine',
        gameTemplate: 'Daily Sequence Ordering',
        timestamp: d.toISOString(),
        accuracy: 74 + ((day * 4) % 10),
        responseTimeMs: 4200 + ((day * 150) % 900),
        completionRate: 100,
        errorCount: 1,
        difficultyLevel: 2,
        parametersUsed: { timeLimitSec: 75, distractorCount: 4, itemCount: 4 },
        rollingAvgBefore: 75,
        rollingAvgAfter: 76,
        difficultyDelta: 0,
        synced: true,
      });
    }

    // Pattern recognition sessions: was at 72%, but dropped to 52%, 48%, 50% over the last 3 days!
    for (let day = 0; day < 12; day++) {
      const d = new Date(baseDate.getTime() + day * 86400000 + 14400000);
      let acc = 70 + ((day * 3) % 8);
      let errors = 1;
      let diff = 2;

      if (day >= 9) {
        // Drop in recent 3 days
        acc = day === 9 ? 52 : day === 10 ? 48 : 50;
        errors = 4;
        diff = 1;
      }

      sessions.push({
        id: `sess-pat-${day}`,
        patientId: patient1.id,
        domain: 'pattern',
        gameTemplate: 'Heritage Silhouette Match',
        timestamp: d.toISOString(),
        accuracy: acc,
        responseTimeMs: 6500 + ((day * 200) % 1500),
        completionRate: 85,
        errorCount: errors,
        difficultyLevel: diff,
        parametersUsed: { timeLimitSec: 90, distractorCount: 2, itemCount: 4 },
        rollingAvgBefore: 72,
        rollingAvgAfter: day >= 9 ? 50 : 72,
        difficultyDelta: day >= 9 ? -1 : 0,
        synced: true,
      });
    }

    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Seed Active Decline Alert for Ananya Phukan in Pattern Recognition
    const alert1: DeclineAlert = {
      id: 'alert-pat-01',
      patientId: patient1.id,
      domain: 'pattern',
      triggeredAt: '2026-09-26T16:00:00.000Z',
      baselineScore: 72,
      rollingAvg: 50,
      dropPercentage: 31,
      consecutiveDropSessions: 3,
      severity: 'significant',
      clinicianNotes: "Aita Ananya's pattern and silhouette recognition score dropped by 31% over the last 3 consecutive daily sessions. Misidentifications occurred predominantly with high-detail regional crafts (Assamese Japi vs cane basket).",
      suggestedAction: "ASHA Worker Runu Barman to conduct home assessment. Check for cataract progression, recent sleep disruption, or change in blood pressure medication. Temporarily reduce stimulus visual noise in Patient Mode.",
      acknowledged: false,
    };
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify([alert1]));

    // Seed daily reminders
    const reminders: ReminderItem[] = [
      {
        id: 'rem-01',
        patientId: patient1.id,
        title: 'Morning Blood Pressure & Memory Support (Donepezil)',
        category: 'medication',
        time: '08:30',
        spokenPromptText: 'Aita, eitu apunar sakalor ouxodh khowar xomoy hol (Donepezil 5mg).',
        pictureUrl: '/src/assets/images/ner_bamboo_craft_japi_1790522364386.jpg',
        requirePhotoConfirmation: true,
        takenToday: true,
        takenTimestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        photoProofUrl: '/src/assets/images/ner_bamboo_craft_japi_1790522364386.jpg',
        repeatDaily: true,
      },
      {
        id: 'rem-02',
        patientId: patient1.id,
        title: 'Warm Water & Tulsi Tea Hydration',
        category: 'hydration',
        time: '11:00',
        spokenPromptText: 'Aita, egilas kuhamiya pani aru tulsi cha khao.',
        requirePhotoConfirmation: false,
        takenToday: false,
        repeatDaily: true,
      },
      {
        id: 'rem-03',
        patientId: patient1.id,
        title: 'Verandah Sunshine Walk & Flower Watering',
        category: 'walk',
        time: '16:30',
        spokenPromptText: 'Beli bhator verandah-t aita olop ghori aahok.',
        requirePhotoConfirmation: false,
        takenToday: false,
        repeatDaily: true,
      },
      {
        id: 'rem-04',
        patientId: patient1.id,
        title: 'Evening Nourishment & Calcium Chew',
        category: 'medication',
        time: '20:00',
        spokenPromptText: 'Rati khowar pasot calcium tablet tu khao.',
        requirePhotoConfirmation: true,
        takenToday: false,
        repeatDaily: true,
      }
    ];
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));

    // Seed mood logs
    const moodLogs: MoodLog[] = [
      {
        id: 'mood-01',
        patientId: patient1.id,
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        moodLevel: 4,
        label: 'Content',
        spokenFeedback: 'Good spirits after morning prayer and listening to Bihu flute.',
      },
      {
        id: 'mood-02',
        patientId: patient1.id,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        moodLevel: 3,
        label: 'Neutral',
        spokenFeedback: 'Quiet afternoon resting on the cane chair.',
      },
      {
        id: 'mood-03',
        patientId: patient1.id,
        timestamp: new Date().toISOString(),
        moodLevel: 5,
        label: 'Very Joyful',
        spokenFeedback: 'Delighted after recognizing grandchild Moni in the picture stimulus.',
      }
    ];
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moodLogs));

    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
  }

  // Disclaimer acknowledgment
  isDisclaimerAccepted(): boolean {
    return localStorage.getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED) === 'true';
  }

  setDisclaimerAccepted(accepted: boolean) {
    localStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, accepted ? 'true' : 'false');
  }

  // Network simulation
  getNetworkStatus(): NetworkStatus {
    return this.networkStatus;
  }

  setNetworkStatus(status: NetworkStatus) {
    this.networkStatus = status;
    localStorage.setItem(STORAGE_KEYS.NETWORK_STATUS, status);
    if (status === 'online') {
      this.processSyncQueue();
    }
    this.notifySync();
  }

  // Patient profiles
  getPatients(): PatientProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return raw ? JSON.parse(raw) : [];
  }

  getActivePatient(): PatientProfile {
    const patients = this.getPatients();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT);
    const found = patients.find(p => p.id === activeId);
    return found || patients[0];
  }

  setActivePatient(patientId: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT, patientId);
    this.notifySync();
  }

  savePatient(patient: PatientProfile) {
    const patients = this.getPatients();
    const idx = patients.findIndex(p => p.id === patient.id);
    if (idx >= 0) {
      patients[idx] = patient;
    } else {
      patients.push(patient);
    }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    this.enqueueSync('profile', patient);
    this.notifySync();
  }

  // Sessions
  getSessions(patientId?: string): SessionRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    const all: SessionRecord[] = raw ? JSON.parse(raw) : [];
    if (patientId) {
      return all.filter(s => s.patientId === patientId);
    }
    return all;
  }

  saveSession(session: SessionRecord) {
    const sessions = this.getSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Update patient's last active timestamp
    const patient = this.getActivePatient();
    if (patient && patient.id === session.patientId) {
      patient.lastActiveAt = session.timestamp;
      this.savePatient(patient);
    }

    this.enqueueSync('session', session);
    this.notifySync();
  }

  // Reminders
  getReminders(patientId?: string): ReminderItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    const all: ReminderItem[] = raw ? JSON.parse(raw) : [];
    if (patientId) {
      return all.filter(r => r.patientId === patientId);
    }
    return all;
  }

  saveReminder(reminder: ReminderItem) {
    const reminders = this.getReminders();
    const idx = reminders.findIndex(r => r.id === reminder.id);
    if (idx >= 0) {
      reminders[idx] = reminder;
    } else {
      reminders.push(reminder);
    }
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    this.enqueueSync('reminder', reminder);
    this.notifySync();
  }

  confirmReminderTaken(reminderId: string, photoProofUrl?: string) {
    const reminders = this.getReminders();
    const item = reminders.find(r => r.id === reminderId);
    if (item) {
      item.takenToday = true;
      item.takenTimestamp = new Date().toISOString();
      if (photoProofUrl) {
        item.photoProofUrl = photoProofUrl;
      }
      this.saveReminder(item);
    }
  }

  // Mood logs
  getMoodLogs(patientId?: string): MoodLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MOODS);
    const all: MoodLog[] = raw ? JSON.parse(raw) : [];
    if (patientId) {
      return all.filter(m => m.patientId === patientId);
    }
    return all;
  }

  saveMoodLog(mood: MoodLog) {
    const moods = this.getMoodLogs();
    moods.push(mood);
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
    this.enqueueSync('mood', mood);
    this.notifySync();
  }

  // Decline Alerts
  getAlerts(patientId?: string): DeclineAlert[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    const all: DeclineAlert[] = raw ? JSON.parse(raw) : [];
    if (patientId) {
      return all.filter(a => a.patientId === patientId);
    }
    return all;
  }

  saveAlert(alert: DeclineAlert) {
    const alerts = this.getAlerts();
    const idx = alerts.findIndex(a => a.id === alert.id);
    if (idx >= 0) {
      alerts[idx] = alert;
    } else {
      alerts.unshift(alert);
    }
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    this.enqueueSync('alert', alert);
    this.notifySync();
  }

  acknowledgeAlert(alertId: string) {
    const alerts = this.getAlerts();
    const item = alerts.find(a => a.id === alertId);
    if (item) {
      item.acknowledged = true;
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
      this.notifySync();
    }
  }

  // Background Sync Queue (Zero-data-loss architecture)
  private enqueueSync(type: SyncQueueItem['type'], payload: any) {
    const queue = this.getSyncQueue();
    const item: SyncQueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    };
    queue.push(item);
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));

    if (this.networkStatus === 'online') {
      setTimeout(() => this.processSyncQueue(), 500);
    }
  }

  getSyncQueue(): SyncQueueItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return raw ? JSON.parse(raw) : [];
  }

  processSyncQueue() {
    if (this.networkStatus === 'offline') return;

    const queue = this.getSyncQueue();
    if (queue.length === 0) return;

    // Simulate opportunistic batch sync with backoff
    const remaining: SyncQueueItem[] = [];
    queue.forEach(item => {
      // In online mode, 100% succeed; in 2g_weak mode, sync 50%
      if (this.networkStatus === 'online' || Math.random() > 0.3) {
        // Synced successfully to backend
      } else {
        item.retryCount += 1;
        item.status = 'retrying';
        remaining.push(item);
      }
    });

    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(remaining));
    this.notifySync();
  }

  // Caregiver Authentication & Identity Tracking
  getCaregiverAuth(): CaregiverAuth {
    const raw = localStorage.getItem(STORAGE_KEYS.CAREGIVER_AUTH);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }

    // Default auth tied to the active patient profile
    const active = this.getActivePatient();
    return {
      signedIn: true,
      caregiverName: active?.caregiverName?.replace(/\s*\(.*\)$/, '') || 'Partha Phukan',
      caregiverPhone: active?.caregiverPhone || '+91 94350 12847',
      caregiverRelationship: active?.caregiverRelationship || 'Son & Primary Caregiver',
      patientName: active?.name || 'Ananya Phukan',
      patientPreferredName: active?.preferredName || 'Aita Ananya',
      patientAge: active?.age || 74,
      patientGender: active?.gender || 'female',
      ashaWorkerName: active?.ashaWorkerName || 'Runu Barman',
      ashaWorkerPhone: active?.ashaWorkerPhone || '+91 98640 44219',
      language: active?.language || 'as',
      state: active?.state || 'Assam',
    };
  }

  saveCaregiverAuth(auth: CaregiverAuth) {
    localStorage.setItem(STORAGE_KEYS.CAREGIVER_AUTH, JSON.stringify(auth));

    // Update active patient profile with real names entered by the person
    const active = this.getActivePatient();
    if (active) {
      active.caregiverName = auth.caregiverName;
      active.caregiverPhone = auth.caregiverPhone;
      active.caregiverRelationship = auth.caregiverRelationship;
      active.name = auth.patientName;
      active.preferredName = auth.patientPreferredName || auth.patientName;
      active.age = auth.patientAge;
      active.gender = auth.patientGender;
      active.language = auth.language;
      active.state = auth.state;
      this.savePatient(active);
    }

    this.notifySync();
  }

  subscribeSync(listener: () => void) {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  private notifySync() {
    this.syncListeners.forEach(listener => {
      try {
        listener();
      } catch {
        // safe
      }
    });
  }
}

export const storageService = new StorageService();
