import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { portfolioData, jobDescription } = await req.json();

    if (!portfolioData || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing portfolio data or job description' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();
    const prompt = `
Candidate Portfolio Data:
${JSON.stringify(portfolioData, null, 2)}

Job Description:
${jobDescription}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a professional technical recruiter. Analyze the candidate's portfolio data against the provided Job Description (JD).
Determine how well the candidate matches the JD and perform a strict semantic match.

Return ONLY valid JSON matching this exact structure:
{
  "score": 85,
  "summary": "A 2-3 sentence overview of why the candidate matches.",
  "highlights": ["Direct match highlight 1", "Direct match highlight 2"],
  "gaps": ["Missing skill or tool 1", "Missing skill or tool 2"],
  "questions": ["Custom interview question 1", "Custom interview question 2"]
}

Rules:
- score: An integer between 0 and 100 representing the match percentage. Be realistic, objective and analytical.
- summary: Keep it professional, concise, and focused on recruiter priorities.
- highlights: List up to 4 concrete, evidence-based matching points (e.g. "Projects X and Y use React and Tailwind, satisfying the UI framework requirements").
- gaps: List up to 4 tools, skills, or experience criteria mentioned in the JD that are not represented in the candidate's portfolio.
- questions: List 2-3 specific, tailored technical or behavioral questions that would probe the candidate's knowledge of the missing or weak areas.`
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error('Job match error:', err);
    return NextResponse.json(
      { error: err.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
