import { NextRequest, NextResponse } from 'next/server';
import { voiceChat, textToSpeech, speechToText } from '@/lib/openai/services';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // STT: audio → text
      const formData = await req.formData();
      const audio = formData.get('audio') as File;
      if (!audio) return NextResponse.json({ error: 'No audio' }, { status: 400 });
      const buffer = Buffer.from(await audio.arrayBuffer());
      const transcript = await speechToText(buffer, audio.name || 'audio.webm');
      return NextResponse.json({ transcript });
    }

    const { message, portfolioData, history, tts } = await req.json();

    // Chat response
    const response = await voiceChat(message, portfolioData, history || []);

    if (tts) {
      // Return audio
      const audioBuffer = await textToSpeech(response);
      return new NextResponse(audioBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'X-Response-Text': encodeURIComponent(response),
        },
      });
    }

    return NextResponse.json({ response });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
