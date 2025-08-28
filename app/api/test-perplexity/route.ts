import { NextRequest, NextResponse } from 'next/server';
import { PerplexityClient } from '@/lib/perplexity-client';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Perplexity API key not found in environment variables' },
        { status: 500 }
      );
    }

    // Test the API with a simple request
    const client = new PerplexityClient(apiKey);
    
    const testResponse = await client.generateContent({
      model: 'sonar',
      messages: [
        { role: 'user', content: 'Hello! Just testing the API connection. Please respond with "API is working!"' }
      ],
      max_tokens: 50,
      temperature: 0.7
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Perplexity API is working!',
      response: testResponse,
      apiKeyConfigured: !!apiKey
    });

  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test Perplexity API', 
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyConfigured: !!process.env.PERPLEXITY_API_KEY
      },
      { status: 500 }
    );
  }
}
