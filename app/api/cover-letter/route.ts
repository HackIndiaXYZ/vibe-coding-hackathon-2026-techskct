import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { portfolioData, jobDescription } = await req.json();

    if (!portfolioData || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing candidate details or job description' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    const systemPrompt = `You are a professional career coach and copywriter.
Write a customized, highly compelling, and professional Cover Letter matching the candidate's skills and experience (from their portfolio data) to the target Job Description.

Rules:
- Address it to "Hiring Manager" (unless a company name is clearly identified in the JD).
- Keep it to 3-4 paragraphs (approx. 250-350 words).
- Make it punchy, authentic, and metric-focused. Highlight specific achievements from the candidate's experience that directly satisfy the JD requirements.
- Return ONLY the clean, ready-to-copy cover letter text. Avoid any extra commentary, headers, wrappers, or instructions outside the letter itself. Use placeholders like [Date] or [Company Name] only where necessary.`;

    const userMessage = `Candidate Portfolio/Resume Data:
${JSON.stringify(portfolioData, null, 2)}

Target Job Description:
${jobDescription}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    });

    const coverLetter = completion.choices[0].message.content || '';
    return NextResponse.json({ coverLetter });
  } catch (err: any) {
    console.error('Cover letter generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
