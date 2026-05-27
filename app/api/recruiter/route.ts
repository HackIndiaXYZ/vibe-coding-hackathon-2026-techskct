import { NextRequest, NextResponse } from 'next/server';
import { simulateRecruiter } from '@/lib/openai/services';

export async function POST(req: NextRequest) {
  try {
    const { portfolioData } = await req.json();
    if (!portfolioData) return NextResponse.json({ error: 'Missing portfolio data' }, { status: 400 });
    const report = await simulateRecruiter(portfolioData);
    return NextResponse.json({ report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
