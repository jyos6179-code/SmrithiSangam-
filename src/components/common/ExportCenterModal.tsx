import React from 'react';
import { Download, FileCode, FileSpreadsheet, FileText, Heart, Printer, ShieldCheck, X } from 'lucide-react';
import { DeclineAlert, MoodLog, PatientProfile, ReminderItem, SessionRecord } from '../../types';
import { exportHtmlClinicalReport, exportMoodsCsv, exportPatientJson, exportSessionsCsv } from '../../utils/exportUtils';
import { audioService } from '../../services/audioService';

interface ExportCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  sessions: SessionRecord[];
  alerts: DeclineAlert[];
  reminders: ReminderItem[];
  moodLogs: MoodLog[];
}

export const ExportCenterModal: React.FC<ExportCenterModalProps> = ({
  isOpen,
  onClose,
  patient,
  sessions,
  alerts,
  reminders,
  moodLogs,
}) => {
  if (!isOpen) return null;

  const handleDownloadHtml = () => {
    audioService.playVictory();
    exportHtmlClinicalReport(patient, sessions, alerts, reminders, moodLogs);
  };

  const handleDownloadJson = () => {
    audioService.playChime();
    exportPatientJson(patient, sessions, alerts, reminders, moodLogs);
  };

  const handleDownloadCsv = () => {
    audioService.playChime();
    exportSessionsCsv(patient, sessions, moodLogs);
  };

  const handleDownloadMoodCsv = () => {
    audioService.playChime();
    exportMoodsCsv(patient, moodLogs);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-300 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
                MDoNER SIH26003 · Data Portability & Export
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                Download Longitudinal Records & Report
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          Select your preferred downloadable file format below. All session records, baseline assessments, medication confirmations, and decline alerts for <strong>{patient.name}</strong> will be exported directly to your device.
        </p>

        {/* 4 Downloadable File Format Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          {/* Format 1: Clinical HTML Report */}
          <button
            onClick={handleDownloadHtml}
            className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-500 text-left transition-all cursor-pointer shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center mb-2.5 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-900">
                Clinical Report (.html)
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Complete printable clinical dossier with tables, baseline vs. rolling trends, and doctor signature lines.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200 flex items-center justify-between text-xs font-bold text-amber-900">
              <span>Download File</span>
              <Download className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Format 2: CSV Spreadsheet */}
          <button
            onClick={handleDownloadCsv}
            className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-500 text-left transition-all cursor-pointer shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-2.5 shadow-xs">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-900">
                Cognitive Metrics (.csv)
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Raw session metrics, response latencies (ms), error counts, and accuracy scores for Excel / Sheets.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
              <span>Download File</span>
              <Download className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Format 3: Mood Logs CSV */}
          <button
            onClick={handleDownloadMoodCsv}
            className="p-4 rounded-2xl border-2 border-rose-300 bg-rose-50/50 hover:bg-rose-100 hover:border-rose-500 text-left transition-all cursor-pointer shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2.5 shadow-xs">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-rose-950">
                Wellbeing Logs (.csv)
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Daily 5-emoji mood check-ins, timestamps, verbal feedback, and longitudinal affect records.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-rose-200 flex items-center justify-between text-xs font-bold text-rose-900">
              <span>Download File</span>
              <Download className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Format 4: JSON Data Backup */}
          <button
            onClick={handleDownloadJson}
            className="p-4 rounded-2xl border-2 border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100 hover:border-indigo-500 text-left transition-all cursor-pointer shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white flex items-center justify-center mb-2.5 shadow-xs">
                <FileCode className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-900">
                Full Database (.json)
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Full structured data archive including profile, difficulty calibration, alerts, and mood check-ins.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-200 flex items-center justify-between text-xs font-bold text-indigo-900">
              <span>Download File</span>
              <Download className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Quick Print & Project Archive Downloads */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Ready for doctor visit? Print directly or download the complete project archive.</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/SmrithiSangam_SIH26003_Source.tar.gz"
              download="SmrithiSangam_SIH26003_Source.tar.gz"
              className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Project Code (.tar.gz)</span>
            </a>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
