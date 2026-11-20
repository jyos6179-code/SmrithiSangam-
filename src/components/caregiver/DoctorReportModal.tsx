import React from 'react';
import { Download, FileCode, FileSpreadsheet, FileText, Heart, Printer, ShieldCheck, X } from 'lucide-react';
import { CognitiveDomain, DeclineAlert, MoodLog, PatientProfile, ReminderItem, SessionRecord } from '../../types';
import { exportHtmlClinicalReport, exportMoodsCsv, exportPatientJson, exportSessionsCsv } from '../../utils/exportUtils';
import { audioService } from '../../services/audioService';
import { LANGUAGE_METADATA } from '../../locales/translations';

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  sessions: SessionRecord[];
  alerts: DeclineAlert[];
  reminders: ReminderItem[];
  moodLogs?: MoodLog[];
}

export const DoctorReportModal: React.FC<DoctorReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  sessions,
  alerts,
  reminders,
  moodLogs = [],
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    audioService.playVictory();
    exportHtmlClinicalReport(patient, sessions, alerts, reminders, moodLogs);
  };

  const handleDownloadCsv = () => {
    audioService.playChime();
    exportSessionsCsv(patient, sessions, moodLogs);
  };

  const handleDownloadMoodCsv = () => {
    audioService.playChime();
    exportMoodsCsv(patient, moodLogs);
  };

  const handleDownloadJson = () => {
    audioService.playChime();
    exportPatientJson(patient, sessions, alerts, reminders, moodLogs);
  };

  const nativeLanguage = LANGUAGE_METADATA[patient.language]?.nativeName || patient.language;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 my-8 print:border-none print:shadow-none print:my-0 text-slate-900">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-800" />
            <span className="font-bold text-lg text-slate-900">
              Clinical & Caregiver Longitudinal Summary Report
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              title="Download standalone HTML report file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .HTML</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              title="Download CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download .CSV</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              title="Download full JSON database records"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Download .JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Document Content (Print-Ready) */}
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                  Smart India Hackathon 2026 · Problem SIH26003 (MDoNER)
                </span>
                <h1 className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                  SmrithiSangam — Cognitive Tracking & Caregiver Report
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Decentralized, Offline-First Cognitive Monitoring for North Eastern India Elderly Care
                </p>
              </div>

              <div className="text-right text-xs font-mono text-slate-600">
                <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
                <div>Report ID: #NER-{patient.id.toUpperCase()}-2026</div>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-300 text-xs text-amber-950 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong>CLINICAL DISCLAIMER:</strong> This longitudinal data summary is generated by SmrithiSangam as a home-based cognitive engagement and caregiver monitoring aid. It is NOT an automated medical diagnosis or prescription. Clinicians should interpret this trend data alongside comprehensive clinical examinations, laboratory workups, and caregiver interviews.
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Patient Name</span>
              <strong className="text-slate-950 text-sm block">{patient.name}</strong>
              <span className="text-slate-600">({patient.preferredName})</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Age / Gender</span>
              <strong className="text-slate-950 text-sm block">{patient.age} yrs · {patient.gender}</strong>
              <span className="text-slate-600">{patient.locationTown}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Language & Script</span>
              <strong className="text-slate-950 text-sm block">{nativeLanguage}</strong>
              <span className="text-slate-600">{scriptName} · {patient.state}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Clinical Stage</span>
              <strong className="text-amber-900 text-sm block">{patient.clinicalStage}</strong>
              <span className="text-slate-600">Initial Baseline: {patient.baselineScoreOverall}%</span>
            </div>
          </div>

          {/* Primary Caregiver & ASHA Facilitator */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500">Primary Family Caregiver (Signed In Person):</span>{' '}
              <strong>{patient.caregiverName}</strong> ({patient.caregiverPhone} · {patient.caregiverRelationship})
            </div>
            <div>
              <span className="text-slate-500">Linked ASHA Worker:</span>{' '}
              <strong>{patient.ashaWorkerName}</strong> ({patient.ashaWorkerPhone})
            </div>
          </div>

          {/* Per-Domain Performance Summary Table */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
              1. Longitudinal Domain Performance (Individual Baseline vs. Rolling Average)
            </h3>
            <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Cognitive Domain</th>
                  <th className="p-2.5">Personal Baseline</th>
                  <th className="p-2.5">Rolling Avg (Last 5)</th>
                  <th className="p-2.5">Variance</th>
                  <th className="p-2.5">Current Adaptive Level</th>
                  <th className="p-2.5">Clinical Trend Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(['memory', 'attention', 'routine', 'pattern'] as CognitiveDomain[]).map(d => {
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

                  return (
                    <tr key={d} className={isDecline ? 'bg-rose-50/60 font-semibold' : ''}>
                      <td className="p-2.5 font-bold text-slate-900">{domainLabel}</td>
                      <td className="p-2.5 font-mono">{data.baseline}%</td>
                      <td className="p-2.5 font-mono">{data.rolling}%</td>
                      <td className={`p-2.5 font-mono ${diff < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {diff > 0 ? `+${diff}%` : `${diff}%`} ({pct}%)
                      </td>
                      <td className="p-2.5">Level {patient.difficulties[d]?.level || 2}/5</td>
                      <td className="p-2.5">
                        {isDecline ? (
                          <span className="text-rose-700 font-bold">⚠️ Decline Flagged</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">✓ Stable Performance</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Active Decline Alerts Section */}
          {alerts.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-2">
                2. Automated Objective Decline Alerts
              </h3>
              <div className="space-y-2">
                {alerts.map(a => (
                  <div key={a.id} className="p-3 rounded-xl border border-rose-300 bg-rose-50 text-xs">
                    <div className="flex items-center justify-between font-bold text-rose-950 mb-1">
                      <span>Domain: {a.domain.toUpperCase()} — {a.dropPercentage}% Drop Below Personal Baseline</span>
                      <span className="font-mono text-[11px]">{new Date(a.triggeredAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-slate-800 mb-1.5">{a.clinicianNotes}</p>
                    <p className="text-rose-900 font-semibold">
                      <strong>Recommended Action:</strong> {a.suggestedAction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Routine & Medication Adherence */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
              3. Caregiver Scheduled Routine & Medication Confirmation
            </h3>
            <div className="text-xs text-slate-700 mb-2">
              Today's Adherence Rate: <strong>{adherenceRate}%</strong> ({reminders.filter(r => r.takenToday).length} of {reminders.length} items logged with timestamp/photo proof)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {reminders.map(r => (
                <div key={r.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-slate-500 font-bold mr-1.5">{r.time}</span>
                    <strong className="text-slate-900">{r.title}</strong>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${r.takenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {r.takenToday ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Wellbeing & Mood History */}
          {moodLogs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                  <span>4. Daily Emotional Wellbeing & Mood Log History ({moodLogs.length} Records)</span>
                </h3>
                <button
                  onClick={handleDownloadMoodCsv}
                  className="text-xs text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1 print:hidden"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Moods (.csv)</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Date & Time</th>
                      <th className="p-2.5">Wellbeing Expression</th>
                      <th className="p-2.5">Score (1-5)</th>
                      <th className="p-2.5">Dialect Feedback & Observation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {moodLogs.slice(-5).reverse().map(m => {
                      const emoji = m.moodLevel === 5 ? '😊' : m.moodLevel === 4 ? '🙂' : m.moodLevel === 3 ? '😐' : m.moodLevel === 2 ? '😕' : '😔';
                      return (
                        <tr key={m.id}>
                          <td className="p-2.5 font-mono text-slate-600">
                            {new Date(m.timestamp).toLocaleDateString('en-IN')} {new Date(m.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900">
                            <span className="text-base mr-1.5">{emoji}</span>
                            <span>{m.label}</span>
                          </td>
                          <td className="p-2.5 font-mono font-bold text-amber-950">
                            {m.moodLevel} / 5
                          </td>
                          <td className="p-2.5 text-slate-600">
                            {m.spokenFeedback || m.label}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Signatures & Sub-Centre Stamp Area */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
              <span>Attending Neurologist / Medical Officer Signature</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
              <span>ASHA Facilitator / Sub-Centre Stamp (MDoNER Health Network)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
