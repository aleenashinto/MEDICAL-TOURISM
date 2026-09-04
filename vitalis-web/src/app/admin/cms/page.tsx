"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Globe, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from "lucide-react";

export default function CMSAdminPage() {
  const [activeTab, setActiveTab] = useState("PAGES");

  const cmsArticles = [
    {
      id: "CMS-001",
      title: "Why Kerala Is Asia's Leading Destination for Medical Tourism & Ayurveda",
      category: "Destination Guide",
      author: "MAIDES Editorial",
      publishedAt: "2026-08-15",
      status: "PUBLISHED",
    },
    {
      id: "CMS-002",
      title: "Complete Guide to Indian Medical Visas (MED & MED-X)",
      category: "Travel & Visas",
      author: "Visa Operations Team",
      publishedAt: "2026-08-20",
      status: "PUBLISHED",
    },
    {
      id: "CMS-003",
      title: "Cost Comparison: Knee & Hip Replacements in USA vs. Kerala, India",
      category: "Treatment Costs",
      author: "Clinical Analysis Unit",
      publishedAt: "2026-09-01",
      status: "PUBLISHED",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Content Management System (CMS)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage destination guides, medical visa FAQs, health blogs, and SEO metadata.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          Create New Article
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Article Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cmsArticles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{art.title}</div>
                    <div className="text-[11px] text-blue-400 font-mono">{art.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {art.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{art.author}</td>
                  <td className="py-3.5 px-4 text-slate-400">{art.publishedAt}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {art.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white font-medium text-[11px] transition-all">
                      Edit Article
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
