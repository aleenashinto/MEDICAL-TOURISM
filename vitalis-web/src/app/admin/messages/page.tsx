"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  CheckCheck, 
  Clock, 
  Paperclip,
  ShieldCheck,
  Filter,
  Plus,
  X,
  FileText,
  Download,
  AlertCircle,
  Archive,
  RefreshCw,
  Tag,
  Calendar,
  Briefcase,
  Hospital,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  PhoneCall,
  Video,
  File,
  Sparkles,
  Trash2,
  CheckCircle,
  Eye,
  Info,
  CornerDownLeft,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Activity,
  SmilePlus,
  Zap,
  HelpCircle,
  UserCheck
} from "lucide-react";

export interface ChatAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "admin" | "patient";
  senderName: string;
  text: string;
  category?: "General" | "Medical Case" | "Appointment" | "Travel & Visa" | "Billing & Escrow" | "Support";
  time: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachments?: ChatAttachment[];
}

export interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientCountry: string;
  caseId: string;
  treatment: string;
  hospital: string;
  assignedStaff: string;
  status: "Open" | "Active" | "Waiting for Patient" | "Waiting for Admin" | "Resolved" | "Closed" | "Archived";
  category: "General" | "Medical Case" | "Appointment" | "Travel & Visa" | "Billing & Escrow" | "Support";
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  updatedAt: string;
}

const QUICK_TEMPLATES = [
  { label: "Visa Letter Ready", text: "Hello, your hospital-stamped Medical Visa Invitation Letter has been generated and approved. Please find it attached below for your embassy appointment.", category: "Travel & Visa" as const },
  { label: "Video Consult Link", text: "Dr. Vijay Anand has confirmed your tele-consultation for tomorrow at 3:00 PM IST. Join video room: https://meet.maides.kerala.gov.in/room-", category: "Appointment" as const },
  { label: "Airport Chauffeur", text: "Welcome to Kerala! Your private hospital chauffeur (Driver: Santhosh, +91 98471 23456) will receive you at Cochin Airport (COK) International Arrival Gate 3 with a name placard.", category: "Travel & Visa" as const },
  { label: "Reports Received", text: "We have safely received your medical imaging & laboratory records. Our multidisciplinary tumor board is reviewing them today and will provide the treatment estimate.", category: "Medical Case" as const },
  { label: "Discharge & Escrow", text: "Your discharge summary is finalized and your medical escrow payment account has been reconciled with the hospital billing department.", category: "Billing & Escrow" as const },
];

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    patientId: "pat-101",
    patientName: "Sarah Jenkins",
    patientEmail: "sarah.j@example.com",
    patientCountry: "United Kingdom",
    caseId: "CAS-2026-089",
    treatment: "Total Knee Replacement",
    hospital: "Aster Medcity, Kochi",
    assignedStaff: "Rahul Nair (Senior Coordinator)",
    status: "Active",
    category: "Travel & Visa",
    unreadCount: 0,
    lastMessageText: "Thank you! I have downloaded the visa invitation letter.",
    lastMessageTime: "12:00 PM",
    updatedAt: "2026-09-04T12:00:00Z"
  },
  {
    id: "conv-2",
    patientId: "pat-102",
    patientName: "Mohammed Al-Maktoum",
    patientEmail: "m.maktoum@uaebiz.ae",
    patientCountry: "United Arab Emirates",
    caseId: "CAS-2026-088",
    treatment: "Robotic Mitral Valve Surgery",
    hospital: "Amrita Institute, Kochi",
    assignedStaff: "Priya Menon (Cardiology Desk)",
    status: "Waiting for Admin",
    category: "Appointment",
    unreadCount: 1,
    lastMessageText: "Can we schedule the video consultation with Dr. Soman for Saturday?",
    lastMessageTime: "10:30 AM",
    updatedAt: "2026-09-04T10:30:00Z"
  },
  {
    id: "conv-3",
    patientId: "pat-104",
    patientName: "David Miller",
    patientEmail: "david.miller@austech.com.au",
    patientCountry: "Australia",
    caseId: "CAS-2026-087",
    treatment: "Laser Spine Decompression",
    hospital: "Rajagiri Hospital, Aluva",
    assignedStaff: "Anand Kumar (Logistics)",
    status: "Open",
    category: "Travel & Visa",
    unreadCount: 0,
    lastMessageText: "Our flight has landed at Cochin Airport (COK). Chauffeur is waiting.",
    lastMessageTime: "Yesterday",
    updatedAt: "2026-09-03T18:00:00Z"
  },
  {
    id: "conv-4",
    patientId: "pat-103",
    patientName: "Elena Rostova",
    patientEmail: "elena.rostova@berlin-care.de",
    patientCountry: "Germany",
    caseId: "CAS-2026-085",
    treatment: "Panchakarma Detox 14-Day",
    hospital: "Somatheeram Ayurvedic Village",
    assignedStaff: "Dr. Lakshmi V.",
    status: "Resolved",
    category: "Medical Case",
    unreadCount: 0,
    lastMessageText: "Post-treatment dietary guidelines received with gratitude.",
    lastMessageTime: "Aug 28",
    updatedAt: "2026-08-28T14:00:00Z"
  }
];

