import { NextRequest, NextResponse } from 'next/server';
import { enhanceContent } from '@/lib/openai/services';

export async function POST(req: NextRequest) {
  try {
    const { section, content } = await req.json();
    if (!section || !content) return NextResponse.json({ error: 'Missing section or content' }, { status: 400 });
    const enhanced = await enhanceContent(section, content);
    return NextResponse.json({ enhanced });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
