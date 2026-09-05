"use client";

import React, { useState, useEffect, use } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Building2, 
  Stethoscope, 
  ChevronRight,
  ShieldCheck,
  HeartPulse,
  Tag
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [article, setArticle] = useState<CMSArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<CMSArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      let articlesList: CMSArticle[] = [];

      try {
        const res = await fetch("/api/articles?public=true", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.articles)) {
            articlesList = data.articles;
          }
        }
      } catch (e) {}

      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("maides_cms_articles_v3");
        if (saved !== null) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const localPublished = parsed.filter((a: any) => a.status === "PUBLISHED");
              if (localPublished.length > 0) {
                articlesList = localPublished;
              }
            }
          } catch (e) {}
        }
      }

      const found = articlesList.find(
        (a) => a.slug === slug || a.id.toLowerCase() === slug.toLowerCase()
      );

      if (found) {
        setArticle(found);
        setRelatedArticles(
          articlesList.filter((a) => a.id !== found.id && a.category === found.category).slice(0, 3)
        );
      }
      setIsLoading(false);
    };

    loadArticle();
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => {
        if (isLoading) {
          return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-20">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Loading clinical publication...</p>
              </div>
            </div>
          );
        }

        if (!article) {
          return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-20 px-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-10 max-w-lg text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                  <HeartPulse className="w-7 h-7" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">Article Not Found</h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The publication you are looking for might have been updated or removed by our medical editorial team.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Knowledge Hub</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-slate-50/60 pt-28 pb-20">
            {/* Top Breadcrumbs & Action Bar */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>All Publications & Guides</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{copied ? "Link Copied!" : "Share"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Article Container */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
                {/* Hero Header */}
                <div className="p-6 sm:p-10 border-b border-slate-100 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.publishedAt}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {article.title}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {article.excerpt}
                  </p>

                  {/* Author Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {article.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{article.author}</div>
                        <div className="text-[11px] text-slate-500">{article.authorRole}</div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Medically Reviewed</span>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                {article.image && (
                  <div className="w-full h-72 sm:h-[420px] relative overflow-hidden bg-slate-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Article Body Content */}
                <div className="p-6 sm:p-12 space-y-6">
                  <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
                    {article.content.split("\n\n").map((paragraph, index) => {
                      if (paragraph.startsWith("•") || paragraph.startsWith("-")) {
                        return (
                          <ul key={index} className="list-disc pl-5 space-y-1.5 text-slate-700 my-3">
                            {paragraph.split("\n").map((line, liIdx) => (
                              <li key={liIdx}>{line.replace(/^[•\-]\s*/, "")}</li>
                            ))}
                          </ul>
                        );
                      }
                      if (paragraph.includes(":") && paragraph.length < 80 && !paragraph.includes(".")) {
                        return (
                          <h3 key={index} className="text-lg font-bold text-slate-900 pt-4">
                            {paragraph}
                          </h3>
                        );
                      }
                      return (
                        <p key={index} className="text-slate-700 leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Tags */}
                  {Array.isArray(article.tags) && article.tags.length > 0 && (
                    <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      {article.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assistance CTA Box */}
                <div className="m-6 sm:m-12 p-8 rounded-3xl bg-gradient-to-br from-[#0F2042] to-[#1E3A8A] text-white space-y-4 shadow-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/20 text-blue-200 text-xs font-semibold">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Free Clinical Second Opinion</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Need Treatment or Specialist Review in Kerala?
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                    Our international patient concierge team provides hospital cost quotes, doctor video consultations, visa invitation letters, and travel assistance.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onOpenIntake && onOpenIntake()}
                      className="px-6 py-3 bg-[#0E82FD] hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg transition active:scale-95 cursor-pointer"
                    >
                      <span>Consult Specialist Team</span>
                    </button>
                    <Link
                      href="/contact"
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition"
                    >
                      <span>Contact Hospital Concierge</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Related Clinical Publications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group block space-y-2"
                    >
                      <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-100">
                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {rel.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }}
    </PublicPageLayout>
  );
}
