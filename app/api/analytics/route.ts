import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { portfolioId, eventType, metadata } = await req.json();
    if (!portfolioId || !eventType) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await supabase.from('analytics_events').insert({
      portfolio_id: portfolioId,
      event_type: eventType,
      metadata,
      user_agent: req.headers.get('user-agent') || '',
      referrer: req.headers.get('referer') || '',
    });

    if (eventType === 'view') {
      await supabase.rpc('increment_views', { portfolio_id: portfolioId });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const portfolioId = searchParams.get('portfolioId');
    if (!portfolioId) return NextResponse.json({ error: 'Missing portfolioId' }, { status: 400 });

    const { data: events } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false })
      .limit(1000);

    const viewEvents = (events || []).filter(e => e.event_type === 'view');
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return d.toISOString().split('T')[0];
    });

    const dailyViews = last14Days.map(date => ({
      date,
      views: viewEvents.filter(e => e.created_at?.startsWith(date)).length,
    }));

    return NextResponse.json({ events: events || [], dailyViews });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
