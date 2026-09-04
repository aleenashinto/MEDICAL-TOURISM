"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  ShieldAlert,
  KeyRound,
  Globe,
  Eye,
  EyeOff
} from "lucide-react";

export default function PatientSettingsPage() {
  const [activeTab, setActiveTab] = useState<"security" | "notifications" | "preferences">("security");
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false);

  // Notification preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [documentUpdates, setDocumentUpdates] = useState(true);
  const [prefSuccess, setPrefSuccess] = useState(false);

  // Language & Localization
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess(false);

    if (!currentPassword) {
      setPwdError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setPwdError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPwdError("New passwords do not match. Please verify.");
      return;
    }

    if (currentPassword === newPassword) {
      setPwdError("New password must be different from current password.");
      return;
    }

    setIsUpdatingPwd(true);

    setTimeout(() => {
      setIsUpdatingPwd(false);
      setPwdSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPwdSuccess(false), 3500);
    }, 800);
  };

  const handlePrefSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefSuccess(true);
    setTimeout(() => setPrefSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Account Settings & Security
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your credentials, notification channels, and portal localization preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        {[
          { id: "security", label: "Change Password & Security", icon: Lock },
          { id: "notifications", label: "Notification Channels", icon: Bell },
          { id: "preferences", label: "Language & Currency", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                isActive
                  ? "border-[#0E82FD] text-[#0E82FD]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Change Password Tab */}
      {activeTab === "security" && (
        <form onSubmit={handlePasswordSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Change Account Password</h2>
              <p className="text-xs text-slate-500">Ensure your new password contains at least 8 characters.</p>
            </div>
            <KeyRound className="w-5 h-5 text-blue-500" />
          </div>

          {pwdError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}

          {pwdSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Password successfully updated! Your active session is secure.</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password *</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min 8 chars) *</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
                setPwdError("");
              }}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingPwd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isUpdatingPwd ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      )}

      {/* 2. Notification Preferences Tab */}
      {activeTab === "notifications" && (
        <form onSubmit={handlePrefSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Notification Preferences</h2>
            <p className="text-xs text-slate-500">Choose how MAIDES and your Kerala hospital care liaison contact you.</p>
          </div>

          {prefSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Notification preferences saved!</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="mt-0.5 rounded text-[#0E82FD] focus:ring-[#0E82FD]"
              />
              <div>
                <strong className="block text-slate-900 font-bold">Email Notifications</strong>
                <span className="text-slate-500">Receive Medical Visa invitation letters, treatment estimates, and invoice receipts.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="mt-0.5 rounded text-[#0E82FD] focus:ring-[#0E82FD]"
              />
              <div>
                <strong className="block text-slate-900 font-bold">SMS / WhatsApp Real-Time Alerts</strong>
                <span className="text-slate-500">Get instant flight arrival liaison alerts and Kerala airport chauffeur tracking.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
              <input
                type="checkbox"
                checked={appointmentReminders}
                onChange={(e) => setAppointmentReminders(e.target.checked)}
                className="mt-0.5 rounded text-[#0E82FD] focus:ring-[#0E82FD]"
              />
              <div>
                <strong className="block text-slate-900 font-bold">Appointment Reminders</strong>
                <span className="text-slate-500">24-hour and 1-hour reminders before scheduled video consultations with doctors.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
              <input
                type="checkbox"
                checked={documentUpdates}
                onChange={(e) => setDocumentUpdates(e.target.checked)}
                className="mt-0.5 rounded text-[#0E82FD] focus:ring-[#0E82FD]"
              />
              <div>
                <strong className="block text-slate-900 font-bold">Medical Record Review Updates</strong>
                <span className="text-slate-500">Notifications when your treating hospital adds a prescription or clinical note.</span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              Save Notification Settings
            </button>
          </div>
        </form>
      )}

      {/* 3. Language & Localization Tab */}
      {activeTab === "preferences" && (
        <form onSubmit={handlePrefSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Language & Currency Preferences</h2>
            <p className="text-xs text-slate-500">Set your preferred portal display language and billing currency.</p>
          </div>

          {prefSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Language & currency preferences saved!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              >
                <option value="en">English (UK/International)</option>
                <option value="ar">??????? (Arabic)</option>
                <option value="ml">?????? (Malayalam)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="AED">AED (?.?) - UAE Dirham</option>
                <option value="SAR">SAR (?) - Saudi Riyal</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="INR">INR (?) - Indian Rupee</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
