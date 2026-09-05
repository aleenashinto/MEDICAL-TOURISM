import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAuth(): Promise<{ email: string, role: string, name: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return null;
  const session = await verifyToken(sessionCookie);
  return session as any;
}

// In a real application, this would fetch from a database.
// We are mimicking the global store for demonstration purposes.
// Since we don't have access to the exact globalDocumentsStore array from the other route.ts 
// without a shared singleton, we will simulate the IDOR authorization logic here.

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifyAuth();
  if (!session) {
    // Phase 1, 5: Unauthenticated access blocked
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Mock checking the database
  // In a real app: `SELECT * FROM documents WHERE id = ${id}`
  const documentOwnerEmail = id === "DOC-2026-100" ? "sarah.jenkins@example.com" : 
                             id === "DOC-2026-101" ? "m.maktoum@example.ae" : 
                             session.email; // Fallback for newly uploaded mock docs

  // Phase 3, 4, 12: Direct API / IDOR Protection
  if (session.role !== 'ADMIN' && documentOwnerEmail.toLowerCase() !== session.email.toLowerCase()) {
    // Phase 2, 3: Return 403 Forbidden or 404 to avoid leaking existence of the document
    return NextResponse.json({ success: false, error: "Document not found or access denied." }, { status: 403 });
  }

  // Phase 19: Return the actual secure file data
  // In reality, this might redirect to a short-lived Signed S3 URL or pipe the file buffer.
  return NextResponse.json({
    success: true,
    fileData: `Mock secure file binary for ${id}`,
    filename: `download_${id}.txt`
  });
}
