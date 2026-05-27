import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PortfolioRenderer from './PortfolioRenderer';

export const dynamic = 'force-dynamic';

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: portfolio, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !portfolio) notFound();

  // Increment view count (fire and forget)
  supabase
    .from('portfolios')
    .update({ views: (portfolio.views || 0) + 1 })
    .eq('id', portfolio.id)
    .then(() => {});

  return <PortfolioRenderer portfolio={portfolio} />;
}
