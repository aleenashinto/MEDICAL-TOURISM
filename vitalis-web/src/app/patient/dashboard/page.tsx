"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  Calendar, 
  Plane, 
  CreditCard, 
  ArrowRight,
  UserCheck,
  RefreshCw,
  Info,
  MapPin,
  Mail,
  AlertCircle
} from "lucide-react";

export default function PatientDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/patient/dashboard');
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const json = await res.json();
      
      if (json.error) {
        throw new Error(json.error);
      }
      
      setData(json);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-blue-500">
        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm font-medium">Loading your medical dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-600 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to load your dashboard</h2>
        <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
          {error}. We could not retrieve your medical information at this time.
        </p>
        <button 
          onClick={fetchDashboardData}
          className="px-6 py-2 bg-[#0E82FD] text-white font-semibold rounded-xl text-sm shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { patient, activeCase, nextAppointment, visa, billing, journey, isDemo } = data;

  return (
    <div className="space-y-6">
      {/* Top action bar: Refresh & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {isDemo ? (
          <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Viewing <strong>Demo Data</strong></span>
          </div>
        ) : <div />}
        
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-[10px] sm:text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" /> Last updated: {lastUpdated}
          </span>
          <button 
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F2042] via-[#1E3A8A] to-[#0E82FD] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
              Patient ID: {patient.id}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              patient.verificationStatus === 'Verified' 
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30' 
                : 'bg-amber-500/30 text-amber-200 border border-amber-400/30'
            }`}>
              <UserCheck className="w-3.5 h-3.5" />
              {patient.verificationStatus} Patient
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome back, {(patient?.name || "Patient").split(' ')[0]}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 pt-1">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-300" />
              <span>{patient.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              <span>{patient.patientType} Patient ({patient.location})</span>
            </div>
          </div>

          {activeCase && (
            <p className="text-blue-100 text-xs md:text-sm pt-2 leading-relaxed">
              Your <span className="font-semibold text-white">{activeCase.treatment}</span> pathway with {activeCase.hospital} is currently in{" "}
              <span className="font-bold text-white underline decoration-sky-400 decoration-2">{activeCase.status}</span>.
            </p>
          )}
        </div>
      </div>

      {!activeCase ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartPulse className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Active Case Found</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            You do not have an active medical journey at this time. If you have submitted an inquiry, our medical board is reviewing your records.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/patient/support" className="px-4 py-2 bg-[#0E82FD] text-white font-semibold rounded-xl text-sm shadow-sm hover:bg-blue-600 transition-colors">
              Contact Care Coordinator
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Case
                </span>
                <HeartPulse className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 line-clamp-1" title={activeCase.treatment}>{activeCase.treatment}</div>
                <div className="text-xs text-blue-600 font-medium mt-1 truncate" title={activeCase.hospital}>{activeCase.hospital}</div>
                <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">ID: {activeCase.id.slice(0,10)}...</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Next Appointment
                </span>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                {nextAppointment ? (
                  <>
                    <div className="text-sm font-bold text-slate-900">
                      {new Date(nextAppointment.dateTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-1 truncate">{nextAppointment.service}</div>
                    <div className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wide">{nextAppointment.status}</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-slate-900">No Upcoming</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Your coordinator will schedule your next visit</div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Medical Visa
                </span>
                <Plane className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className={`text-sm font-bold ${visa.status === 'Not Required' ? 'text-slate-500' : 'text-emerald-600'}`}>
                  {visa.status}
                </div>
                {visa.reference && (
                  <div className="text-xs text-slate-500 font-medium mt-1">Ref: {visa.reference}</div>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Payment Status
                </span>
                <CreditCard className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                {billing.total > 0 ? (
                  <>
                    <div className="text-sm font-bold text-slate-900">{billing.currency} {billing.paid.toLocaleString()} Paid</div>
                    <div className="text-xs text-amber-600 font-medium mt-1">{billing.currency} {billing.balance.toLocaleString()} Balance</div>
                  </>
                ) : (
                  <div className="text-sm font-bold text-slate-900">No Invoices</div>
                )}
              </div>
            </div>
          </div>

          {/* Journey Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Medical Journey Timeline</h2>
                <p className="text-xs text-slate-500">Track your treatment milestones step-by-step</p>
              </div>
              <Link
                href="/patient/cases"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View Full Case <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {journey.map((stageInfo: any, index: number) => {
                const isCompleted = stageInfo.status === "completed";
                const isCurrent = stageInfo.status === "current";
                const isPending = stageInfo.status === "pending";

                let ringClass = "bg-slate-300 text-white";
                let textClass = "text-slate-900";
                
                if (isCompleted) {
                  ringClass = "bg-emerald-500 text-white";
                } else if (isCurrent) {
                  ringClass = "bg-blue-600 ring-4 ring-blue-100 text-white";
                  textClass = "text-blue-600";
                }

                return (
                  <div key={stageInfo.stage} className={`relative ${isPending ? 'opacity-50' : ''}`}>
                    <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${ringClass}`}>
                      {stageInfo.stage}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${textClass}`}>{stageInfo.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{stageInfo.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
