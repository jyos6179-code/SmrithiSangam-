import { CognitiveDomain, DeclineAlert, MoodLog, PatientProfile, ReminderItem, SessionRecord } from '../types';
import { LANGUAGE_METADATA } from '../locales/translations';

export function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPatientJson(
  patient: PatientProfile,
  sessions: SessionRecord[],
  alerts: DeclineAlert[],
  reminders: ReminderItem[],
  moodLogs: MoodLog[]
) {
  const data = {
    exportedAt: new Date().toISOString(),
    system: "SmrithiSangam — AI Cognitive Companion for Elderly Dementia Care",
    problemStatement: "SIH26003 (MDoNER, MedTech/HealthTech Theme)",
    team: "Runtime Terrors",
    patient: {
      ...patient,
      nativeLanguageName: LANGUAGE_METADATA[patient.language]?.nativeName || patient.language,
      scriptName: LANGUAGE_METADATA[patient.language]?.scriptName || ''
    },
    sessions,
    alerts,
    reminders,
    moodLogs,
    medicalDisclaimer: "SmrithiSangam is a cognitive stimulation, engagement, and longitudinal monitoring support companion for elderly care. It is NOT a medical diagnostic or treatment device. Always consult a qualified physician for dementia diagnosis and therapy."
  };

  const filename = `SmrithiSangam_${patient.name.replace(/\s+/g, '_')}_Records_${new Date().toISOString().slice(0, 10)}.json`;
  triggerDownload(filename, JSON.stringify(data, null, 2), 'application/json');
}

