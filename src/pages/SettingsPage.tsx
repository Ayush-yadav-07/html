import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  Trash2, 
  Download, 
  Upload, 
  ShieldCheck, 
  Check, 
  Layers, 
  Sparkles, 
  Info,
  Database,
  User,
  Bell,
  HardDrive,
  Globe,
  Wallet
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';

export const SettingsPage: React.FC = () => {
  const { 
    resetToDemoData, 
    clearAllData, 
    exportDataJSON, 
    importDataJSON, 
    showToast,
    stats,
    events,
    guests,
    expenses,
    vendors,
    tasks,
    tables,
    activities
  } = useEventContext();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Local notification preference toggles
  const [toastAlerts, setToastAlerts] = useState(true);
  const [budgetWarnings, setBudgetWarnings] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EventEase_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Backup JSON exported successfully.', 'success');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) {
      showToast('Please enter JSON data to import.', 'error');
      return;
    }
    const success = importDataJSON(importJsonText);
    if (success) {
      setShowImportModal(false);
      setImportJsonText('');
    }
  };

  // Rough estimation of storage used in KB
  const estimatedStorageKB = Math.round(
    ((JSON.stringify(events).length +
      JSON.stringify(guests).length +
      JSON.stringify(expenses).length +
      JSON.stringify(vendors).length +
      JSON.stringify(tasks).length +
      JSON.stringify(tables).length +
      JSON.stringify(activities).length) * 2) / 1024
  );

  return (
    <div className="space-y-6 pb-16 max-w-5xl">
      {/* College Project Viva Banner - Deep Ink & Warm Accents */}
      <div className="bg-[#29231F] rounded-2xl p-6 text-[#F7F0E5] border border-[#483329] shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#D98261]/15 to-transparent pointer-events-none rounded-full blur-2xl" />
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D98261]/25 text-[#D98261] border border-[#D98261]/40 uppercase tracking-wider">
            Academic Viva Capstone Project
          </span>
          <span className="w-2 h-2 rounded-full bg-[#A6A77A] animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold font-editorial text-[#FCF8F1] tracking-tight relative z-10">
          EventEase — Warm Editorial Event Planning & Management Studio
        </h2>
        <p className="text-xs sm:text-sm text-[#F7F0E5]/80 mt-2 max-w-2xl leading-relaxed relative z-10">
          Engineered as a full-featured, zero-dependency offline client-side single page application. Built with React 19, TypeScript, Tailwind CSS, and resilient HTML5 localStorage data persistence models.
        </p>
      </div>

      {/* 1. User & Planner Profile Card */}
      <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D98261]/15 text-[#D98261] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">Event Planner Profile</h3>
              <p className="text-xs text-[#483329]/65">Coordinator session details and administrative credentials</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#A6A77A]/15 text-[#A6A77A] border border-[#A6A77A]/30">
            Active Session
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
            <span className="text-[#483329]/60 font-medium block">Lead Planner Name</span>
            <span className="text-sm font-bold font-editorial text-[#29231F] mt-0.5 block">Ayush Yadav</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
            <span className="text-[#483329]/60 font-medium block">Organization / Department</span>
            <span className="text-sm font-bold font-editorial text-[#29231F] mt-0.5 block">Department of Computer Science (Viva Project)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
            <span className="text-[#483329]/60 font-medium block">Contact Email</span>
            <span className="text-sm font-bold font-mono text-[#29231F] mt-0.5 block">ayushyadav967233@gmail.com</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
            <span className="text-[#483329]/60 font-medium block">Role & Permissions</span>
            <span className="text-sm font-bold text-[#D98261] mt-0.5 block">Lead Event Coordinator (Super Admin)</span>
          </div>
        </div>
      </div>

      {/* 2. Currency, Regional & Notification Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency & Regional Settings */}
        <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#D98261]/15 text-[#D98261] flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">Currency & Regional Standard</h3>
            </div>
            <p className="text-xs text-[#483329]/65 mb-4">
              Configured for standard Indian accounting formats and numbering
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
                <span className="font-medium text-[#483329]">Display Currency</span>
                <span className="font-bold text-[#29231F] font-mono">INR (₹ Indian Rupee)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
                <span className="font-medium text-[#483329]">Numbering System</span>
                <span className="font-bold text-[#29231F]">Lakhs & Crores (en-IN)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1]">
                <span className="font-medium text-[#483329]">Fiscal Calculation</span>
                <span className="font-bold text-[#A6A77A]">Auto-balanced real-time</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6D5C1] text-xs text-[#483329]/60">
            Preview format: <strong className="text-[#29231F] font-mono font-bold">₹18,00,000</strong>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#D98261]/15 text-[#D98261] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">Notification Preferences</h3>
            </div>
            <p className="text-xs text-[#483329]/65 mb-4">
              Configure in-app feedback alerts and threshold indicators
            </p>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] cursor-pointer hover:border-[#D98261]/40 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-[#29231F] block">In-App Toast Alerts</span>
                  <span className="text-[11px] text-[#483329]/65">Show floating confirmation on all CRUD actions</span>
                </div>
                <input
                  type="checkbox"
                  checked={toastAlerts}
                  onChange={(e) => {
                    setToastAlerts(e.target.checked);
                    showToast(e.target.checked ? 'Toast feedback enabled' : 'Toast feedback disabled', 'info');
                  }}
                  className="w-4 h-4 text-[#D98261] accent-[#D98261] rounded-sm focus:ring-[#D98261]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] cursor-pointer hover:border-[#D98261]/40 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-[#29231F] block">Over-Budget Warning Banners</span>
                  <span className="text-[11px] text-[#483329]/65">Alert when spending crosses 80% or exceeds limit</span>
                </div>
                <input
                  type="checkbox"
                  checked={budgetWarnings}
                  onChange={(e) => {
                    setBudgetWarnings(e.target.checked);
                    showToast('Budget alert preferences updated', 'info');
                  }}
                  className="w-4 h-4 text-[#D98261] accent-[#D98261] rounded-sm focus:ring-[#D98261]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] cursor-pointer hover:border-[#D98261]/40 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-[#29231F] block">Milestone Deadline Reminders</span>
                  <span className="text-[11px] text-[#483329]/65">Highlight pending tasks near their scheduled dates</span>
                </div>
                <input
                  type="checkbox"
                  checked={deadlineReminders}
                  onChange={(e) => {
                    setDeadlineReminders(e.target.checked);
                    showToast('Milestone reminders preference updated', 'info');
                  }}
                  className="w-4 h-4 text-[#D98261] accent-[#D98261] rounded-sm focus:ring-[#D98261]"
                />
              </label>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6D5C1] text-xs text-[#483329]/60">
            Preferences saved to browser session
          </div>
        </div>
      </div>

      {/* 3. Data Persistence Status & Controls */}
      <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D98261]/15 text-[#D98261] flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">Data Persistence Status</h3>
              <p className="text-xs text-[#483329]/65 mt-0.5">
                Local storage health and database records count
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6A77A]/15 text-[#A6A77A] border border-[#A6A77A]/30 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#A6A77A] animate-pulse"></span>
            Synced & Persistent
          </div>
        </div>

        {/* Database Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
            <span className="text-[10px] font-bold uppercase text-[#483329]/60">Total Events</span>
            <span className="text-xl font-bold font-editorial text-[#29231F] block mt-0.5">{events.length}</span>
          </div>
          <div className="p-3.5 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
            <span className="text-[10px] font-bold uppercase text-[#483329]/60">Guest Entries</span>
            <span className="text-xl font-bold font-editorial text-[#29231F] block mt-0.5">{guests.length}</span>
          </div>
          <div className="p-3.5 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
            <span className="text-[10px] font-bold uppercase text-[#483329]/60">Invoices & Vouchers</span>
            <span className="text-xl font-bold font-editorial text-[#29231F] block mt-0.5">{expenses.length}</span>
          </div>
          <div className="p-3.5 bg-[#F7F0E5] rounded-xl border border-[#E6D5C1] text-center">
            <span className="text-[10px] font-bold uppercase text-[#483329]/60">Storage Used</span>
            <span className="text-xl font-bold font-mono text-[#D98261] block mt-0.5">~{estimatedStorageKB} KB</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reset Demo Data */}
          <div className="p-4 rounded-xl border border-[#E6D5C1] bg-[#F7F0E5] flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold font-editorial text-[#29231F] flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#D98261]" />
                Reset to Realistic Demo Data
              </h4>
              <p className="text-xs text-[#483329]/70 mt-1 leading-relaxed">
                Reloads curated realistic Indian wedding, tech conference, and gala celebration datasets with guests, expenses, vendors, and seating.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E6D5C1]">
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full px-4 py-2 text-xs font-semibold text-white bg-[#D98261] hover:bg-[#B96E42] active:scale-98 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Reload Demo Data
              </button>
            </div>
          </div>

          {/* Clear All Data */}
          <div className="p-4 rounded-xl border border-[#B96E42]/30 bg-[#B96E42]/10 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold font-editorial text-[#29231F] flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-[#B96E42]" />
                Clear All Application Data
              </h4>
              <p className="text-xs text-[#483329]/70 mt-1 leading-relaxed">
                Clears all events, guests, expenses, and tables from localStorage. Useful for demonstrating empty state views and fresh inputs during viva.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#B96E42]/20">
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="w-full px-4 py-2 text-xs font-semibold text-[#B96E42] bg-[#FCF8F1] border border-[#B96E42]/40 hover:bg-[#B96E42] hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Clear Database
              </button>
            </div>
          </div>
        </div>

        {/* JSON Backup & Restore */}
        <div className="mt-5 pt-5 border-t border-[#E6D5C1] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#483329]/65">
            Records stored securely in local browser storage (HTML5 Web Storage API)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#483329] bg-[#F7F0E5] border border-[#E6D5C1] hover:bg-[#E6D5C1]/40 rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D98261]" />
              <span>Export JSON Backup</span>
            </button>
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#483329] bg-[#F7F0E5] border border-[#E6D5C1] hover:bg-[#E6D5C1]/40 rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#D98261]" />
              <span>Import JSON Backup</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Examination Viva Demonstration Checklist */}
      <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs">
        <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight mb-1">
          College Viva Demonstration Walkthrough
        </h3>
        <p className="text-xs text-[#483329]/65 mb-4">
          Recommended sequential flow for demonstrating the platform to examiners
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#D98261]">
              <span className="w-5 h-5 rounded-full bg-[#D98261]/20 text-[#D98261] flex items-center justify-center text-[10px] font-mono">1</span>
              <span>Overview & Event Scoping</span>
            </div>
            <p className="text-[#483329]/80 leading-relaxed">
              Show All Events Overview on the Dashboard, then select a specific event from the top switcher to watch all stats update dynamically.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#D98261]">
              <span className="w-5 h-5 rounded-full bg-[#D98261]/20 text-[#D98261] flex items-center justify-center text-[10px] font-mono">2</span>
              <span>Operations & CRUD Flow</span>
            </div>
            <p className="text-[#483329]/80 leading-relaxed">
              Demonstrate adding an attendee with instant RSVP calculation, adding an expense voucher with budget health alerts, and configuring a seating table.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#D98261]">
              <span className="w-5 h-5 rounded-full bg-[#D98261]/20 text-[#D98261] flex items-center justify-center text-[10px] font-mono">3</span>
              <span>Analytics & CSV/Print</span>
            </div>
            <p className="text-[#483329]/80 leading-relaxed">
              Navigate to Reports & Analytics to show the Health Score Index, multi-event comparison table, and live CSV export/print report feature.
            </p>
          </div>
        </div>
      </div>

      {/* 5. About EventEase Section */}
      <div className="bg-[#FCF8F1] rounded-2xl p-6 border border-[#E6D5C1] shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-[#D98261]/15 text-[#D98261] flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold font-editorial text-[#29231F] tracking-tight">About EventEase</h3>
        </div>

        <div className="space-y-4 text-xs text-[#483329]/80 leading-relaxed">
          <div>
            <h4 className="font-bold text-[#29231F] font-editorial text-sm">EventEase — Warm Editorial Event Planning & Management Studio</h4>
            <p className="mt-1 text-[#483329]/80">
              <strong>Purpose:</strong> A responsive, cohesive event planning studio designed to organize events, guests, RSVPs, budgets, vendors, timeline milestones, and seating layouts in one place.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E6D5C1]">
            <span className="font-semibold text-[#29231F] block mb-2 font-editorial text-sm">Technology Architecture:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] font-medium text-[#29231F]">
                • React 19 SPA
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] font-medium text-[#29231F]">
                • TypeScript 5.8
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] font-medium text-[#29231F]">
                • HTML5 LocalStorage
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] font-medium text-[#29231F]">
                • Warm Editorial 3D
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetToDemoData}
        title="Reset to Demo Data"
        message="This will overwrite current changes with the default realistic Indian wedding and conference showcase dataset. Continue?"
        confirmLabel="Reload Demo Data"
        isDestructive={false}
      />

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearAllData}
        title="Clear All Data"
        message="This will permanently wipe all local events, attendees, expenses, tasks, and tables. You can reload demo data at any time."
        confirmLabel="Clear Database"
        isDestructive={true}
      />

      {/* Import Modal */}
      {showImportModal && (
        <Modal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          title="Import Application State JSON"
          subtitle="Paste a valid EventEase JSON backup below"
          maxWidth="lg"
        >
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <textarea
              rows={8}
              placeholder='{"events": [...], "guests": [...], "expenses": [...]}'
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-[#F7F0E5] border border-[#E6D5C1] text-[#29231F] rounded-xl focus:outline-none focus:border-[#D98261]"
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6D5C1]">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#483329] bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl hover:bg-[#E6D5C1]/50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#D98261] hover:bg-[#B96E42] rounded-xl cursor-pointer shadow-xs"
              >
                Import State
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
