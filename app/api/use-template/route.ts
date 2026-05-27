import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PORTFOLIO_TEMPLATES } from '@/lib/data/portfolio-templates';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { templateId, userId } = await req.json();

    const template = PORTFOLIO_TEMPLATES.find(t => t.id === templateId);
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    // Map template data to PortfolioData shape used by the rest of the app
    const portfolioData = {
      name:    template.profile.name,
      title:   template.profile.title,
      summary: template.profile.bio,
      email:   template.profile.email,
      location: template.profile.location,
      avatar:  template.profile.avatar,
      availability: template.profile.availability,
      social:  template.profile.social,
      skills:  [
        ...template.skills.primary,
        ...template.skills.secondary,
      ],
      skillGroups: template.skills,
      experience: template.experience.map(e => ({
        company:     e.company,
        role:        e.role,
        duration:    e.duration,
        location:    e.location,
        type:        e.type,
        description: e.description,
        tech:        e.tech,
      })),
      projects: template.projects.map(p => ({
        id:          p.id,
        title:       p.title,
        tagline:     p.tagline,
        description: p.description,
        tech:        p.tech,
        category:    p.category,
        status:      p.status,
        github:      p.github,
        live_url:    p.live_url,
        thumbnail:   p.thumbnail,
        stars:       p.stars,
        featured:    p.featured,
      })),
      education:      template.education,
      certifications: template.certifications,
      stats:          template.stats,
      theme:          template.template_style === 'dark-minimal'    ? 'developer'
                    : template.template_style === 'light-editorial' ? 'designer'
                    : 'scientist',
      accentColor:    template.accent_color,
      templateStyle:  template.template_style,
      fromTemplate:   templateId,
    };

    const slug = `${template.profile.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .insert({
        user_id:   userId,
        slug,
        title:     `${template.profile.name}'s Portfolio`,
        theme:     portfolioData.theme,
        data:      portfolioData,
        published: false,
        views:     0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ portfolioId: portfolio.id, slug });
  } catch (err: any) {
    console.error('Template use error:', err);
    return NextResponse.json({ error: err.message || 'Failed to use template' }, { status: 500 });
  }
}
