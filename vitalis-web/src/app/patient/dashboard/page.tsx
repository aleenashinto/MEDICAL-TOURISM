"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  Calendar, 
  FileText, 
  Plane, 
  CreditCard, 
  ArrowRight,
  Clock, 
  CheckCircle2,
  Building2,
  Stethoscope,
  AlertCircle,
  MapPin,
  Mail,
  UserCheck,
  RefreshCw,
  Info
} from "lucide-react";

export default function PatientDashboardPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    location: "",
    patientId: "MED-XXXX"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeCase, setActiveCase] = useState<any>(null);
  const [nextAppointment, setNextAppointment] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, casesRes, apptsRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/cases'),
          fetch('/api/appointments')
        ]);
        
        let isDemo = false;
        
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData.authenticated) {
             setUser({
               name: sessionData.session.name,
               email: sessionData.session.email,
               location: "International Patient",
               patientId: `MED-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
             });
             if (sessionData.session.email === "demo@vitalis.health" || sessionData.message?.includes("Demo")) {
               isDemo = true;
               setIsDemoMode(true);
             }
          }
        }
        
        if (casesRes.ok) {
          const casesData = await casesRes.json();
          if (casesData.cases && casesData.cases.length > 0) {
             setActiveCase(casesData.cases[0]);
          } else if (isDemo) {
             // Inject Mock Case for Demo users
             setActiveCase({
               id: "CASE-DEMO-1",
               treatment: "Cardiac Surgery (OPCABG)",
               hospital: "Aster Medcity Kochi",
               status: "Travel & Logistics",
               visaStatus: "Letter Issued",
               visaRef: "KL-MEDVISA-DEMO-8891",
               totalCost: 6400,
               amountPaid: 2000,
               currency: "USD",
               stage: 4
             });
          }
        }

        if (apptsRes.ok) {
           const apptsData = await apptsRes.json();
           if (apptsData.appointments && apptsData.appointments.length > 0) {
              setNextAppointment(apptsData.appointments[0]);
           } else if (isDemo) {
             setNextAppointment({
               dateTime: "Tomorrow, 10:00 AM",
               service: "Tele-consultation with Dr. Manoj Joseph"
             });
           }
        }

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isDemoMode && (
        <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 shrink-0" />
          <span>You are viewing <strong>Demo Data</strong> because the platform is running without a database connection.</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F2042] via-[#1E3A8A] to-[#0E82FD] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
              Patient ID: {user.patientId}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              Verified Patient
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome back, {user.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-300" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              <span>Location: {user.location}</span>
            </div>
          </div>

          {activeCase && (
            <p className="text-blue-100 text-xs md:text-sm pt-1 leading-relaxed">
              Your {activeCase.treatment.toLowerCase()} pathway with {activeCase.hospital} is currently in{" "}
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
            You do not have an active medical journey at this time. If you have submitted an inquiry, our coordinators are reviewing it.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/patient/support" className="px-4 py-2 bg-[#0E82FD] text-white font-semibold rounded-xl text-sm shadow-sm hover:bg-blue-600 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Case
                </span>
                <HeartPulse className="w-5 h-5 text-rose-500" />
              </div>
              <div className="mt-3">
                <div className="text-base font-bold text-slate-900 truncate" title={activeCase.treatment}>{activeCase.treatment}</div>
                <div className="text-xs text-blue-600 font-medium mt-0.5 truncate" title={activeCase.hospital}>{activeCase.hospital}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Next Appointment
                </span>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="mt-3">
                <div className="text-base font-bold text-slate-900">{nextAppointment ? nextAppointment.dateTime : "No Upcoming"}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5 truncate">{nextAppointment ? nextAppointment.service : "Book an appointment"}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Medical Visa
                </span>
                <Plane className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="mt-3">
                <div className="text-base font-bold text-emerald-600">{activeCase.visaStatus || "Not Required"}</div>
                {activeCase.visaRef && (
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Ref: {activeCase.visaRef}</div>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Payment Status
                </span>
                <CreditCard className="w-5 h-5 text-amber-500" />
              </div>
              <div className="mt-3">
                {activeCase.totalCost ? (
                  <>
                    <div className="text-base font-bold text-slate-900">{activeCase.currency} {activeCase.amountPaid || 0} Paid</div>
                    <div className="text-xs text-amber-600 font-medium mt-0.5">{activeCase.currency} {activeCase.totalCost - (activeCase.amountPaid || 0)} Balance</div>
                  </>
                ) : (
                  <div className="text-base font-bold text-slate-900">Calculating...</div>
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
              
              <div className={`relative ${activeCase.stage < 1 ? 'opacity-50' : ''}`}>
                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeCase.stage > 1 ? 'bg-emerald-500 text-white' : activeCase.stage === 1 ? 'bg-blue-600 ring-4 ring-blue-100 text-white' : 'bg-slate-300 text-white'}`}>
                  1
                </div>
                <div>
                  <div className={`text-sm font-semibold ${activeCase.stage === 1 ? 'text-blue-600' : 'text-slate-900'}`}>Enquiry Submitted & Qualified</div>
                  <div className="text-xs text-slate-500 mt-0.5">Clinical records reviewed by Medical Board</div>
                </div>
              </div>

              <div className={`relative ${activeCase.stage < 2 ? 'opacity-50' : ''}`}>
                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeCase.stage > 2 ? 'bg-emerald-500 text-white' : activeCase.stage === 2 ? 'bg-blue-600 ring-4 ring-blue-100 text-white' : 'bg-slate-300 text-white'}`}>
                  2
                </div>
                <div>
                  <div className={`text-sm font-semibold ${activeCase.stage === 2 ? 'text-blue-600' : 'text-slate-900'}`}>Doctor Second Opinion & Protocol Approved</div>
                  <div className="text-xs text-slate-500 mt-0.5">Treatment plan confirmed</div>
                </div>
              </div>

              <div className={`relative ${activeCase.stage < 3 ? 'opacity-50' : ''}`}>
                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeCase.stage > 3 ? 'bg-emerald-500 text-white' : activeCase.stage === 3 ? 'bg-blue-600 ring-4 ring-blue-100 text-white' : 'bg-slate-300 text-white'}`}>
                  3
                </div>
                <div>
                  <div className={`text-sm font-semibold ${activeCase.stage === 3 ? 'text-blue-600' : 'text-slate-900'}`}>Treatment Quotation Accepted</div>
                  <div className="text-xs text-slate-500 mt-0.5">Financial terms and package agreed</div>
                </div>
              </div>

              <div className={`relative ${activeCase.stage < 4 ? 'opacity-50' : ''}`}>
                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeCase.stage > 4 ? 'bg-emerald-500 text-white' : activeCase.stage === 4 ? 'bg-blue-600 ring-4 ring-blue-100 text-white' : 'bg-slate-300 text-white'}`}>
                  4
                </div>
                <div>
                  <div className={`text-sm font-semibold ${activeCase.stage === 4 ? 'text-blue-600' : 'text-slate-900'}`}>Travel, Visa & Airport Logistics (Current)</div>
                  <div className="text-xs text-slate-500 mt-0.5">Logistics in progress</div>
                </div>
              </div>

              <div className={`relative ${activeCase.stage < 5 ? 'opacity-50' : ''}`}>
                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeCase.stage > 5 ? 'bg-emerald-500 text-white' : activeCase.stage === 5 ? 'bg-blue-600 ring-4 ring-blue-100 text-white' : 'bg-slate-300 text-white'}`}>
                  5
                </div>
                <div>
                  <div className={`text-sm font-semibold ${activeCase.stage === 5 ? 'text-blue-600' : 'text-slate-900'}`}>Hospital Admission & Treatment</div>
                  <div className="text-xs text-slate-500 mt-0.5">{activeCase.hospital}</div>
                </div>
              </div>

              <div className={`relative ${activeCase.stage < 6 ? 'opacity-50' : ''}`}>
                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeCase.stage > 6 ? 'bg-emerald-500 text-white' : activeCase.stage === 6 ? 'bg-blue-600 ring-4 ring-blue-100 text-white' : 'bg-slate-300 text-white'}`}>
                  6
                </div>
                <div>
                  <div className={`text-sm font-semibold ${activeCase.stage === 6 ? 'text-blue-600' : 'text-slate-900'}`}>Discharge, Fit-to-Fly & Follow-Up</div>
                  <div className="text-xs text-slate-500 mt-0.5">Post-operative tele-consultations</div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
