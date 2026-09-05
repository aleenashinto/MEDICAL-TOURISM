"use client";

import React, { useState, useEffect } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { ArrowUpRight, Clock, Tag, ChevronRight, BookOpen, Search, UserCheck } from "lucide-react";
import Link from "next/link";

interface CMSArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  image: string;
  featured: boolean;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  tags: string[];
}

const DEFAULT_POSTS: CMSArticle[] = [
  {
    id: "CMS-001",
    slug: "kerala-medical-tourism-guide-2026",
    title: "Why Kerala Is Asia's Leading Destination for Medical Tourism & Authentic Ayurveda",
    excerpt: "Everything international patients need to know about travelling to Kerala for medical treatment — from choosing JCI hospitals to restorative coastal Ayurveda retreats.",
    content: "Full guide content...",
    category: "Medical Tourism Guide",
    author: "Dr. Vijay Anand & MAIDES Editorial",
    authorRole: "Chief Medical Officer",
    publishedAt: "2 Sep 2026",
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
    content: "Full comparison content...",
    category: "Cost Comparison",
    author: "Clinical Analysis Unit",
    authorRole: "Health Economics Desk",
    publishedAt: "28 Aug 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
    featured: false,
    status: "PUBLISHED",
    tags: ["Cardiac Surgery", "Cost Comparison"]
  },
  {
    id: "CMS-003",
    slug: "indian-medical-visa-med-evisa-guide",
    title: "Complete Indian Medical Visa (e-Med & MED-X) Application Guide 2026",
    excerpt: "Step-by-step walkthrough of the online Indian Medical e-Visa portal, mandatory hospital visa invitation letters, and FRRO registration in Kerala.",
    content: "Full visa guide...",
    category: "Visa & Travel",
    author: "Visa Operations Team",
    authorRole: "FRRO Liaison Specialist",
    publishedAt: "20 Aug 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
    featured: false,
    status: "PUBLISHED",
    tags: ["Medical Visa", "FRRO"]
  },
  {
    id: "CMS-004",
    slug: "panchakarma-ayurvedic-rejuvenation-kerala",
    title: "What to Expect from a 14-to-21 Day Authentic Panchakarma Programme in Kerala",
    excerpt: "A clinical guide to the five detoxification therapies of classical Ayurveda and their proven benefits for chronic arthritis, stress, and metabolic health.",
    content: "Full panchakarma guide...",
    category: "Ayurveda Guide",
    author: "Dr. Lakshmi V.",
    authorRole: "Senior Ayurvedic Physician",
    publishedAt: "15 Aug 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    featured: false,
    status: "PUBLISHED",
    tags: ["Ayurveda", "Panchakarma"]
  }
];

const CATEGORIES = ["All", "Medical Tourism Guide", "Cost Comparison", "Ayurveda Guide", "Orthopaedics", "Visa & Travel", "NRI Patients", "Cardiology", "Patient Stories"];

export default function BlogPage() {
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load published articles from shared CMS store & API
  useEffect(() => {
    const loadPublishedArticles = async () => {
      let remoteArticles: CMSArticle[] | null = null;
      let localArticles: CMSArticle[] | null = null;

      try {
        const res = await fetch("/api/articles?public=true", { cache: "no-store" });
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
              localArticles = parsed.filter((a: any) => a.status === "PUBLISHED");
            }
          } catch (e) {}
        }
      }

      // If admin has an explicit local array (including empty), respect it
      if (localArticles !== null) {
        setArticles(localArticles);
      } else if (remoteArticles !== null) {
        setArticles(remoteArticles);
      } else {
        setArticles([]);
      }
      setIsLoading(false);
    };

    loadPublishedArticles();
    window.addEventListener("storage", loadPublishedArticles);
    window.addEventListener("maides_cms_updated", loadPublishedArticles);
    return () => {
      window.removeEventListener("storage", loadPublishedArticles);
      window.removeEventListener("maides_cms_updated", loadPublishedArticles);
    };
  }, []);

  const filtered = articles.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredPost = filtered.find(p => p.featured) || filtered[0];
  const regularPosts = filtered.filter(p => p.id !== featuredPost?.id);

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen pb-20 bg-slate-50/50">
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">MAIDES Clinical Publications</span>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight">Medical Tourism<br />Guides & Knowledge Hub</h1>
              <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                Expert guides on Kerala healthcare travel, hospital cost comparisons, Ayurveda programs, visa assistance, and international patient recovery diaries.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
            {/* Search & Category Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button 
                    key={c} 
                    onClick={() => setActiveCategory(c)} 
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      activeCategory === c 
                        ? "bg-[#0E82FD] text-white shadow-md" 
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Posts Content or Empty State */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 sm:p-16 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">No Articles Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    {searchQuery 
                      ? `No publications match "${searchQuery}". Try selecting another category or clearing search filters.`
                      : "There are currently no articles published in this category. Our medical editorial team updates clinical guides regularly."}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onOpenIntake && onOpenIntake()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <span>Request Medical Information</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Featured Post Card */}
                {featuredPost && (
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 group">
                    <Link href={`/blog/${featuredPost.slug}`} className="lg:col-span-7 h-64 lg:h-auto relative overflow-hidden bg-slate-100 block">
                      <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                            {featuredPost.category}
                          </span>
                          <span className="text-xs text-slate-400">{featuredPost.readTime}</span>
                        </div>
                        <Link href={`/blog/${featuredPost.slug}`} className="block group-hover:text-blue-600 transition-colors">
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                            {featuredPost.title}
                          </h2>
                        </Link>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          By <strong className="text-slate-900">{featuredPost.author}</strong> • {featuredPost.publishedAt}
                        </div>
                        <Link 
                          href={`/blog/${featuredPost.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
                        >
                          Read Full Article <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid of Regular Posts */}
                {regularPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map((post) => (
                      <div 
                        key={post.id} 
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <Link href={`/blog/${post.slug}`} className="h-48 w-full overflow-hidden bg-slate-100 relative block">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-slate-800 shadow-sm">
                              {post.category}
                            </span>
                          </Link>
                          <div className="p-5 space-y-2">
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{post.readTime}</span>
                              <span>•</span>
                              <span>{post.publishedAt}</span>
                            </div>
                            <Link href={`/blog/${post.slug}`} className="block group-hover:text-blue-600 transition-colors">
                              <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 pt-0 border-t border-slate-50 mt-4 flex items-center justify-between text-xs text-slate-500">
                          <span className="truncate max-w-[140px]">By {post.author}</span>
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
                          >
                            Read Full Article <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
