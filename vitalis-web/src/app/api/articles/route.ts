import { NextResponse } from 'next/server';

export interface ServerArticle {
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
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  tags: string[];
}

let globalArticlesStore: ServerArticle[] = [
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
• Triple-entry 60-day or 1-year e-Medical Visa for patient and up to two medical attendants.
• Rapid turnaround: eVisa approval usually issued within 72–96 hours online.
• FRRO Registration assistance provided by our dedicated concierge desk on arrival.`,
    category: "Visa & Travel",
    author: "Visa Operations Team",
    authorRole: "FRRO Liaison Specialist",
    publishedAt: "2026-08-20",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
    featured: false,
    status: "PUBLISHED",
    tags: ["Medical Visa", "FRRO", "Travel Guide", "Kerala"]
  },
  {
    id: "CMS-004",
    slug: "panchakarma-ayurvedic-rejuvenation-kerala",
    title: "What to Expect from a 14-to-21 Day Authentic Panchakarma Programme in Kerala",
    excerpt: "A clinical guide to the five detoxification therapies of classical Ayurveda and their proven benefits for chronic arthritis, stress, and metabolic health.",
    content: `Authentic Ayurvedic treatment is not merely a spa package—it is an unbroken clinical science rooted in the Ashtanga Hridaya, preserved for over two millennia in Kerala.

The 5 Classical Therapies of Panchakarma:
1. Vamana (Therapeutic emesis for Kapha elimination)
2. Virechana (Purgation therapy for Pitta detox)
3. Basti (Medicated enemas for Vata normalization)
4. Nasya (Nasal administration for cranial clarity)
5. Raktamokshana (Blood purification for systemic inflammatory conditions)

At NABH-accredited centers like Somatheeram and Arya Vaidya Sala Kottakkal, patients receive organic medicinal diets, tailored herbal decoctions, and daily doctor consultations.`,
    category: "Ayurveda Guide",
    author: "Dr. Lakshmi V.",
    authorRole: "Senior Ayurvedic Physician",
    publishedAt: "2026-08-15",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    featured: false,
    status: "PUBLISHED",
    tags: ["Ayurveda", "Panchakarma", "Wellness", "Kovalam"]
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('public') === 'true';

    let list = [...globalArticlesStore];
    if (publicOnly) {
      list = list.filter(a => a.status === 'PUBLISHED');
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      articles: list
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch articles', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ success: false, error: 'Article title is required' }, { status: 400 });
    }

    const generatedSlug = (body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
    const timeStr = new Date().toISOString().split('T')[0];

    const newArticle: ServerArticle = {
      id: body.id || `CMS-${Math.floor(100 + Math.random() * 900)}`,
      slug: generatedSlug,
      title: body.title.trim(),
      excerpt: body.excerpt || body.title.trim(),
      content: body.content || '',
      category: body.category || 'Medical Tourism Guide',
      author: body.author || 'MAIDES Editorial',
      authorRole: body.authorRole || 'Clinical Writer',
      publishedAt: body.publishedAt || timeStr,
      readTime: body.readTime || '5 min read',
      image: body.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      featured: Boolean(body.featured),
      status: body.status || 'PUBLISHED',
      tags: Array.isArray(body.tags) ? body.tags : ['Medical Tourism', 'Kerala']
    };

    globalArticlesStore = [newArticle, ...globalArticlesStore.filter(a => a.id !== newArticle.id)];

    return NextResponse.json({
      success: true,
      article: newArticle,
      articles: globalArticlesStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    const index = globalArticlesStore.findIndex(a => a.id === body.id);
    if (index === -1) {
      globalArticlesStore = [body, ...globalArticlesStore];
    } else {
      globalArticlesStore[index] = { ...globalArticlesStore[index], ...body };
    }

    return NextResponse.json({
      success: true,
      article: body,
      articles: globalArticlesStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id === 'all') {
      globalArticlesStore = [];
      return NextResponse.json({
        success: true,
        message: 'All articles deleted successfully',
        articles: []
      });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID required' }, { status: 400 });
    }

    globalArticlesStore = globalArticlesStore.filter(a => a.id !== id);

    return NextResponse.json({
      success: true,
      message: `Article ${id} deleted successfully`,
      articles: globalArticlesStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete article' }, { status: 500 });
  }
}
