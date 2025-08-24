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

    const systemPrompt = `You are a viral social media expert specializing in ${params.platform}. Create content that goes VIRAL using proven engagement tactics.

PLATFORM RULES FOR ${params.platform.toUpperCase()}:
- Character limit: ${limit.chars} chars
- Focus: ${limit.focus}
- Tone: ${params.tone}
- Goal: ${params.goal}

${params.platform === 'linkedin' ? `
LINKEDIN-SPECIFIC VIRAL TECHNIQUES:
- Professional storytelling with personal anecdotes
- Industry insights and "behind the scenes" content
- Actionable tips and step-by-step advice
- Thought leadership and expert positioning
- Professional challenges and solutions
- Career growth and development insights
- Industry trends and predictions
- Professional networking tips
- Success stories and case studies
- Professional humor and relatability` : `
VIRAL TECHNIQUES TO USE:
- Hook in first 3-5 words (question, bold statement, "POV:")
- Pattern interrupts ("Plot twist:", "Hot take:")
- Social proof ("9/10 people don't know this")
- FOMO ("Before it's too late")
- Relatability triggers ("When you finally...")
- Controversy/debate starters
- Numbers and stats
- Personal story angles
- 2-3 strategically placed emojis`}

TARGET: ${params.audience}
Make them STOP scrolling and ENGAGE immediately.`;

    const userPrompt = `Create a VIRAL ${params.platform} post for:

BUSINESS: ${params.business}
PRODUCT: ${params.product}
GOAL: ${params.goal}

Requirements:
- ${params.platform === 'linkedin' ? '800-1200 characters for medium-long professional content' : `Under ${limit.chars} characters`}
- ${params.tone} tone
- Hook ${params.audience} in first 5 words
- Include engaging question or CTA
- NO hashtags (added separately)
- Make it IRRESISTIBLE to scroll past
- ${params.platform === 'linkedin' ? 'Use professional storytelling, industry insights, and actionable tips' : ''}

Focus on ${limit.focus}`;

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

    const systemPrompt = `You are a viral hashtag strategist for ${params.platform}. Generate hashtags that maximize viral reach and engagement.

PLATFORM STRATEGY: ${strategy.strategy}
MAX HASHTAGS: ${strategy.max}

CURRENT VIRAL HASHTAG PATTERNS:
- Trending topics and challenges
- Community-building tags
- Niche micro-communities
- Brand discovery tags
- Engagement-driving tags`;

    const userPrompt = `Generate ${strategy.max} VIRAL hashtags for ${params.platform}:

BUSINESS: ${params.business}
PRODUCT: ${params.product}
AUDIENCE: ${params.audience}

REQUIREMENTS:
- ${strategy.strategy}
- Mix of high-volume and niche tags
- Include discovery tags for ${params.audience}
- Include trending/viral tags for ${params.platform}
- Format: #hashtag (one per line)
- NO explanations, just hashtags`;

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
    tone: string;
  }): Promise<{ cta: string; buttonText: string }> {
    const systemPrompt = `You are a viral engagement expert specializing in CTAs that drive massive action on ${params.platform}.

GOAL: ${params.goal}
TONE: ${params.tone}

HIGH-CONVERTING CTA PATTERNS:
- Questions that demand answers
- FOMO triggers ("Don't miss out")
- Social proof ("Join 1000s who...")
- Challenges ("Can you...?")
- Urgency ("Before it's gone")
- Community building ("Tag someone who...")
- Action-oriented language
- Emotional triggers`;

    const userPrompt = `Create HIGH-CONVERTING CTAs for ${params.platform}:

BUSINESS: ${params.business}
GOAL: ${params.goal}
TONE: ${params.tone}

Generate:
1. VIRAL CTA phrase (max 8 words) - make it irresistible
2. Button text (max 5 words + 1 emoji) - action-focused

Examples of viral CTAs:
- "Tag someone who needs this"
- "Can you guess what happens next?"
- "Who else thinks this is genius?"
- "Don't scroll without saving this"

Format:
CTA: [viral cta phrase]
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
