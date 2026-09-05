"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Globe, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  X,
  Clock,
  Tag,
  Share2,
  AlertCircle,
  ExternalLink,
  Layers,
  Image,
  BookOpen,
  Filter,
  Check
} from "lucide-react";
import Link from "next/link";

export interface CMSArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Medical Tourism Guide" | "Cost Comparison" | "Ayurveda Guide" | "Orthopaedics" | "Visa & Travel" | "NRI Patients" | "Cardiology" | "Patient Stories";
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  image: string;
  featured: boolean;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  tags: string[];
}

export const DEFAULT_CMS_ARTICLES: CMSArticle[] = [
  {
    id: "CMS-001",
    slug: "kerala-medical-tourism-guide-2026",
    title: "Why Kerala Is Asia's Leading Destination for Medical Tourism & Authentic Ayurveda",
    excerpt: "Everything international patients need to know about travelling to Kerala for medical treatment — from choosing JCI hospitals to restorative coastal Ayurveda retreats.",
    content: `Kerala has emerged as one of the world's premier destinations for international medical travel, combining ultra-modern tertiary care with 5,000-year-old authentic Vedic healing traditions.

With 15+ JCI and NABH-accredited hospital complexes across Kochi, Thiruvananthapuram, and Kozhikode, patients from the UK, GCC, Europe, and North America receive Western-standard surgical care at 70-85% lower costs.

Key Highlights:
• JCI Accredited Centers: Aster Medcity, Amrita Institute, Apollo Adlux, and Rajagiri Hospital.
• Robotic Precision: MAKO Robotic Knee & Hip arthroplasty with sub-millimeter surgical accuracy.
• Integrated Wellness: Traditional Panchakarma detox programs supervised by certified BAMS Ayurvedic physicians.
• Multilingual Care: Arabic, English, Russian, and French language medical liaisons.`,
    category: "Medical Tourism Guide",
    author: "Dr. Vijay Anand & MAIDES Editorial",
    authorRole: "Chief Medical Officer",
    publishedAt: "2026-09-02",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    featured: true,
    status: "PUBLISHED",
    tags: ["Medical Tourism", "Kerala", "JCI Hospitals", "Ayurveda"]
  },
  {
    id: "CMS-002",
    slug: "cardiac-surgery-kerala-vs-uk-usa",
    title: "Cardiac Surgery in Kerala vs UK & USA: Cost, Technology & Clinical Outcomes",
    excerpt: "A detailed comparison of coronary bypass (CABG) and robotic valve repairs in Kerala's accredited cardiac centers vs private NHS & US providers.",
    content: `International patients seeking complex cardiovascular care increasingly choose Kerala for cardiac surgery due to world-class clinical outcomes, zero waiting lists, and substantial cost savings.

A standard CABG (Coronary Artery Bypass Graft) in the United States averages $120,000, and in the UK private sector approximately £28,000. In Kerala's Aster Medcity or Amrita Institute, the identical package—including ICU stay, imported St. Jude/Medtronic grafts, and 5-star suite accommodation—ranges between $6,200 and $8,500.

Surgical Success Rates:
• Over 99.2% success rate in primary coronary bypass procedures.
• Minimally invasive keyhole cardiac surgery with 4-day hospital discharge.
• Comprehensive post-op rehabilitation programs.`,
    category: "Cost Comparison",
    author: "Clinical Analysis Unit",
    authorRole: "Health Economics Desk",
    publishedAt: "2026-08-28",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
    featured: false,
    status: "PUBLISHED",
    tags: ["Cardiac Surgery", "Cost Comparison", "CABG", "Heart Care"]
  },
  {
    id: "CMS-003",
    slug: "indian-medical-visa-med-evisa-guide",
    title: "Complete Indian Medical Visa (e-Med & MED-X) Application Guide 2026",
    excerpt: "Step-by-step walkthrough of the online Indian Medical e-Visa portal, mandatory hospital visa invitation letters, and FRRO registration in Kerala.",
    content: `Applying for an Indian Medical Visa is straightforward through the official government portal. MAIDES facilitates the mandatory signed Hospital Visa Invitation Letter within 24 hours of clinical assessment.

Key Visa Guidelines:
1. Eligibility: Triple-entry e-Medical Visa valid for up to 60 days.
2. Attendants: Up to two MED-X attendant visas granted per patient.
3. Documents: Passport scan, physician referral, and official Kerala hospital invitation letter.
4. Airport Assistance: Direct immigration assistance desk at Cochin International Airport (COK) and Trivandrum (TRV).`,
    category: "Visa & Travel",
    author: "Visa Operations Team",
    authorRole: "FRRO Liaison Specialist",
    publishedAt: "2026-08-20",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
    featured: false,
    status: "PUBLISHED",
    tags: ["Medical Visa", "FRRO", "Travel Guide", "Embassy"]
  },
  {
    id: "CMS-004",
    slug: "panchakarma-ayurvedic-rejuvenation-kerala",
    title: "What to Expect from a 14-to-21 Day Authentic Panchakarma Programme in Kerala",
    excerpt: "A clinical guide to the five detoxification therapies of classical Ayurveda and their proven benefits for chronic arthritis, stress, and metabolic health.",
    content: `Authentic Panchakarma represents classical Ayurveda's deepest detoxification protocol. In accredited beachfront and backwater centers like Somatheeram, treatments are tailored to individual Prakriti (body constitution) and Vikriti (imbalances).

The Five Phases (Pancha Karma):
• Vamana (Therapeutic emesis for Kapha disorders)
• Virechana (Purgation therapy for Pitta detoxification)
• Basti (Medicated herbal enemas for Vata disorders & spine health)
• Nasya (Nasal administration for respiratory & neurological clarity)
• Raktamokshana (Blood purification for skin and joint conditions)`,
    category: "Ayurveda Guide",
    author: "Dr. Lakshmi V.",
    authorRole: "Senior Ayurvedic Physician",
    publishedAt: "2026-08-15",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    featured: false,
    status: "PUBLISHED",
    tags: ["Ayurveda", "Panchakarma", "Detox", "Somatheeram"]
  }
];