export function exportSessionsCsv(
  patient: PatientProfile,
  sessions: SessionRecord[],
  moodLogs: MoodLog[]
) {
  const headers = [
    "Patient Name",
    "Patient Age",
    "State / Region",
    "Primary Language",
    "Session ID",
    "Date / Timestamp",
    "Domain",
    "Game Template",
    "Accuracy (%)",
    "Response Time (ms)",
    "Completion Rate (%)",
    "Error Count",
    "Difficulty Level",
    "Synced To Cloud"
  ];

  const nativeLang = LANGUAGE_METADATA[patient.language]?.nativeName || patient.language;

  const rows = sessions.map(s => [
    `"${patient.name}"`,
    patient.age,
    `"${patient.state}"`,
    `"${nativeLang}"`,
    `"${s.id}"`,
    `"${s.timestamp}"`,
    `"${s.domain}"`,
    `"${s.gameTemplate}"`,
    s.accuracy,
    s.responseTimeMs,
    s.completionRate,
    s.errorCount,
    s.difficultyLevel,
    s.synced ? "Yes" : "No"
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");

  const filename = `SmrithiSangam_${patient.name.replace(/\s+/g, '_')}_Cognitive_Metrics_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerDownload(filename, csvContent, 'text/csv;charset=utf-8;');
}

export function exportMoodsCsv(
  patient: PatientProfile,
  moodLogs: MoodLog[]
) {
  const headers = [
    "Patient Name",
    "Date / Timestamp",
    "Mood Level (1 to 5)",
    "Mood Label (Native)",
    "Spoken Verbal Feedback",
    "Device Stored"
  ];

  const rows = moodLogs.map(m => [
    `"${patient.name}"`,
    `"${m.timestamp}"`,
    m.moodLevel,
    `"${m.label}"`,
    `"${m.spokenFeedback || ''}"`,
    "Yes (Local DB)"
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");

  const filename = `SmrithiSangam_${patient.name.replace(/\s+/g, '_')}_Mood_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerDownload(filename, csvContent, 'text/csv;charset=utf-8;');
}

export function exportHtmlClinicalReport(
  patient: PatientProfile,
  sessions: SessionRecord[],
  alerts: DeclineAlert[],
  reminders: ReminderItem[],
  moodLogs: MoodLog[]
) {
  const nativeLangName = LANGUAGE_METADATA[patient.language]?.nativeName || patient.language;
  const scriptName = LANGUAGE_METADATA[patient.language]?.scriptName || '';

  const domainAverages: Record<CognitiveDomain, { rolling: number; baseline: number; totalSessions: number }> = {
    memory: { rolling: 0, baseline: patient.domainBaselines.memory, totalSessions: 0 },
    attention: { rolling: 0, baseline: patient.domainBaselines.attention, totalSessions: 0 },
    routine: { rolling: 0, baseline: patient.domainBaselines.routine, totalSessions: 0 },
    pattern: { rolling: 0, baseline: patient.domainBaselines.pattern, totalSessions: 0 },
  };

  (['memory', 'attention', 'routine', 'pattern'] as CognitiveDomain[]).forEach(d => {
    const list = sessions.filter(s => s.domain === d);
    domainAverages[d].totalSessions = list.length;
    if (list.length > 0) {
      const recent = list.slice(-5);
      domainAverages[d].rolling = Math.round(
        recent.reduce((sum, s) => sum + s.accuracy, 0) / recent.length
      );
    } else {
      domainAverages[d].rolling = patient.domainBaselines[d];
    }
  });

  const adherenceRate = reminders.length > 0
    ? Math.round((reminders.filter(r => r.takenToday).length / reminders.length) * 100)
    : 100;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SmrithiSangam Clinical Report — ${patient.name}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #0f172a;
      max-width: 850px;
      margin: 0 auto;
      padding: 32px 24px;
      background-color: #ffffff;
    }
    .header {
      border-bottom: 3px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-mDoNER { background-color: #fef3c7; color: #92400e; }
    .badge-decline { background-color: #fee2e2; color: #991b1b; }
    .badge-stable { background-color: #d1fae5; color: #065f46; }
    .disclaimer {
      background-color: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 12px;
      color: #78350f;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background-color: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    .card {
      background-color: #f8fafc;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      font-size: 13px;
    }
    .card span { color: #64748b; font-size: 11px; font-weight: 600; display: block; }
    .card strong { font-size: 15px; color: #0f172a; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 24px;
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #334155;
    }
    .alert-box {
      background-color: #fff1f2;
      border: 1px solid #fecdd3;
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    .print-btn {
      background-color: #b45309;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 20px;
    }
    .sig-area {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #cbd5e1;
      font-size: 12px;
      color: #64748b;
    }
    .sig-line {
      height: 40px;
      border-bottom: 1px dashed #94a3b8;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right; margin-bottom: 16px;">
    <button class="print-btn" onclick="window.print()">🖨️ Print or Save as PDF</button>
  </div>

  <div class="header">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <span class="badge badge-mDoNER">MDoNER North East Project SIH26003 · Team Runtime Terrors</span>
        <h1 style="margin: 6px 0 2px 0; font-size: 24px; font-weight: 900;">SmrithiSangam — Cognitive Tracking & Clinical Caregiver Report</h1>
        <p style="margin: 0; font-size: 12px; color: #64748b;">Elderly Dementia Longitudinal Surveillance & Engagement Companion</p>
      </div>
      <div style="text-align: right; font-size: 11px; font-family: monospace; color: #64748b;">
        <div>Date: ${new Date().toLocaleDateString('en-IN')}</div>
        <div>Report ID: #NER-${patient.id.toUpperCase()}-2026</div>
      </div>
    </div>
  </div>

  <div class="disclaimer">
    <strong>OFFICIAL CLINICAL NOTICE:</strong> SmrithiSangam is designed as a daily cognitive stimulation and caregiver monitoring support tool. It does not provide medical diagnoses, treatment plans, or clinical prescriptions. Always consult a certified neurologist or physician for clinical dementia evaluations.
  </div>

  <div class="grid-4">
    <div class="card">
      <span>Patient Full Name</span>
      <strong>${patient.name}</strong>
      <div style="font-size: 11px; color: #64748b;">(${patient.preferredName})</div>
    </div>
    <div class="card">
      <span>Age / Gender</span>
      <strong>${patient.age} yrs · ${patient.gender}</strong>
      <div style="font-size: 11px; color: #64748b;">${patient.locationTown}</div>
    </div>
    <div class="card">
      <span>Primary Language & Script</span>
      <strong>${nativeLangName}</strong>
      <div style="font-size: 11px; color: #64748b;">${scriptName} · ${patient.state}</div>
    </div>
    <div class="card">
      <span>Clinical Staging</span>
      <strong>${patient.clinicalStage}</strong>
      <div style="font-size: 11px; color: #64748b;">Baseline: ${patient.baselineScoreOverall}%</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <span>Primary Family Caregiver (Signed In Person)</span>
      <strong>${patient.caregiverName}</strong>
      <div style="font-size: 12px; color: #334155; margin-top: 4px;">Phone: ${patient.caregiverPhone} (${patient.caregiverRelationship})</div>
    </div>
    <div class="card">
      <span>Linked Community Health Worker (ASHA)</span>
      <strong>${patient.ashaWorkerName}</strong>
      <div style="font-size: 12px; color: #334155; margin-top: 4px;">Phone: ${patient.ashaWorkerPhone}</div>
    </div>
  </div>

  <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">1. Longitudinal Domain Scores (Baseline vs. Rolling Average)</h3>
  <table>
    <thead>
      <tr>
        <th>Cognitive Domain</th>
        <th>Personal Baseline</th>
        <th>Rolling Avg (Last 5)</th>
        <th>Variance</th>
        <th>Adaptive Level</th>
        <th>Clinical Status</th>
      </tr>
    </thead>
    <tbody>
      ${(['memory', 'attention', 'routine', 'pattern'] as CognitiveDomain[]).map(d => {
        const data = domainAverages[d];
        const diff = data.rolling - data.baseline;
        const pct = Math.round((diff / data.baseline) * 100);
        const isDecline = pct <= -15;
        const domainLabel = {
          memory: 'Short-Term Memory (Heritage Match)',
          attention: 'Visual Attention (Tea Garden Focus)',
          routine: 'Executive Sequence (Tea Brewing Order)',
          pattern: 'Visuospatial Recognition (Silhouette)'
        }[d];

        return `<tr>
          <td><strong>${domainLabel}</strong></td>
          <td style="font-family: monospace;">${data.baseline}%</td>
          <td style="font-family: monospace;">${data.rolling}%</td>
          <td style="font-family: monospace; color: ${diff < 0 ? '#b91c1c' : '#047857'}; font-weight: bold;">
            ${diff > 0 ? '+' + diff : diff}% (${pct}%)
          </td>
          <td>Level ${patient.difficulties[d]?.level || 2}/5</td>
          <td>
            ${isDecline 
              ? '<span class="badge badge-decline">⚠️ Decline Alert</span>' 
              : '<span class="badge badge-stable">✓ Stable</span>'}
          </td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

  ${alerts.length > 0 ? `
  <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #991b1b; margin-bottom: 8px;">2. Active Decline Alerts (Threshold: >=15% drop over 3 sessions)</h3>
  ${alerts.map(a => `
    <div class="alert-box">
      <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 4px;">
        <span>${a.domain.toUpperCase()} — ${a.dropPercentage}% Drop Below Baseline</span>
        <span style="font-family: monospace;">${new Date(a.triggeredAt).toLocaleDateString('en-IN')}</span>
      </div>
      <div>${a.clinicianNotes}</div>
      <div style="margin-top: 6px; font-weight: 600; color: #991b1b;">Recommended Action: ${a.suggestedAction}</div>
    </div>
  `).join('')}
  ` : ''}

  <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">3. Routine & Medication Intake Adherence</h3>
  <p style="font-size: 12px; color: #475569; margin-bottom: 12px;">Today's Adherence Rate: <strong>${adherenceRate}%</strong> (${reminders.filter(r => r.takenToday).length} of ${reminders.length} scheduled reminders completed)</p>
  <div class="grid-2">
    ${reminders.map(r => `
      <div class="card">
        <span style="font-family: monospace;">${r.time} · ${r.category.toUpperCase()}</span>
        <strong>${r.title}</strong>
        <div style="margin-top: 4px; font-size: 11px; color: ${r.takenToday ? '#047857' : '#b45309'}; font-weight: bold;">
          ${r.takenToday ? '✓ Dose Confirmed' : '⏳ Pending Intake'}
          ${r.requirePhotoConfirmation ? ' · Photo Proof Verified' : ''}
        </div>
      </div>
    `).join('')}
  </div>

  ${moodLogs.length > 0 ? `
  <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">4. Daily Emotional Wellbeing & Mood Log History</h3>
  <table>
    <thead>
      <tr>
        <th>Date & Time</th>
        <th>Wellbeing Expression</th>
        <th>Score (1-5)</th>
        <th>Logged Dialect Feedback</th>
      </tr>
    </thead>
    <tbody>
      ${moodLogs.slice(-5).reverse().map(m => {
        const emoji = m.moodLevel === 5 ? '😊' : m.moodLevel === 4 ? '🙂' : m.moodLevel === 3 ? '😐' : m.moodLevel === 2 ? '😕' : '😔';
        return `<tr>
          <td style="font-family: monospace;">${new Date(m.timestamp).toLocaleDateString('en-IN')} ${new Date(m.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
          <td><span style="font-size: 18px; margin-right: 6px;">${emoji}</span><strong>${m.label}</strong></td>
          <td style="font-family: monospace;">${m.moodLevel} / 5</td>
          <td style="color: #475569;">${m.spokenFeedback || m.label}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
  ` : ''}

  <div class="sig-area">
    <div>
      <div class="sig-line"></div>
      Attending Neurologist / Medical Officer Signature
    </div>
    <div>
      <div class="sig-line"></div>
      ASHA Facilitator / Sub-Centre Stamp (MDoNER Healthcare Network)
    </div>
  </div>
</body>
</html>`;

  const filename = `SmrithiSangam_Clinical_Report_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.html`;
  triggerDownload(filename, html, 'text/html;charset=utf-8;');
}

