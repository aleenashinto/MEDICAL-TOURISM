"use client";

import React, { useState } from "react";
import { 
  Plane, 
  FileText, 
  Calendar, 
  Hotel, 
  Car, 
  Plus, 
  Download, 
  CheckCircle2, 
  Clock, 
  Building2,
  Send,
  UserCheck
} from "lucide-react";

export default function TravelVisasPage() {
  const [activeSubTab, setActiveSubTab] = useState("VISAS");

  const visaRequests = [
    {
      caseId: "CAS-2026-089",
      patient: "Sarah Jenkins",
      country: "United Kingdom",
      hospital: "Aster Medcity, Kochi",
      attendant: "Mark Jenkins (Spouse)",
      passportNo: "UK9988221A",
      issueDate: "2026-09-02",
      status: "ISSUED_DOWNLOADED",
      pdfUrl: "#",
    },
    {
      caseId: "CAS-2026-088",
      patient: "Mohammed Al-Maktoum",
      country: "UAE",
      hospital: "Amrita Institute",
      attendant: "Ali Al-Maktoum (Brother)",
      passportNo: "AE4433221C",
      issueDate: "2026-09-04",
      status: "GENERATED_PENDING_EMBASSY",
      pdfUrl: "#",
    },
  ];

  const airportTransfers = [
    {
      patient: "David Miller",
      flight: "EK 530 from Dubai (DXB)",
      arrivalAirport: "Cochin International Airport (COK)",
      arrivalDateTime: "2026-09-04 18:45 IST",
      vehicleType: "Toyota Innova Crysta (AC Medical Escort)",
      driverName: "Suresh Babu (+91 94470 12345)",
      destination: "Aster Medcity & Kochi Marriott Hotel",
      status: "DISPATCHED",
    },
    {
      patient: "Fatima Al-Zahra",
      flight: "QR 514 from Doha (DOH)",
      arrivalAirport: "Cochin International Airport (COK)",
      arrivalDateTime: "2026-09-05 08:30 IST",
      vehicleType: "Luxury Mercedes Van (Wheelchair Accessible)",
      driverName: "Manoj Kumar (+91 94470 67890)",
      destination: "Amrita Institute & Grand Hyatt Kochi",
      status: "ASSIGNED",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Logistics, Visas & Ground Transfers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate FRRO compliant Indian Medical Visa invitation letters, schedule airport liaisons, and coordinate recovery hotel stays.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          Generate Visa Letter
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "VISAS", label: "Medical Visa Invitations", icon: FileText },
          { id: "AIRPORT", label: "COK Airport & Transfers", icon: Car },
          { id: "HOTELS", label: "Partner Hotel Accommodations", icon: Hotel },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSubTab === tab.id
                  ? "bg-[#0E82FD] text-white"
                  : "text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content for Visas */}
      {activeSubTab === "VISAS" && (
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Case & Patient</th>
                  <th className="py-3 px-4">Origin Country & Passport</th>
                  <th className="py-3 px-4">Designated Kerala Hospital</th>
                  <th className="py-3 px-4">Accompanying Attendant</th>
                  <th className="py-3 px-4">Visa Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {visaRequests.map((v) => (
                  <tr key={v.caseId} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{v.patient}</div>
                      <div className="text-[11px] text-blue-400 font-mono">{v.caseId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">{v.country}</div>
                      <div className="text-[11px] text-slate-500">Doc: {v.passportNo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">{v.hospital}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">{v.attendant}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {v.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white text-xs font-semibold transition-all">
                        <Download className="w-3.5 h-3.5" />
                        Download Letter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content for Transfers */}
      {activeSubTab === "AIRPORT" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {airportTransfers.map((tr, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{tr.patient}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {tr.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div>Flight: <strong className="text-slate-200">{tr.flight}</strong></div>
                <div>Landing: <span className="text-blue-300 font-semibold">{tr.arrivalDateTime}</span></div>
                <div>Vehicle: <span className="text-slate-300">{tr.vehicleType}</span></div>
                <div>Assigned Chauffeur: <span className="text-emerald-400 font-medium">{tr.driverName}</span></div>
                <div>Route: <span className="text-slate-300">{tr.destination}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium">
                  Update Dispatch Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