export default function CMSAdminPage() {
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals & Form
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [viewArticle, setViewArticle] = useState<CMSArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<CMSArticle | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CMSArticle>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Medical Tourism Guide",
    author: "MAIDES Clinical Editorial",
    authorRole: "Medical Content Lead",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    featured: false,
    status: "PUBLISHED",
    tags: ["Kerala", "Medical Tourism"]
  });

  // Load from API & LocalStorage
  useEffect(() => {
    const fetchArticles = async () => {
      let remoteArticles: CMSArticle[] | null = null;
      let localArticles: CMSArticle[] | null = null;

      try {
        const res = await fetch("/api/articles", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.articles)) {
            remoteArticles = data.articles;
          }
        }
      } catch (e) {}

      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("maides_cms_articles_v3");
        if (saved !== null) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              localArticles = parsed;
            }
          } catch (e) {}
        }
      }

      if (localArticles !== null) {
        setArticles(localArticles);
      } else if (remoteArticles !== null) {
        setArticles(remoteArticles);
      } else {
        setArticles(DEFAULT_CMS_ARTICLES);
        if (typeof window !== "undefined") {
          localStorage.setItem("maides_cms_articles_v3", JSON.stringify(DEFAULT_CMS_ARTICLES));
        }
      }
    };

    fetchArticles();
    window.addEventListener("storage", fetchArticles);
    window.addEventListener("maides_cms_updated", fetchArticles);
    return () => {
      window.removeEventListener("storage", fetchArticles);
      window.removeEventListener("maides_cms_updated", fetchArticles);
    };
  }, []);

  const saveArticles = (data: CMSArticle[]) => {
    setArticles(data);
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_cms_articles_v3", JSON.stringify(data));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("maides_cms_updated"));
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Medical Tourism Guide",
      author: "MAIDES Clinical Editorial",
      authorRole: "Medical Content Lead",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      featured: false,
      status: "PUBLISHED",
      tags: ["Kerala", "Healthcare"]
    });
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (art: CMSArticle) => {
    setEditingArticle(art);
    setFormData({ ...art });
    setIsEditorOpen(true);
  };

  // Save Article (Create or Update)
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Please enter title and content.");
      return;
    }

    const generatedSlug = (formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");
    const timeStr = new Date().toISOString().split("T")[0];

    if (editingArticle) {
      const updatedItem: CMSArticle = {
        ...editingArticle,
        ...formData,
        slug: generatedSlug,
        publishedAt: formData.publishedAt || timeStr,
      } as CMSArticle;
      
      const updated = articles.map(a => a.id === editingArticle.id ? updatedItem : a);
      saveArticles(updated);

      try {
        await fetch("/api/articles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedItem)
        });
      } catch(e) {}
    } else {
      const newArt: CMSArticle = {
        id: "CMS-" + Math.floor(100 + Math.random() * 900),
        slug: generatedSlug,
        title: formData.title || "Untitled Article",
        excerpt: formData.excerpt || formData.title,
        content: formData.content || "",
        category: (formData.category as CMSArticle["category"]) || "Medical Tourism Guide",
        author: formData.author || "MAIDES Editorial",
        authorRole: formData.authorRole || "Clinical Writer",
        publishedAt: timeStr,
        readTime: formData.readTime || "5 min read",
        image: formData.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
        featured: formData.featured || false,
        status: (formData.status as CMSArticle["status"]) || "PUBLISHED",
        tags: formData.tags || ["Medical Tourism", "Kerala"]
      };
      
      saveArticles([newArt, ...articles]);

      try {
        await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newArt)
        });
      } catch(e) {}
    }

    setIsEditorOpen(false);
    setEditingArticle(null);
  };

  // Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (confirm("Are you sure you want to delete this article? It will be removed from the public website.")) {
      const updated = articles.filter(a => a.id !== id);
      saveArticles(updated);

      try {
        await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
      } catch(e) {}
    }
  };

  // Filter Articles
  const filteredArticles = articles.filter(a => {
    const matchSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === "ALL" || a.category === categoryFilter;
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const publishedCount = articles.filter(a => a.status === "PUBLISHED").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            MAIDES Content Management System (CMS)
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Articles, Destination Guides & Patient Knowledge Base
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Create, edit, and publish clinical guides, cost comparisons, and Kerala medical tourism guides. Published articles sync live to the public <strong className="text-blue-400">/blog</strong> portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 shadow-sm transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            View Public Blog Page
          </Link>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create New Article
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Total Articles</div>
          <div className="text-2xl font-bold text-white mt-2">{articles.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Managed across all medical specialties</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Published on Live Website</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{publishedCount}</div>
          <div className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Visible to international patients
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Featured Hero Highlights</div>
          <div className="text-2xl font-bold text-blue-400 mt-2">
            {articles.filter(a => a.featured).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Highlighted on blog home & guide hub</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search articles by title, author, category, ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Medical Tourism Guide">Medical Tourism Guide</option>
            <option value="Cost Comparison">Cost Comparison</option>
            <option value="Ayurveda Guide">Ayurveda Guide</option>
            <option value="Orthopaedics">Orthopaedics</option>
            <option value="Visa & Travel">Visa & Travel</option>
            <option value="NRI Patients">NRI Patients</option>
            <option value="Cardiology">Cardiology</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/70 text-slate-400 font-semibold border-b border-slate-800">
                <th className="p-3.5 pl-5">Article Title & Slug</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Author</th>
                <th className="p-3.5">Published Date</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No articles found. Click "Create New Article" to add one.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(art => (
                  <tr key={art.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5 pl-5 max-w-sm">
                      <div className="font-bold text-white line-clamp-1">{art.title}</div>
                      <div className="text-[11px] text-blue-400 font-mono mt-0.5">/{art.slug}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800">
                        {art.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-white">{art.author}</div>
                      <div className="text-[10px] text-slate-400">{art.authorRole}</div>
                    </td>
                    <td className="p-3.5 text-slate-400">{art.publishedAt}</td>
                    <td className="p-3.5">
                      {art.featured ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          ★ Hero Featured
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        art.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        art.status === "DRAFT" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-slate-800 text-slate-400"
                      }`}>
                        {art.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewArticle(art)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Preview Article"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: VIEW / PREVIEW ARTICLE */}
      {viewArticle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {viewArticle.category}
                </span>
                <span className="text-xs text-slate-400">{viewArticle.readTime}</span>
              </div>
              <button onClick={() => setViewArticle(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white leading-tight">{viewArticle.title}</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>By <strong className="text-white">{viewArticle.author}</strong> ({viewArticle.authorRole})</span>
                <span>•</span>
                <span>Published: {viewArticle.publishedAt}</span>
              </div>
            </div>

            {viewArticle.image && (
              <div className="rounded-2xl overflow-hidden h-64 w-full bg-slate-900 relative">
                <img src={viewArticle.image} alt={viewArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 text-xs italic text-slate-300">
              "{viewArticle.excerpt}"
            </div>

            <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap space-y-4">
              {viewArticle.content}
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
              {(viewArticle.tags || []).map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT ARTICLE */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingArticle ? "Edit CMS Article" : "Create New Public CMS Article"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish authoritative healthcare content to the public MAIDES portal.
                </p>
              </div>
              <button onClick={() => setIsEditorOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Article Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Guide to Robotic Knee Arthroplasty in Kochi"
                  value={formData.title || ""}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. robotic-knee-replacement-kerala"
                    value={formData.slug || ""}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Category</label>
                  <select
                    value={formData.category || "Medical Tourism Guide"}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                  >
                    <option value="Medical Tourism Guide">Medical Tourism Guide</option>
                    <option value="Cost Comparison">Cost Comparison</option>
                    <option value="Ayurveda Guide">Ayurveda Guide</option>
                    <option value="Orthopaedics">Orthopaedics</option>
                    <option value="Visa & Travel">Visa & Travel</option>
                    <option value="NRI Patients">NRI Patients</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Patient Stories">Patient Stories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author || ""}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Author Title / Role</label>
                  <input
                    type="text"
                    value={formData.authorRole || ""}
                    onChange={e => setFormData({ ...formData, authorRole: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime || "7 min read"}
                    onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image || ""}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Short Excerpt (Summary for search & social)</label>
                <textarea
                  rows={2}
                  value={formData.excerpt || ""}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white resize-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Full Article Content</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write complete article with headings and clinical information..."
                  value={formData.content || ""}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs leading-relaxed resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={formData.featured || false}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="featured-check" className="text-white font-semibold cursor-pointer">
                    Feature as Hero Article on Public Blog
                  </label>
                </div>

                <div>
                  <select
                    value={formData.status || "PUBLISHED"}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                  >
                    <option value="PUBLISHED">🚀 Publish Immediately to Live Web</option>
                    <option value="DRAFT">📝 Save as Internal Draft</option>
                    <option value="ARCHIVED">📦 Archive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md"
                >
                  {editingArticle ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