const DEFAULT_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      sender: "patient",
      senderName: "Sarah Jenkins",
      text: "Hello, when will my medical visa invitation letter and FRRO documentation be ready?",
      category: "Travel & Visa",
      time: "10:15 AM",
      timestamp: "2026-09-04T10:15:00Z",
      status: "read"
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      sender: "admin",
      senderName: "Admin Coordinator (Rahul Nair)",
      text: "Hello Sarah, Dr. Vijay Anand from Aster Medcity has approved and digitally signed your visa letter. I have attached the stamped copy below for your embassy appointment.",
      category: "Travel & Visa",
      time: "11:30 AM",
      timestamp: "2026-09-04T11:30:00Z",
      status: "read",
      attachments: [
        {
          id: "att-1",
          name: "Aster_Medcity_Visa_Invitation_Letter_Signed.pdf",
          size: "1.4 MB",
          type: "application/pdf"
        }
      ]
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      sender: "patient",
      senderName: "Sarah Jenkins",
      text: "Thank you! I have downloaded the visa invitation letter. Our flight arrives on Sept 14th at Cochin Airport.",
      category: "Travel & Visa",
      time: "12:00 PM",
      timestamp: "2026-09-04T12:00:00Z",
      status: "read"
    }
  ],
  "conv-2": [
    {
      id: "msg-4",
      conversationId: "conv-2",
      sender: "patient",
      senderName: "Mohammed Al-Maktoum",
      text: "Assalamu Alaikum. Can we schedule the pre-admission video consultation with Dr. Soman on Saturday at 3:00 PM Dubai time?",
      category: "Appointment",
      time: "10:30 AM",
      timestamp: "2026-09-04T10:30:00Z",
      status: "delivered",
      attachments: [
        {
          id: "att-2",
          name: "Recent_Cardiac_Echo_Report_Dubai.pdf",
          size: "2.8 MB",
          type: "application/pdf"
        }
      ]
    }
  ],
  "conv-3": [
    {
      id: "msg-5",
      conversationId: "conv-3",
      sender: "patient",
      senderName: "David Miller",
      text: "Our flight has landed at Cochin Airport (COK). Chauffeur is waiting.",
      category: "Travel & Visa",
      time: "Yesterday",
      timestamp: "2026-09-03T18:00:00Z",
      status: "read"
    },
    {
      id: "msg-6",
      conversationId: "conv-3",
      sender: "admin",
      senderName: "Admin Coordinator (Anand Kumar)",
      text: "Welcome to God's Own Country, David! Driver Santhosh (+91 98471 23456) will escort you directly to Rajagiri Executive Suites.",
      category: "Travel & Visa",
      time: "Yesterday",
      timestamp: "2026-09-03T18:05:00Z",
      status: "read"
    }
  ],
  "conv-4": [
    {
      id: "msg-7",
      conversationId: "conv-4",
      sender: "patient",
      senderName: "Elena Rostova",
      text: "Post-treatment dietary guidelines received with gratitude.",
      category: "Medical Case",
      time: "Aug 28",
      timestamp: "2026-08-28T14:00:00Z",
      status: "read"
    }
  ]
};

