import { NextRequest, NextResponse } from 'next/server';
import { PerplexityClient } from '@/lib/perplexity-client';
import { GeneratedPost } from '@/lib/viral-post-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      business,
      businessDescription,
      product,
      platform,
      audience,
      tone,
      goal,
      customHashtags = []
    } = body;

    // Validate required fields
    if (!business || !product || !platform || !audience || !tone || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;
    console.log('API Key found:', !!apiKey); // Debug log
    
    if (!apiKey) {
      console.error('Perplexity API key not found in environment variables');
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 500 }
      );
    }

    console.log('Creating Perplexity client...'); // Debug log
    const client = new PerplexityClient(apiKey);

    console.log('Generating content with AI...'); // Debug log
    // Generate content in parallel for better performance
    const [content, hashtags, ctaData] = await Promise.all([
      client.generateViralPost({
        business,
        businessDescription,
        product,
        platform,
        audience,
        tone,
        goal,
        customHashtags
      }),
      client.generateHashtags({
        business,
        product,
        platform,
        audience,
        customHashtags
      }),
      client.generateCTA({
        platform,
        goal,
        business,
        product,
        tone
      })
    ]);

    console.log('Content generated successfully:', { content: content.substring(0, 100) + '...', hashtags, ctaData }); // Debug log

    // Combine custom hashtags with generated ones
    const allHashtags = [...hashtags, ...customHashtags].slice(0, 8);

    // Extract emojis from content for the emojis array
    const emojis = ['🚀', '✨', '💫']; // Default emojis for now

    const post: GeneratedPost = {
      content: content.trim(),
      hashtags: allHashtags,
      emojis: emojis.slice(0, 3),
      cta: ctaData.cta,
      buttonText: ctaData.buttonText,
      wordCount: content.split(' ').length,
      platform
    };

    console.log('Post created successfully'); // Debug log
    return NextResponse.json({ post });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate post. Please try again.' },
      { status: 500 }
    );
  }
}
