import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { currentSkills, targetRole } = await req.json();

    if (!currentSkills || !targetRole) {
      return NextResponse.json(
        { error: 'Missing current skills or target role' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    const systemPrompt = `You are a professional tech career advisor.
Generate an actionable, step-by-step career transition roadmap to go from the current skills to the Target Role.
Suggest chronological steps, detailing:
- Duration (e.g. Weeks 1-2, Month 2)
- Focus topics/technologies to study
- A practical mini-project to build to consolidate knowledge
- The expected milestone of success

Return ONLY a valid JSON object matching this exact structure:
{
  "targetRole": "Role Title",
  "roadmap": [
    { "step": 1, "title": "Phase Title", "duration": "Duration (e.g. Weeks 1-3)", "skills": ["Skill 1", "Skill 2"], "project": "Describe a mini-project", "milestone": "Expected milestone" }
  ]
}

Rules:
- roadmap: Provide 3 to 5 chronological learning phases/steps.
- Keep the steps practical, focused, and realistic for a candidate.`;

    const userMessage = `Current Skills:
${JSON.stringify(currentSkills)}

Target Role:
${targetRole}`;

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
    console.error('Roadmap generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Roadmap generation failed' },
      { status: 500 }
    );
  }
}