export default function MessagesAdminPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [selectedConversationId, setSelectedConversationId] = useState<string>("conv-1");
  const [replyText, setReplyText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ChatMessage["category"]>("General");
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showPatientDrawer, setShowPatientDrawer] = useState(false);

  // New Conversation Modal State
  const [isNewConvModalOpen, setIsNewConvModalOpen] = useState(false);
  const [newConvData, setNewConvData] = useState({
    patientName: "",
    patientEmail: "",
    patientCountry: "United States",
    caseId: "CAS-2026-" + Math.floor(100 + Math.random() * 900),
    hospital: "Aster Medcity, Kochi",
    category: "Medical Case" as Conversation["category"],
    initialMessage: ""
  });

  // Attachments State
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedConvs = localStorage.getItem("maides_admin_conversations_v3");
      const savedMsgs = localStorage.getItem("maides_admin_messages_map_v3");

      if (savedConvs) {
        setConversations(JSON.parse(savedConvs));
      } else {
        setConversations(DEFAULT_CONVERSATIONS);
        localStorage.setItem("maides_admin_conversations_v3", JSON.stringify(DEFAULT_CONVERSATIONS));
      }

      if (savedMsgs) {
        setMessagesMap(JSON.parse(savedMsgs));
      } else {
        setMessagesMap(DEFAULT_MESSAGES);
        localStorage.setItem("maides_admin_messages_map_v3", JSON.stringify(DEFAULT_MESSAGES));
      }
    } catch (e) {
      setConversations(DEFAULT_CONVERSATIONS);
      setMessagesMap(DEFAULT_MESSAGES);
    }
  }, []);

  // Sync to LocalStorage
  const saveState = (updatedConvs: Conversation[], updatedMsgs: Record<string, ChatMessage[]>) => {
    setConversations(updatedConvs);
    setMessagesMap(updatedMsgs);
    localStorage.setItem("maides_admin_conversations_v3", JSON.stringify(updatedConvs));
    localStorage.setItem("maides_admin_messages_map_v3", JSON.stringify(updatedMsgs));
  };

  // Auto Scroll Chat to Bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesMap, selectedConversationId]);

  // Active Conversation
  const activeConversation = conversations.find(c => c.id === selectedConversationId) || conversations[0];
  const activeMessages = (activeConversation && messagesMap[activeConversation.id]) || [];

  // Mark Unread as Read upon Selecting
  const handleSelectConversation = (convId: string) => {
    setSelectedConversationId(convId);
    const updatedConvs = conversations.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c);
    const convMsgs = messagesMap[convId] || [];
    const updatedConvMsgs = convMsgs.map(m => ({ ...m, status: "read" as const }));
    saveState(updatedConvs, { ...messagesMap, [convId]: updatedConvMsgs });
  };

  // Send Reply (Admin -> Patient)
  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() && !selectedAttachment) return;
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      conversationId: activeConversation.id,
      sender: "admin",
      senderName: "Admin Coordinator (MAIDES Desk)",
      text: replyText.trim(),
      category: selectedCategory,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      status: "sent",
      attachments: selectedAttachment ? [
        {
          id: "att-" + Date.now(),
          name: selectedAttachment.name,
          size: (selectedAttachment.size / 1024).toFixed(0) + " KB",
          type: selectedAttachment.type || "application/octet-stream"
        }
      ] : undefined
    };

    const updatedMessages = [...(messagesMap[activeConversation.id] || []), newMsg];
    const updatedConvs = conversations.map(c => c.id === activeConversation.id ? {
      ...c,
      status: "Waiting for Patient" as const,
      lastMessageText: newMsg.text || (newMsg.attachments ? "📎 " + newMsg.attachments[0].name : "Attachment"),
      lastMessageTime: newMsg.time,
      updatedAt: new Date().toISOString()
    } : c);

    saveState(updatedConvs, { ...messagesMap, [activeConversation.id]: updatedMessages });
    setReplyText("");
    setSelectedAttachment(null);
  };

  // Quick Template Inject
  const handleApplyTemplate = (templateText: string, category: ChatMessage["category"]) => {
    setReplyText(templateText);
    setSelectedCategory(category);
  };

  // Change Conversation Status
  const handleUpdateStatus = (newStatus: Conversation["status"]) => {
    if (!activeConversation) return;
    const updatedConvs = conversations.map(c => c.id === activeConversation.id ? { ...c, status: newStatus } : c);
    saveState(updatedConvs, messagesMap);
  };

  // Delete / Archive Conversation
  const handleDeleteConversation = (convId: string) => {
    if (!confirm("Are you sure you want to remove this patient conversation channel?")) return;
    const updatedConvs = conversations.filter(c => c.id !== convId);
    const newMessagesMap = { ...messagesMap };
    delete newMessagesMap[convId];
    saveState(updatedConvs, newMessagesMap);
    if (selectedConversationId === convId && updatedConvs.length > 0) {
      setSelectedConversationId(updatedConvs[0].id);
    }
  };

  // Start New Conversation
  const handleCreateNewConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConvData.patientName.trim() || !newConvData.initialMessage.trim()) {
      alert("Please provide patient name and initial message.");
      return;
    }

    const newConvId = "conv-" + Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newConv: Conversation = {
      id: newConvId,
      patientId: "pat-" + Math.floor(100 + Math.random() * 900),
      patientName: newConvData.patientName.trim(),
      patientEmail: newConvData.patientEmail.trim() || "patient@example.com",
      patientCountry: newConvData.patientCountry,
      caseId: newConvData.caseId,
      treatment: "Specialized Medical Care",
      hospital: newConvData.hospital,
      assignedStaff: "System Admin (MAIDES Coordinator)",
      status: "Waiting for Patient",
      category: newConvData.category,
      unreadCount: 0,
      lastMessageText: newConvData.initialMessage,
      lastMessageTime: timeStr,
      updatedAt: new Date().toISOString()
    };

    const initialMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      conversationId: newConvId,
      sender: "admin",
      senderName: "Admin Coordinator (MAIDES)",
      text: newConvData.initialMessage,
      category: newConvData.category,
      time: timeStr,
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    saveState([newConv, ...conversations], { ...messagesMap, [newConvId]: [initialMsg] });
    setSelectedConversationId(newConvId);
    setIsNewConvModalOpen(false);
    setNewConvData({
      patientName: "",
      patientEmail: "",
      patientCountry: "United States",
      caseId: "CAS-2026-" + Math.floor(100 + Math.random() * 900),
      hospital: "Aster Medcity, Kochi",
      category: "Medical Case",
      initialMessage: ""
    });
  };

  // Filtered Conversations List
  const filteredConversations = conversations.filter(c => {
    const matchQuery = 
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "ALL" || c.status.toUpperCase() === statusFilter.toUpperCase();
    const matchCategory = categoryFilter === "ALL" || c.category.toUpperCase() === categoryFilter.toUpperCase();
    return matchQuery && matchStatus && matchCategory;
  });

  const totalUnreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const waitingAdminCount = conversations.filter(c => c.status === "Waiting for Admin").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            MAIDES Patient Communication Desk
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Patient Communication & Live Messages
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time, HIPAA-compliant messaging console connecting Admin Care Coordinators, Medical Specialists, and International Patients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {waitingAdminCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              {waitingAdminCount} Waiting for Reply
            </span>
          )}
          <button
            onClick={() => setIsNewConvModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Patient Message
          </button>
        </div>
      </div>

      {/* Main Messaging Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[750px] bg-slate-950/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        
        {/* LEFT COLUMN: CONVERSATION LIST (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-800/80 flex flex-col justify-between bg-slate-950/60">
          
          {/* Search & Filter Header */}
          <div className="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-900/40">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, case, topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="WAITING FOR ADMIN">Waiting for Admin</option>
                <option value="WAITING FOR PATIENT">Waiting for Patient</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">All Topics</option>
                <option value="MEDICAL CASE">Medical Case</option>
                <option value="APPOINTMENT">Appointment</option>
                <option value="TRAVEL & VISA">Travel & Visa</option>
                <option value="BILLING & ESCROW">Billing & Escrow</option>
                <option value="SUPPORT">Support</option>
              </select>
            </div>
          </div>

          {/* Conversation Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-700 mx-auto" />
                <p>No conversations match your criteria.</p>
                <button
                  onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); setCategoryFilter("ALL"); }}
                  className="text-blue-400 hover:underline text-[11px]"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = activeConversation && activeConversation.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left p-3.5 hover:bg-slate-900/60 transition-all flex items-start justify-between gap-3 ${
                      isSelected ? "bg-slate-900/90 border-l-4 border-[#0E82FD]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-[#0E82FD] font-bold text-xs flex items-center justify-center border border-blue-500/20">
                          {conv.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        {conv.status === "Active" && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-xs text-white truncate">{conv.patientName}</span>
                          <span className="text-[10px] text-slate-500 shrink-0 font-mono">{conv.lastMessageTime}</span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-blue-400 font-medium">{conv.caseId}</span>
                          <span className="text-[10px] text-slate-500">• {conv.patientCountry}</span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-normal">
                          {conv.lastMessageText}
                        </p>

                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[9px] text-slate-300 font-medium">
                            {conv.category}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-medium ${
                            conv.status === "Waiting for Admin" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            conv.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            conv.status === "Resolved" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                            "bg-slate-800 text-slate-400"
                          }`}>
                            {conv.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 shrink-0 animate-pulse shadow-sm shadow-blue-500" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Bottom Summary Bar */}
          <div className="p-3 bg-slate-900/50 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              HIPAA & NABH Encrypted
            </span>
            <span className="text-slate-500 font-medium">{conversations.length} Channels</span>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE THREAD & CHAT WINDOW (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-950/40 relative">
          
          {/* Active Conversation Header */}
          {activeConversation ? (
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-[#0E82FD] font-bold text-sm flex items-center justify-center border border-blue-500/20">
                  {activeConversation.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{activeConversation.patientName}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-blue-300 font-mono border border-slate-700">
                      {activeConversation.caseId}
                    </span>
                    <span className="text-slate-400 text-xs">• {activeConversation.patientCountry}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Hospital className="w-3 h-3 text-blue-400" />
                      {activeConversation.hospital}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">{activeConversation.treatment}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Status Dropdown */}
                <select
                  value={activeConversation.status}
                  onChange={e => handleUpdateStatus(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="Active">Active</option>
                  <option value="Waiting for Patient">Waiting for Patient</option>
                  <option value="Waiting for Admin">Waiting for Admin</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>

                {/* Patient Case Drawer Toggle */}
                <button
                  onClick={() => setShowPatientDrawer(!showPatientDrawer)}
                  className={`p-2 rounded-xl border transition-colors ${
                    showPatientDrawer ? "bg-blue-600/20 border-blue-500/40 text-blue-400" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                  title="View Patient Case Summary"
                >
                  <Info className="w-4 h-4" />
                </button>

                {/* Delete/Archive Channel */}
                <button
                  onClick={() => handleDeleteConversation(activeConversation.id)}
                  className="p-2 bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors"
                  title="Archive / Remove Channel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-800 text-xs text-slate-400">Select a conversation</div>
          )}

          {/* Optional Patient Case Info Drawer */}
          {showPatientDrawer && activeConversation && (
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
              <div>
                <span className="text-slate-500 block text-[10px]">Patient Email</span>
                <span className="font-mono text-white text-xs">{activeConversation.patientEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Medical Specialty</span>
                <span className="text-white text-xs">{activeConversation.treatment}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Assigned Care Officer</span>
                <span className="text-blue-400 text-xs">{activeConversation.assignedStaff}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Case ID Reference</span>
                <span className="font-mono text-emerald-400 text-xs">{activeConversation.caseId}</span>
              </div>
            </div>
          )}

          {/* Chat Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-950/20 to-slate-900/10">
            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                <MessageCircle className="w-12 h-12 text-slate-700" />
                <p className="text-sm font-medium text-slate-400">Start the conversation</p>
                <p className="text-xs max-w-sm">
                  Send medical recommendations, consultation links, or travel documents to {activeConversation?.patientName}.
                </p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300">{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                      {msg.category && msg.category !== "General" && (
                        <span className="px-1.5 py-0.2 bg-slate-800 text-[9px] rounded text-blue-300 border border-slate-700">
                          {msg.category}
                        </span>
                      )}
                    </div>

                    <div
                      className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${
                        isAdmin
                          ? "bg-[#0E82FD] text-white rounded-tr-none border border-blue-400/30"
                          : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Attachments rendering */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-white/20">
                          {msg.attachments.map(att => (
                            <div 
                              key={att.id}
                              className={`flex items-center justify-between p-2.5 rounded-xl text-xs ${
                                isAdmin ? "bg-blue-700/60 text-white" : "bg-slate-950 border border-slate-800 text-slate-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-4 h-4 shrink-0 text-blue-200" />
                                <div className="truncate">
                                  <div className="font-medium truncate">{att.name}</div>
                                  <div className="text-[10px] opacity-75">{att.size}</div>
                                </div>
                              </div>
                              <button 
                                onClick={() => alert("Downloading document: " + att.name)}
                                className="p-1.5 hover:bg-black/20 rounded-lg shrink-0 transition-colors"
                                title="Download attachment"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-500 font-mono">
                      {isAdmin && (
                        <span className="flex items-center gap-0.5 text-blue-400">
                          <CheckCheck className="w-3 h-3" />
                          {msg.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Response Templates Carousel */}
          <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium shrink-0">
              <Zap className="w-3 h-3 text-amber-400" />
              Quick Replies:
            </span>
            {QUICK_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyTemplate(tpl.text, tpl.category)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white shrink-0 transition-all active:scale-95"
              >
                {tpl.label}
              </button>
            ))}
          </div>

          {/* Reply Form */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/70 space-y-2.5">
            
            {/* Attachment preview if selected */}
            {selectedAttachment && (
              <div className="flex items-center justify-between p-2 bg-slate-900 border border-blue-500/40 rounded-xl text-xs text-slate-300 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 truncate">
                  <File className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-medium text-white truncate">{selectedAttachment.name}</span>
                  <span className="text-[10px] text-slate-500 shrink-0">({(selectedAttachment.size / 1024).toFixed(0)} KB)</span>
                </div>
                <button
                  onClick={() => setSelectedAttachment(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form 
              onSubmit={handleSendReply} 
              className="flex items-center gap-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedAttachment(e.target.files[0]);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
                title="Attach Medical Report / Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as any)}
                className="px-2.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Medical Case">Medical Case</option>
                <option value="Appointment">Appointment</option>
                <option value="Travel & Visa">Travel & Visa</option>
                <option value="Billing & Escrow">Billing & Escrow</option>
                <option value="Support">Support</option>
              </select>

              <input
                type="text"
                placeholder="Type your response to the patient (Enter to send)..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={!replyText.trim() && !selectedAttachment}
                className="px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL: START NEW PATIENT CONVERSATION */}
      {isNewConvModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-bold text-white">Start New Patient Conversation</h3>
              </div>
              <button onClick={() => setIsNewConvModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewConversation} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan Smith"
                  value={newConvData.patientName}
                  onChange={e => setNewConvData({ ...newConvData, patientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Patient Email</label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={newConvData.patientEmail}
                    onChange={e => setNewConvData({ ...newConvData, patientEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Country</label>
                  <input
                    type="text"
                    value={newConvData.patientCountry}
                    onChange={e => setNewConvData({ ...newConvData, patientCountry: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Hospital Destination</label>
                  <input
                    type="text"
                    value={newConvData.hospital}
                    onChange={e => setNewConvData({ ...newConvData, hospital: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Topic Category</label>
                  <select
                    value={newConvData.category}
                    onChange={e => setNewConvData({ ...newConvData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Medical Case">Medical Case</option>
                    <option value="Appointment">Appointment</option>
                    <option value="Travel & Visa">Travel & Visa</option>
                    <option value="Billing & Escrow">Billing & Escrow</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Initial Message / Instruction</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Welcome to MAIDES. We have initiated your medical case..."
                  value={newConvData.initialMessage}
                  onChange={e => setNewConvData({ ...newConvData, initialMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewConvModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Initiate Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
