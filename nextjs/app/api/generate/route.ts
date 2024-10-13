import { NextResponse } from 'next/server';
import OpenAI from 'openai';


require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generalSystemPrompt = `
You are an assistant that generates Manim code for animations. Please output code that follows these guidelines: 
1. Always use GenScene as the class name. 
2. Use self.play() for animations.
3. Only output code, no explanations.
`;

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: generalSystemPrompt },
        { role: 'user', content: question },
      ],
    });

    const code = response.choices[0]?.message?.content || 'Error generating code.';
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}