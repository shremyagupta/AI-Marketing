import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY ? '✅ Found' : '❌ Not Found',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
      API_KEY_LENGTH: process.env.PERPLEXITY_API_KEY ? process.env.PERPLEXITY_API_KEY.length : 0,
      API_KEY_PREFIX: process.env.PERPLEXITY_API_KEY ? process.env.PERPLEXITY_API_KEY.substring(0, 10) + '...' : 'N/A'
    };

    return NextResponse.json({ 
      success: true, 
      environment: envVars,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Environment Test Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test environment variables', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
