"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Clock, 
  UserCheck
} from "lucide-react";

export default function PatientMessagesPage() {
  const [replyText, setReplyText] = useState("");

  const messages = [
    {
      sender: "patient",
      text: "Hello, when will my medical visa invitation letter be ready?",
      time: "Sep 02, 10:15",
    },
    {
      sender: "coordinator",
      text: "Hello Sarah, Dr. Vijay Anand from Aster Medcity has approved and signed your letter. You can download it directly from your travel dashboard.",
      time: "Sep 02, 11:30",
    },
    {
      sender: "patient",
      text: "Thank you! I have downloaded the visa invitation letter.",
      time: "Sep 02, 12:00",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Care Coordinator Messaging
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Direct secure channel with your dedicated Kerala patient coordinator and clinical liaison.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-[550px] flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Rahul Nair (Patient Coordinator)</div>
              <div className="text-[11px] text-slate-500">Aster Medcity Care Desk</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.sender === "patient" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-md p-3 rounded-2xl text-xs ${
                  m.sender === "patient"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm"
                }`}
              >
                <p>{m.text}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message to your coordinator..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
