import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseResume } from '@/lib/openai/services';
import { extractPdfText } from '@/lib/pdf/extract';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Extract text from file
    let text = '';
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
      // Use our zero-dependency extractor — no native addons required
      text = await extractPdfText(buffer);
    } else if (ext === 'docx' || ext === 'doc') {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or DOCX.' },
        { status: 400 }
      );
    }

    if (!text.trim() || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough text. Try a DOCX version or a text-based PDF (not a scanned image).' },
        { status: 400 }
      );
    }

    // Parse resume with GPT-4o
    const portfolioData = await parseResume(text);

    // Null-safe name fallback (GPT may return null for some fields)
    const safeName = portfolioData?.name || 'Portfolio';

    // Generate URL-safe slug
    const slug = `${safeName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')}-${Date.now()}`;

    // Save to Supabase
    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: userId,
        slug,
        title: `${safeName}'s Portfolio`,
        theme: portfolioData?.theme || 'developer',
        data: portfolioData || {},
        published: false,
        views: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ portfolioId: portfolio.id, slug });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: err.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
