import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please enter a valid resume text (at least 50 characters)' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();
    
    const systemPrompt = `You are a professional Applicant Tracking System (ATS) audit bot and recruiter.
Analyze the candidate's resume text (and optional target Job Description) for parsing compatibility, formatting errors, layout compliance, and keyword density.
Assess how ATS systems (like Workday, Taleo, Greenhouse) would parse and score this resume.

Return ONLY a valid JSON object matching this exact structure:
{
  "score": 75,
  "layoutCompatibility": {
    "score": 85,
    "issues": ["Issue 1 (e.g. Avoid visual progress bars)", "Issue 2"]
  },
  "keywordAnalysis": {
    "foundKeywords": ["Found Skill 1", "Found Skill 2"],
    "missingKeywords": ["Missing High-Priority Skill 1", "Missing High-Priority Skill 2"],
    "density": [
      { "keyword": "Keyword Name", "count": 5, "recommended": "4-8" }
    ]
  },
  "formattingChecks": [
    { "name": "Standard Headings", "pass": true, "details": "Found standard headings like Experience and Education." },
    { "name": "No Visual Charts", "pass": false, "details": "Detected circular skill gauges which ATS cannot read." }
  ],
  "recommendations": [
    "Add critical missing tools to your skills list.",
    "Replace multi-column grid with a single-column layout."
  ]
}

Rules:
- score: Integer between 0 and 100 representing overall compatibility/match.
- layoutCompatibility: Analysis of layouts, columns, and tables.
- keywordAnalysis: Match key skills and calculate recommended densities based on industry averages (or the target JD if provided).
- formattingChecks: Return a checklist of 4 key checks: "Standard Headings", "No Visual Charts", "Contact Details Present", and "Font Readability".
- recommendations: Keep advice highly actionable and specific to technical roles.`;

    const userMessage = `Candidate Resume Text:
${resumeText}

${jobDescription ? `Target Job Description:\n${jobDescription}` : 'No target Job Description provided. Perform a general industry-standard technical ATS audit.'}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error('ATS check error:', err);
    return NextResponse.json(
      { error: err.message || 'ATS analysis failed' },
      { status: 500 }
    );
  }
}
