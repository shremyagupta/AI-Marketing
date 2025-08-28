export interface PostInput {
  business: string;
  businessDescription: string;
  product: string;
  platform: 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'facebook';
  audience: string;
  tone: 'humorous' | 'inspirational' | 'bold' | 'minimalist' | 'quirky' | 'premium' | 'playful' | 'professional';
  goal: 'engagement' | 'discovery' | 'shares' | 'signups' | 'sales' | 'awareness';
  customHashtags?: string[];
}

export interface GeneratedPost {
  content: string;
  hashtags: string[];
  emojis: string[];
  cta: string;
  buttonText: string;
  wordCount: number;
  platform: string;
}

const toneTemplates = {
  humorous: {
    starters: ["Who else", "POV:", "Me trying to", "When you finally", "That feeling when"],
    emojis: ["😂", "🤣", "😭", "💀", "🤡", "😏", "🙃"],
    ctas: ["Tag someone who needs this", "Comment if you relate", "Share if this is you"]
  },
  inspirational: {
    starters: ["Believe in", "Your journey", "Success isn't", "Dream big", "Every step"],
    emojis: ["✨", "🌟", "💪", "🚀", "🔥", "💎", "🌈"],
    ctas: ["Double tap if you agree", "Share your story below", "Tag someone who inspires you"]
  },
  bold: {
    starters: ["Stop", "The truth:", "Here's what", "Nobody talks about", "Real talk:"],
    emojis: ["🔥", "💯", "⚡", "🎯", "💥", "🚨", "👑"],
    ctas: ["Repost if you agree", "Drop a 🔥 if this hits", "Share your thoughts"]
  },
  minimalist: {
    starters: ["Less is", "Simple.", "Focus on", "Quality over", "Essential:"],
    emojis: ["▪️", "▫️", "○", "●", "◦", "—", "·"],
    ctas: ["Thoughts?", "Save for later", "Share if you agree"]
  },
  quirky: {
    starters: ["Plot twist:", "Fun fact:", "Weird but true:", "Random thought:", "Just saying:"],
    emojis: ["🤪", "🦄", "🌮", "🎨", "🎭", "🎪", "🎯"],
    ctas: ["Anyone else?", "Thoughts in comments", "Tag your weird friend"]
  },
  premium: {
    starters: ["Introducing", "Crafted for", "Experience", "Elevate your", "Luxury meets"],
    emojis: ["👑", "💎", "✨", "🥂", "🎩", "🏆", "⭐"],
    ctas: ["Discover more", "Join the elite", "Experience luxury"]
  },
  playful: {
    starters: ["Ready to", "Let's go", "Time for", "Who's excited", "Game on"],
    emojis: ["🎉", "🎊", "🎈", "🎮", "🎯", "🎨", "🌈"],
    ctas: ["Join the fun", "Let's play", "Who's in?"]
  },
  professional: {
    starters: ["Announcing", "We're excited", "Industry insight:", "New research shows", "Professional tip:"],
    emojis: ["📊", "💼", "📈", "🎯", "⚡", "💡", "🔧"],
    ctas: ["Learn more", "Connect with us", "Share your experience"]
  }
};

const platformHashtags = {
  instagram: ["#viralpost", "#trending", "#explore", "#fyp", "#reels", "#instagood"],
  twitter: ["#viral", "#trending", "#TwitterTips", "#thread", "#startup", "#tech"],
  linkedin: ["#professional", "#networking", "#career", "#business", "#leadership", "#innovation"],
  tiktok: ["#fyp", "#viral", "#trending", "#foryou", "#tiktokmademebuyit", "#trend"],
  facebook: ["#viral", "#trending", "#community", "#share", "#facebook", "#social"]
};

