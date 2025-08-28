export interface PerplexityRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class PerplexityClient {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(request: PerplexityRequest): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          stream: false, // Ensure no streaming
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Perplexity API Response:', errorText);
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }

      const data: PerplexityResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw error;
    }
  }

  async generateViralPost(params: {
    business: string;
    businessDescription: string;
    product: string;
    platform: string;
    audience: string;
    tone: string;
    goal: string;
    customHashtags?: string[];
  }): Promise<string> {
    // Platform-specific character limits for optimal viral potential
    const platformLimits = {
      instagram: { chars: 125, focus: "Hook in first 125 chars before 'more' cutoff" },
      twitter: { chars: 280, focus: "Concise, punchy, retweet-worthy" },
      linkedin: { chars: 800, focus: "Medium-long professional content (800-1200 chars)" },
      tiktok: { chars: 150, focus: "Short, catchy, trend-aware" },
      facebook: { chars: 40, focus: "Ultra-short for max engagement" }
    };

    const limit = platformLimits[params.platform as keyof typeof platformLimits] || platformLimits.instagram;

    const systemPrompt = `You are a viral social media expert specializing in ${params.platform}. Your task is to create content that EXACTLY matches the user's requirements.

CRITICAL: Generate content based ONLY on the information provided by the user. Do NOT add generic content or assumptions.

PLATFORM: ${params.platform.toUpperCase()}
CHARACTER LIMIT: ${limit.chars} characters
FOCUS: ${limit.focus}
TONE: ${params.tone}
GOAL: ${params.goal}
BUSINESS: ${params.business}
PRODUCT: ${params.product}
AUDIENCE: ${params.audience}

${params.platform === 'linkedin' ? `
LINKEDIN REQUIREMENTS:
- Professional tone appropriate for ${params.tone}
- Focus on ${params.goal} goal
- Target audience: ${params.audience}
- Business context: ${params.business}
- Product/service: ${params.product}
- Use professional storytelling and industry insights` : `
VIRAL TECHNIQUES FOR ${params.platform.toUpperCase()}:
- Hook in first 3-5 words
- ${params.tone} tone throughout
- Focus on ${params.goal} goal
- Target ${params.audience} audience
- Make content irresistible to scroll past`}

IMPORTANT: Stay true to the user's specific business, product, and requirements. Do not use generic examples.`;

    const userPrompt = `Create a VIRAL ${params.platform} post with these EXACT specifications:

BUSINESS: ${params.business}
PRODUCT: ${params.product}
AUDIENCE: ${params.audience}
TONE: ${params.tone}
GOAL: ${params.goal}

REQUIREMENTS:
- ${params.platform === 'linkedin' ? '800-1200 characters for professional content' : `Under ${limit.chars} characters`}
- ${params.tone} tone throughout
- Hook ${params.audience} in first 5 words
- Include engaging question or CTA for ${params.goal}
- NO hashtags (added separately)
- Make it IRRESISTIBLE to scroll past
- Focus on ${limit.focus}
- Content must be SPECIFIC to ${params.business} and ${params.product}

DO NOT use generic content. Create content that is specifically tailored to ${params.business} and their ${params.product}.`;

    const request: PerplexityRequest = {
      model: 'sonar',
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
      ],
      max_tokens: params.platform === 'linkedin' ? 400 : 150,
      temperature: 0.85
    };

    return await this.generateContent(request);
  }

  async generateHashtags(params: {
    business: string;
    product: string;
    platform: string;
    audience: string;
    customHashtags?: string[];
  }): Promise<string[]> {
    // Platform-specific hashtag strategies
    const hashtagLimits = {
      instagram: { max: 30, strategy: "Mix trending, niche, and branded tags" },
      twitter: { max: 3, strategy: "2-3 high-impact trending tags only" },
      linkedin: { max: 8, strategy: "Professional, industry-focused tags with thought leadership" },
      tiktok: { max: 5, strategy: "Trending challenges and viral tags" },
      facebook: { max: 3, strategy: "Broad appeal, community tags" }
    };

    const strategy = hashtagLimits[params.platform as keyof typeof hashtagLimits] || hashtagLimits.instagram;

    const systemPrompt = `You are a viral hashtag strategist for ${params.platform}. Generate hashtags that are SPECIFIC to the user's business and product.

CRITICAL: Create hashtags that are relevant to ${params.business} and ${params.product}. Do NOT use generic hashtags.

PLATFORM: ${params.platform.toUpperCase()}
STRATEGY: ${strategy.strategy}
MAX HASHTAGS: ${strategy.max}
BUSINESS: ${params.business}
PRODUCT: ${params.product}
AUDIENCE: ${params.audience}

HASHTAG REQUIREMENTS:
- Must be relevant to ${params.business} and ${params.product}
- Include industry-specific tags
- Include audience-targeting tags
- Mix of trending and niche tags
- NO generic hashtags like #viral, #trending (unless specifically relevant)`;

    const userPrompt = `Generate ${strategy.max} SPECIFIC hashtags for ${params.platform}:

BUSINESS: ${params.business}
PRODUCT: ${params.product}
AUDIENCE: ${params.audience}

REQUIREMENTS:
- ${strategy.strategy}
- Hashtags must be SPECIFIC to ${params.business} and ${params.product}
- Include industry and product-specific tags
- Include audience-targeting tags
- Include relevant trending tags for ${params.platform}
- Format: #hashtag (one per line)
- NO explanations, just hashtags
- NO generic hashtags unless specifically relevant to the business/product`;

    const request: PerplexityRequest = {
      model: 'sonar',
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
      ],
      max_tokens: 100,
      temperature: 0.75
    };

    const response = await this.generateContent(request);
    return response
      .split('\n')
      .filter(line => line.trim().startsWith('#'))
      .map(line => line.trim())
      .slice(0, strategy.max);
  }

  async generateCTA(params: {
    platform: string;
    goal: string;
    business: string;
    product: string;
    tone: string;
  }): Promise<{ cta: string; buttonText: string }> {
    const systemPrompt = `You are a viral engagement expert specializing in CTAs that drive massive action on ${params.platform}.

CRITICAL: Create CTAs that are SPECIFIC to ${params.business} and their ${params.product}. Do NOT use generic CTAs.

GOAL: ${params.goal}
TONE: ${params.tone}
BUSINESS: ${params.business}
PRODUCT: ${params.product}
PLATFORM: ${params.platform}

CTA REQUIREMENTS:
- Must be relevant to ${params.business} and ${params.product}
- Focus on ${params.goal} goal
- Use ${params.tone} tone
- Platform-appropriate for ${params.platform}
- NO generic CTAs - must be business-specific`;

    const userPrompt = `Create HIGH-CONVERTING CTAs for ${params.platform}:

BUSINESS: ${params.business}
PRODUCT: ${params.product}
GOAL: ${params.goal}
TONE: ${params.tone}

REQUIREMENTS:
- CTAs must be SPECIFIC to ${params.business} and ${params.product}
- Focus on ${params.goal} goal
- Use ${params.tone} tone
- Platform-appropriate for ${params.platform}
- NO generic CTAs

Generate:
1. VIRAL CTA phrase (max 8 words) - make it irresistible and specific to the business
2. Button text (max 5 words + 1 emoji) - action-focused and relevant

Examples of business-specific CTAs:
- "Try [Product] today" (for ${params.business})
- "Join [Business] community"
- "Discover [Product] benefits"
- "Get [Business] insights"

Format:
CTA: [business-specific cta phrase]
BUTTON: [action button text]`;

    const request: PerplexityRequest = {
      model: 'sonar',
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
      ],
      max_tokens: 80,
      temperature: 0.8
    };

    const response = await this.generateContent(request);
    const lines = response.split('\n');
    const ctaLine = lines.find(line => line.includes('CTA:'));
    const buttonLine = lines.find(line => line.includes('BUTTON:'));

    return {
      cta: ctaLine?.replace('CTA:', '').trim() || 'Tag someone who needs this!',
      buttonText: buttonLine?.replace('BUTTON:', '').trim() || `Try ${params.business} 🚀`
    };
  }
}
