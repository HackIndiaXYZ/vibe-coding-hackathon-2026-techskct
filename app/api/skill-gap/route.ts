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

    const systemPrompt = `You are a professional IT career counselor and skills auditor.
Compare the candidate's current skills against the industry standards for the specified Target Role.
Identify missing technical skills, concepts, or tools. Rate each gap's priority (High, Medium, Low) and provide a concise reason.

Return ONLY a valid JSON object matching this exact structure:
{
  "matchPercentage": 65,
  "missingSkills": [
    { "skill": "Skill Name", "priority": "High | Medium | Low", "description": "Short explanation of why this skill is needed for this role." }
  ],
  "strengths": ["Strength 1", "Strength 2"]
}

Rules:
- matchPercentage: Integer between 0 and 100 representing how well the current skills match the Target Role.
- missingSkills: List up to 6 key missing skills/technologies.
- strengths: List up to 4 existing skills that align well with the target role.`;

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
    console.error('Skill gap audit error:', err);
    return NextResponse.json(
      { error: err.message || 'Audit failed' },
      { status: 500 }
    );
  }
}
