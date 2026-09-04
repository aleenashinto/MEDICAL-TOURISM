"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  CheckCheck, 
  Clock, 
  Paperclip,
  ShieldCheck
} from "lucide-react";

export default function MessagesAdminPage() {
  const [selectedPatient, setSelectedPatient] = useState("Sarah Jenkins");
  const [replyText, setReplyText] = useState("");

  const conversations = [
    {
      patient: "Sarah Jenkins",
      caseId: "CAS-2026-089",
      lastMessage: "Thank you! I have downloaded the visa invitation letter.",
      time: "10 mins ago",
      unread: false,
    },
    {
      patient: "Mohammed Al-Maktoum",
      caseId: "CAS-2026-088",
      lastMessage: "Can we schedule the video consultation for Saturday?",
      time: "2 hours ago",
      unread: true,
    },
    {
      patient: "David Miller",
      caseId: "CAS-2026-087",
      lastMessage: "Our flight has landed at Cochin Airport. Chauffeur is waiting.",
      time: "Yesterday",
      unread: false,
    },
  ];

  const messagesHistory = [
    {
      sender: "patient",
      name: "Sarah Jenkins",
      text: "Hello, when will my medical visa invitation letter be ready?",
      time: "Sep 02, 10:15",
    },
    {
      sender: "admin",
      name: "Admin Coordinator",
      text: "Hello Sarah, Dr. Vijay Anand from Aster Medcity has approved and signed your letter. You can download it directly from your travel dashboard.",
      time: "Sep 02, 11:30",
    },
    {
      sender: "patient",
      name: "Sarah Jenkins",
      text: "Thank you! I have downloaded the visa invitation letter.",
      time: "Sep 02, 12:00",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Patient Communication & Live Messages
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            2-Role secure bidirectional messaging between Admin Coordinators and International Patients.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        {/* Patient Conversations Sidebar */}
        <div className="border-r border-slate-800 flex flex-col justify-between">
          <div className="p-3.5 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient chat..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {conversations.map((c) => (
              <button
                key={c.patient}
                onClick={() => setSelectedPatient(c.patient)}
                className={`w-full text-left p-3.5 hover:bg-slate-900/50 transition-colors flex items-start justify-between gap-2 ${
                  selectedPatient === c.patient ? "bg-slate-900/80 border-l-2 border-[#0E82FD]" : ""
                }`}
              >
                <div>
                  <div className="font-semibold text-xs text-slate-200">{c.patient}</div>
                  <div className="text-[10px] text-blue-400 font-mono">{c.caseId}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">{c.lastMessage}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-500">{c.time}</div>
                  {c.unread && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full bg-slate-900/30">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                {selectedPatient.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="font-bold text-xs text-white">{selectedPatient}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> End-to-end Encrypted
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messagesHistory.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "admin" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-md p-3 rounded-2xl text-xs ${
                    m.sender === "admin"
                      ? "bg-[#0E82FD] text-white rounded-br-none"
                      : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your response to the patient..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
            <button className="p-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
