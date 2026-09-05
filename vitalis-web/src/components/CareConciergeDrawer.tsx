"use client";

import React, { useState } from "react";
import { 
  X, 
  Send, 
  Phone, 
  Video, 
  MessageSquare, 
  Bot, 
  Sparkles, 
  FileText, 
  Plane, 
  ShieldCheck, 
  CheckCheck,
  Palmtree,
  Leaf
} from "lucide-react";

interface CareConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIntake?: () => void;
}

export function CareConciergeDrawer({ isOpen, onClose, onOpenIntake }: CareConciergeDrawerProps) {
  const [activeTab, setActiveTab] = useState<'concierge' | 'ai'>('concierge');
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: 'agent' | 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Namaskaram! I am Anjali Menon, your dedicated Kerala Care Concierge. Whether you are seeking cardiac surgery in Kochi, cancer care in Trivandrum, or authentic Panchakarma in Kottakkal, I am here to coordinate your entire medical journey.',
      time: '11:42 AM'
    }
  ]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setInputMessage("");

    setTimeout(() => {
      let reply = "I understand completely. Let me coordinate directly with our accredited Kerala clinical board in Kochi or Trivandrum. Would you like me to open the AI record upload portal?";
      if (activeTab === 'ai') {
        reply = "For your requirement in Kerala, Aster Medcity (Kochi) and Rajagiri Hospital (Aluva) maintain a >99.4% cardiac surgery success rate, with Cochin International Airport (COK) located just 20 minutes away.";
      }
      setMessages((prev) => [...prev, { sender: activeTab === 'ai' ? 'ai' : 'agent', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full sm:max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="relative shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
                  alt="Anjali Menon" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-[#0E82FD]"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F2042] truncate">Anjali Menon</h3>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0E82FD] shrink-0">Kerala Concierge</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">International Patient Coordinator</p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Switcher */}
          <div className="mt-3 sm:mt-4 flex items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-200 gap-2">
            <div className="flex rounded-xl bg-slate-200/80 p-1">
              <button 
                onClick={() => setActiveTab('concierge')}
                className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'concierge' ? 'bg-white text-[#0E82FD] shadow-xs' : 'text-slate-600'
                }`}
              >
                Concierge
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                  activeTab === 'ai' ? 'bg-white text-[#0E82FD] shadow-xs' : 'text-slate-600'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#0E82FD]" />
                <span>AI Guide</span>
              </button>
            </div>

            <div className="flex items-center space-x-1.5">
              <a 
                href="https://wa.me" 
                target="_blank" 
                rel="noreferrer"
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] sm:text-xs font-bold flex items-center space-x-1 hover:bg-emerald-100 transition-all"
              >
                <span>WhatsApp</span>
              </a>
              <a href="tel:+914842908482" className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#0E82FD] flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 sm:space-y-4 bg-[#F8FAFC]">
          <div className="text-center my-1">
            <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-600">
              End-to-End Encryption • Kerala Medical Link
            </span>
          </div>

          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#0E82FD] text-white font-medium rounded-br-none shadow-md' 
                    : msg.sender === 'ai'
                    ? 'bg-blue-50 border border-blue-200 text-slate-800 rounded-bl-none shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex items-center space-x-1 text-[#0E82FD] font-bold text-[10px] mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>KERALA CLINICAL AI</span>
                  </div>
                )}
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center space-x-1">
                <span>{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto flex space-x-2 no-scrollbar">
          <button 
            onClick={() => {
              onClose();
              onOpenIntake?.();
            }}
            className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0E82FD] font-bold border border-blue-100 transition-colors"
          >
            📋 Upload Reports for Kerala Doctor Review
          </button>
          <button 
            onClick={() => setInputMessage("What is the cost for robotic knee replacement in Kochi vs Thrissur?")}
            className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            💰 Compare Kerala Surgery Costs
          </button>
          <button 
            onClick={() => setInputMessage("How do I book Panchakarma at Arya Vaidya Sala Kottakkal?")}
            className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-100 transition-colors"
          >
            🌿 Kottakkal Ayurveda Inquiry
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={activeTab === 'ai' ? "Ask AI medical guide about Kerala hospitals, stays, costs..." : "Message Anjali Menon (Kerala Care Concierge)..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0E82FD]"
          />
          <button 
            type="submit"
            className="p-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-700 text-white shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
