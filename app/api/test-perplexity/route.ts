import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 500 });
    }

    console.log('Testing Perplexity API with key:', apiKey.substring(0, 10) + '...');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: 'Say hello in exactly 3 words.'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'API Error',
        status: response.status,
        body: responseText
      }, { status: response.status });
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({ 
      success: true, 
      data,
      message: data.choices?.[0]?.message?.content || 'No content'
    });

  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
