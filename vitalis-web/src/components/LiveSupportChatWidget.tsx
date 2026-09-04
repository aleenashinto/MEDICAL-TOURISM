"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  ShieldCheck, 
  Headphones, 
  Clock, 
  Paperclip, 
  FileText, 
  Download, 
  Sparkles,
  CheckCheck,
  ChevronDown,
  Minimize2,
  Maximize2,
  UserCheck,
  Building2,
  PhoneCall
} from "lucide-react";

export interface SupportChatMessage {
  id: string;
  sender: "patient" | "admin";
  senderName: string;
  text: string;
  time: string;
  timestamp: string;
  category?: string;
  attachments?: { name: string; size: string }[];
}

const DEFAULT_CHAT_HISTORY: SupportChatMessage[] = [
  {
    id: "live-1",
    sender: "admin",
    senderName: "MAIDES Live Care Desk (Rahul Nair)",
    text: "Hello Sarah! Welcome to MAIDES Kerala 24/7 International Patient Support. How can we assist with your upcoming medical journey to Kochi today?",
    time: "10:00 AM",
    timestamp: "2026-09-04T10:00:00Z"
  },
  {
    id: "live-2",
    sender: "patient",
    senderName: "Sarah Jenkins",
    text: "Hello Rahul! I just wanted to confirm if our chauffeur will meet us inside Terminal 3 after baggage collection.",
    time: "10:05 AM",
    timestamp: "2026-09-04T10:05:00Z"
  },
  {
    id: "live-3",
    sender: "admin",
    senderName: "Rahul Nair (Senior Coordinator)",
    text: "Yes, exactly! Chauffeur Santhosh will be waiting at Arrival Gate 4 with a MAIDES personalized placard and wheelchair assistance if required.",
    time: "10:08 AM",
    timestamp: "2026-09-04T10:08:00Z"
  }
];

export function LiveSupportChatWidget({ userRole = "patient" }: { userRole?: "patient" | "admin" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState("General Support");
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load from shared storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("maides_live_support_chat_v3");
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages(DEFAULT_CHAT_HISTORY);
        localStorage.setItem("maides_live_support_chat_v3", JSON.stringify(DEFAULT_CHAT_HISTORY));
      }
    } catch (e) {
      setMessages(DEFAULT_CHAT_HISTORY);
    }
  }, []);

  // Sync to storage
  const syncMessages = (updated: SupportChatMessage[]) => {
    setMessages(updated);
    localStorage.setItem("maides_live_support_chat_v3", JSON.stringify(updated));
  };

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isPatient = userRole === "patient";

    const newMsg: SupportChatMessage = {
      id: "live-" + Date.now(),
      sender: isPatient ? "patient" : "admin",
      senderName: isPatient ? "Sarah Jenkins (UK Patient)" : "MAIDES Care Coordinator Desk",
      text: inputText.trim(),
      category: selectedTopic,
      time: timeStr,
      timestamp: new Date().toISOString()
    };

    const updated = [...messages, newMsg];
    syncMessages(updated);
    setInputText("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setUnreadCount(0);
          }}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#0E82FD] to-[#1E5DAE] hover:from-blue-600 hover:to-blue-800 text-white font-bold text-xs rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-white/20 backdrop-blur-md"
        >
          <div className="relative">
            <Headphones className="w-5 h-5 text-white animate-bounce" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-[#0E82FD]" />
          </div>
          <div className="text-left">
            <div className="leading-tight">24/7 Live Care Desk</div>
            <div className="text-[10px] text-blue-100 font-normal">Instant Coordinator Chat</div>
          </div>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Expanded Support Chat Box */}
      {isOpen && (
        <div 
          className={`bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized 
              ? "w-80 h-16" 
              : "w-[360px] sm:w-[420px] h-[540px]"
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0F2042] to-[#172A45] border-b border-slate-800 flex items-center justify-between text-white select-none">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-[#0E82FD] flex items-center justify-center font-bold text-sm border border-blue-500/30">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5">
                  MAIDES Care Desk
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400">
                  {userRole === "admin" ? "Admin Support Console" : "Coordinator: Rahul Nair (Aster Medcity)"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Topic Chips */}
              <div className="p-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px]">
                {["General Support", "Flight Arrival", "Visa / FRRO", "Surgery Cost"].map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                      selectedTopic === topic
                        ? "bg-[#0E82FD] text-white font-bold"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80 text-xs">
                {messages.map((m) => {
                  const isCurrentRole = 
                    (userRole === "patient" && m.sender === "patient") || 
                    (userRole === "admin" && m.sender === "admin");

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isCurrentRole ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 mb-0.5 px-1">
                        <span className="font-semibold text-slate-400">{m.senderName}</span>
                        <span>•</span>
                        <span>{m.time}</span>
                      </div>

                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                          isCurrentRole
                            ? "bg-[#0E82FD] text-white rounded-tr-none font-normal"
                            : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      </div>

                      {isCurrentRole && (
                        <div className="flex items-center gap-0.5 text-[9px] text-blue-400 mt-0.5 px-1">
                          <CheckCheck className="w-2.5 h-2.5" />
                          <span>Delivered</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={userRole === "admin" ? "Reply as MAIDES coordinator..." : "Type your question to care team..."}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2 bg-[#0E82FD] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl shadow-md transition-all active:scale-95 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                <div className="text-[9px] text-slate-500 mt-1.5 flex items-center justify-between px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                    HIPAA 256-bit Encrypted
                  </span>
                  <span>Average response: &lt; 2 mins</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
