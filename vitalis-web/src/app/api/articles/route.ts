import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return false;
  const session = await verifyToken(sessionCookie);
  return session && session.role === 'ADMIN';
}

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

let globalArticlesStore: ServerArticle[] = [];

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
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
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
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
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
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
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