const goalTemplates = {
  engagement: {
    ctas: ["What do you think?", "Comment below", "Your thoughts?", "Agree or disagree?"],
    questions: ["What's your experience?", "How do you handle this?", "Thoughts?"]
  },
  discovery: {
    ctas: ["Save this post", "Share with friends", "Check us out", "Learn more"],
    questions: ["Have you tried this?", "What else should we share?"]
  },
  shares: {
    ctas: ["Share if you agree", "Repost this", "Tag someone", "Spread the word"],
    questions: ["Who needs to see this?", "Tag a friend who"]
  },
  signups: {
    ctas: ["Sign up now", "Join us", "Get started", "Try it free"],
    questions: ["Ready to start?", "What are you waiting for?"]
  },
  sales: {
    ctas: ["Shop now", "Get yours", "Limited time", "Don't miss out"],
    questions: ["Ready to upgrade?", "Which one's your favorite?"]
  },
  awareness: {
    ctas: ["Learn more", "Discover", "Explore", "Find out why"],
    questions: ["Did you know?", "What surprised you most?"]
  }
};

// AI-powered generation using Perplexity API
export async function generateViralPostWithAI(input: PostInput): Promise<GeneratedPost> {
  try {
    const response = await fetch('/api/generate-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error('AI generation failed, falling back to template:', error);
    // Fallback to template-based generation
    return generateViralPost(input);
  }
}

// Original template-based generation (kept as fallback)
export function generateViralPost(input: PostInput): GeneratedPost {
  const tone = toneTemplates[input.tone];
  const platformTags = platformHashtags[input.platform];
  const goalTemplate = goalTemplates[input.goal];
  
  // Random selection helpers
  const randomFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const randomEmojis = (count: number) => {
    const shuffled = [...tone.emojis].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Generate post content based on tone and platform
  let content = "";
  
  if (input.platform === 'twitter') {
    // Twitter-optimized short format
    content = `${randomFrom(tone.starters)} ${input.product} ${randomEmojis(2).join('')}\n\n${input.business} just dropped something special!\n\n${randomFrom(goalTemplate.ctas)}`;
  } else if (input.platform === 'linkedin') {
    // LinkedIn professional format
    content = `${randomFrom(tone.starters)} ${input.product}.\n\n${input.businessDescription}\n\nWhat this means for ${input.audience}: ${randomFrom(goalTemplate.questions)}`;
  } else {
    // Instagram/TikTok/Facebook format
    const starter = randomFrom(tone.starters);
    const emoji = randomEmojis(2).join(' ');
    content = `${starter} ${input.product} ${emoji}\n\n${input.business} - ${input.businessDescription}\n\n${randomFrom(goalTemplate.ctas)} ${randomEmojis(1)[0]}`;
  }

  // Generate hashtags
  const baseHashtags = platformTags.slice(0, 3);
  const customTags = input.customHashtags || [];
  const businessTag = `#${input.business.replace(/\s+/g, '').toLowerCase()}`;
  const audienceTag = `#${input.audience.split(' ')[0].toLowerCase()}`;
  
  const hashtags = [...baseHashtags, businessTag, audienceTag, ...customTags].slice(0, 8);

  // Generate CTA and button text
  const cta = randomFrom(goalTemplate.ctas);
  const buttonText = input.goal === 'sales' ? `Shop ${input.business} Now 🚀` :
                    input.goal === 'signups' ? `Join ${input.business} Today ✨` :
                    input.goal === 'discovery' ? `Discover ${input.business} 💫` :
                    `Explore ${input.business} 🌟`;

  // Count words (approximate)
  const wordCount = content.split(' ').length;

  return {
    content,
    hashtags,
    emojis: randomEmojis(3),
    cta,
    buttonText,
    wordCount,
    platform: input.platform
  };
}

export function formatPostForPlatform(post: GeneratedPost): string {
  const hashtagString = post.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  
  if (post.platform === 'twitter') {
    return `${post.content}\n\n${hashtagString}`;
  } else if (post.platform === 'linkedin') {
    return `${post.content}\n\n---\n${hashtagString}`;
  } else {
    return `${post.content}\n\n${hashtagString}`;
  }
}

// Generate multiple AI-powered posts
export async function generateMultiplePostsWithAI(input: PostInput, count: number = 3): Promise<GeneratedPost[]> {
  const promises = Array.from({ length: count }, () => generateViralPostWithAI(input));
  return Promise.all(promises);
}

// Original template-based multiple generation
export function generateMultiplePosts(input: PostInput, count: number = 3): GeneratedPost[] {
  return Array.from({ length: count }, () => generateViralPost(input));
}
