import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PortfolioRenderer from './PortfolioRenderer';
import { getSampleData } from '@/lib/data/sample-resumes';
import { PORTFOLIO_TEMPLATES } from '@/lib/data/portfolio-templates';

export const dynamic = 'force-dynamic';

const DEMO_SLUGS: Record<string, { theme: string; persona: 'developer' | 'designer' | 'scientist'; templateId?: string }> = {
  'demo-developer': { theme: 'developer', persona: 'developer' },
  'demo-designer': { theme: 'designer', persona: 'designer' },
  'demo-scientist': { theme: 'scientist', persona: 'scientist' },
  'demo-executive': { theme: 'executive', persona: 'developer', templateId: 'USR009' },
  'demo-marketer': { theme: 'marketer', persona: 'designer', templateId: 'USR010' },
};

function getDemoPortfolio(slug: string) {
  const config = DEMO_SLUGS[slug];
  if (!config) return null;

  let data: any = {};
  if (config.templateId) {
    const tpl = PORTFOLIO_TEMPLATES.find(t => t.id === config.templateId);
    if (tpl) {
      data = {
        name: tpl.profile.name,
        title: tpl.profile.title,
        summary: tpl.profile.bio,
        email: tpl.profile.email,
        location: tpl.profile.location,
        avatar: tpl.profile.avatar,
        availability: tpl.profile.availability,
        social: tpl.profile.social,
        skillGroups: tpl.skills,
        skills: [
          ...(tpl.skills?.primary || []),
          ...(tpl.skills?.secondary || []),
          ...(tpl.skills?.tools || []),
          ...(tpl.skills?.learning || []),
        ],
        experience: tpl.experience,
        projects: tpl.projects.map(p => ({
          ...p,
          github: p.github || null,
        })),
        education: tpl.education,
        certifications: tpl.certifications,
        stats: tpl.stats,
        theme: config.theme,
      };
    }
  } else {
    data = { ...getSampleData(config.persona) };
    data.theme = config.theme;
  }

  return {
    id: `demo-${config.theme}`,
    slug,
    title: `${data.name || 'Demo'}'s Portfolio`,
    theme: config.theme,
    published: true,
    views: 128,
    data,
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Serve demo pages from static mock data
  const demoPortfolio = getDemoPortfolio(slug);
  if (demoPortfolio) {
    return <PortfolioRenderer portfolio={demoPortfolio as any} />;
  }

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

