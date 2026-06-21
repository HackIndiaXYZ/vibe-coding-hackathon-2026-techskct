import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOpenAI } from '@/lib/openai/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { url, userId } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'No LinkedIn URL provided' }, { status: 400 });
    }

    // Extract a realistic username/name from the URL
    // e.g. https://www.linkedin.com/in/alex-johnson/ -> alex-johnson -> Alex Johnson
    let candidateName = 'Alex Johnson';
    let linkedinUsername = 'alex-johnson';
    try {
      const match = url.match(/linkedin\.com\/in\/([^/?#]+)/i);
      if (match && match[1]) {
        linkedinUsername = match[1];
        candidateName = match[1]
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    } catch (e) {
      // fallback
    }

    const openai = getOpenAI();
    const prompt = `You are a LinkedIn profile parser and portfolio generator.
Generate a complete, high-quality, professional portfolio JSON matching the format of a senior tech professional whose profile name or URL is: ${candidateName} (${url}).
The theme should match their likely professional role (e.g. developer for engineers, designer for UI/UX, marketer for sales/growth, executive for management, scientist for research/data-science).
Generate rich, realistic profile content, including 2-3 previous jobs, 3 realistic projects, and professional skills that would be expected of a professional with this profile.

Return ONLY valid JSON matching this exact structure (no markdown fences, no leading/trailing comments):
{
  "name": "${candidateName}",
  "title": "Senior Full-Stack Engineer",
  "email": "${linkedinUsername.toLowerCase()}@example.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "availability": "Open to work",
  "summary": "Experienced software engineer specializing in building high-performance web applications and distributed systems.",
  "social": {
    "github": "github.com/${linkedinUsername}",
    "linkedin": "linkedin.com/in/${linkedinUsername}",
    "twitter": "twitter.com/${linkedinUsername}"
  },
  "skillGroups": {
    "primary": ["React", "Next.js", "TypeScript", "Node.js"],
    "secondary": ["GraphQL", "PostgreSQL", "TailwindCSS"],
    "tools": ["Git", "Docker", "AWS", "Vercel"],
    "learning": ["Rust", "WebAssembly"]
  },
  "skills": ["React", "Next.js", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "TailwindCSS", "Git", "Docker", "AWS", "Vercel"],
  "experience": [
    {
      "company": "Stripe",
      "role": "Senior Software Engineer",
      "duration": "2023 - Present",
      "location": "San Francisco, CA",
      "type": "Full-time",
      "description": "Led development of core payment flows, improving conversion by 12% across web checkouts. Mentored junior engineers and modernized design system components.",
      "tech": ["React", "TypeScript", "Ruby"],
      "achievements": ["Boosted checkout page conversion by 12%", "Reduced bundle sizes by 30%"]
    },
    {
      "company": "Vercel",
      "role": "Frontend Developer",
      "duration": "2021 - 2023",
      "location": "Remote",
      "type": "Full-time",
      "description": "Collaborated with Core framework teams to optimize performance metrics, contributing to Next.js features and documentation.",
      "tech": ["Next.js", "React", "TypeScript"],
      "achievements": ["Optimized initial page load times by 200ms", "Implemented server component examples"]
    }
  ],
  "projects": [
    {
      "title": "Interactive Payment Engine",
      "tagline": "Modern dashboard widget for Stripe payments",
      "description": "Developed an open-source react payment widget offering custom localization and multi-currency formats with drag-and-drop checkout capabilities.",
      "tech": ["React", "TypeScript", "Stripe API"],
      "category": "Web App",
      "status": "Live",
      "github": "github.com/${linkedinUsername}/payment-engine",
      "live_url": "payment-engine.dev",
      "featured": true
    },
    {
      "title": "Distributed Task Scheduler",
      "tagline": "High-throughput task queue in Go",
      "description": "Built a persistent redis-backed task queue capable of scheduling 10k parallel worker tasks with visual logs and retries.",
      "tech": ["Go", "Redis", "Docker"],
      "category": "API",
      "status": "Completed",
      "github": "github.com/${linkedinUsername}/go-scheduler",
      "live_url": "",
      "featured": true
    }
  ],
  "education": [
    {
      "institution": "Stanford University",
      "degree": "B.S. in Computer Science",
      "duration": "2017 - 2021",
      "grade": "GPA: 3.9/4.0"
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "year": 2024
    }
  ],
  "languages": ["English", "Spanish"],
  "stats": {
    "years_experience": 5,
    "projects_shipped": 14,
    "github_repos": 32,
    "github_stars": 128
  },
  "theme": "developer"
}
Ensure the theme is one of: developer | designer | executive | scientist | marketer.
Return only valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const portfolioData = JSON.parse(completion.choices[0].message.content || '{}');

    // Safe slug generation
    const slug = `${candidateName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')}-${Date.now()}`;

    // Save to database
    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: userId,
        slug,
        title: `${portfolioData.name || candidateName}'s Portfolio`,
        theme: portfolioData.theme || 'developer',
        data: portfolioData,
        published: true, // Auto-publish for LinkedIn instant generation!
        views: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ portfolioId: portfolio.id, slug: portfolio.slug });
  } catch (err: any) {
    console.error('LinkedIn generation error:', err);
    return NextResponse.json(
      { error: err.message || 'LinkedIn generation failed' },
      { status: 500 }
    );
  }
}
