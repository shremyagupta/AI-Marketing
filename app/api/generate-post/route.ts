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
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 500 }
      );
    }

    const client = new PerplexityClient(apiKey);

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
        tone
      })
    ]);

    // Combine custom hashtags with generated ones
    const allHashtags = [...hashtags, ...customHashtags].slice(0, 8);

    // Extract emojis from content for the emojis array
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const emojis = content.match(emojiRegex) || ['🚀', '✨', '💫'];

    const post: GeneratedPost = {
      content: content.trim(),
      hashtags: allHashtags,
      emojis: emojis.slice(0, 3),
      cta: ctaData.cta,
      buttonText: ctaData.buttonText,
      wordCount: content.split(' ').length,
      platform
    };

    return NextResponse.json({ post });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate post. Please try again.' },
      { status: 500 }
    );
  }
}
