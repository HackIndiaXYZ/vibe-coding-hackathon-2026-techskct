import { getOpenAI, SYSTEM_PROMPTS } from './client';
import type { PortfolioData } from '@/types';

/* ─── Resume Parser ─────────────────────────────────────────────── */
export async function parseResume(text: string): Promise<PortfolioData> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPTS.RESUME_PARSER },
      { role: 'user', content: `Parse this resume:\n\n${text}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });
  return JSON.parse(completion.choices[0].message.content || '{}') as PortfolioData;
}

/* ─── Content Enhancer ──────────────────────────────────────────── */
export async function enhanceContent(section: string, content: string): Promise<string> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPTS.CONTENT_ENHANCER },
      { role: 'user', content: `Section: ${section}\n\nContent:\n${content}` },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });
  return completion.choices[0].message.content || content;
}

/* ─── Recruiter Simulation ──────────────────────────────────────── */
export async function simulateRecruiter(portfolioData: PortfolioData) {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPTS.RECRUITER_SIMULATOR },
      { role: 'user', content: `Evaluate this portfolio:\n\n${JSON.stringify(portfolioData, null, 2)}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });
  return JSON.parse(completion.choices[0].message.content || '{}');
}

/* ─── Voice Chat ────────────────────────────────────────────────── */
export async function voiceChat(message: string, portfolioData: PortfolioData, history: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPTS.VOICE_ASSISTANT + JSON.stringify(portfolioData) },
      ...history,
      { role: 'user', content: message },
    ],
    temperature: 0.8,
    max_tokens: 200,
  });
  return completion.choices[0].message.content || "I'm not sure about that.";
}

/* ─── TTS ───────────────────────────────────────────────────────── */
export async function textToSpeech(text: string): Promise<Buffer> {
  const openai = getOpenAI();
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova',
    input: text,
    response_format: 'mp3',
  });
  return Buffer.from(await response.arrayBuffer());
}

/* ─── STT (Whisper) ─────────────────────────────────────────────── */
export async function speechToText(audioBuffer: Buffer, filename: string): Promise<string> {
  const openai = getOpenAI();
  const { File } = await import('buffer');
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/webm' });
  const file = new (globalThis as any).File([blob], filename, { type: 'audio/webm' });
  const transcription = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file,
  });
  return transcription.text;
}
