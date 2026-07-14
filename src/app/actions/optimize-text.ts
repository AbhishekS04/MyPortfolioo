'use server';

import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

// Initialize OpenAI client with OpenRouter base URL
const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'Portfolio Admin',
  },
});

// Maximum allowed text length to prevent API abuse
const MAX_TEXT_LENGTH = 5000;

export async function optimizeText(currentText: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized access' };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      error:
        'Development Config Error: OPENROUTER_API_KEY is missing via process.env',
    };
  }

  if (!currentText || currentText.trim().length === 0) {
    return { error: 'No text provided' };
  }

  if (currentText.length > MAX_TEXT_LENGTH) {
    return {
      error: `Text too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.`,
    };
  }

  try {
    const response = await client.chat.completions.create({
      model: 'google/gemma-3-27b-it:free',
      messages: [
        {
          role: 'system',
          content: `Refine the following text for clarity, conciseness, and professionalism.
Preserve the original meaning and intent.
Do not add new ideas, claims, or information.
Keep the tone confident, minimal, and natural.`,
        },
        {
          role: 'user',
          content: currentText,
        },
      ],
      temperature: 0.7, // Balance between creativity and strictness
    });

    const optimizedText = response.choices[0]?.message?.content?.trim();

    if (!optimizedText) {
      throw new Error('No response from AI');
    }

    return { optimizedText };
  } catch (error: unknown) {
    console.error('AI Optimization Error:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to optimize text. Please check server logs.',
    };
  }
}
