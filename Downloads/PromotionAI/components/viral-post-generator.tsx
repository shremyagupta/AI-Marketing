"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostPreview } from "@/components/post-preview";
import { ThemeToggle } from "@/components/theme-toggle";
import { generateViralPost, generateMultiplePosts, generateMultiplePostsWithAI, formatPostForPlatform, type PostInput, type GeneratedPost } from "@/lib/viral-post-generator";
import { Sparkles, RefreshCw, Download, Copy, Smartphone, Monitor, Tablet, Palette } from "lucide-react";

export function ViralPostGenerator() {
  const [formData, setFormData] = useState<PostInput>({
    business: "",
    businessDescription: "",
    product: "",
    platform: "instagram",
    audience: "",
    tone: "playful",
    goal: "engagement",
    customHashtags: []
  });

  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customHashtagInput, setCustomHashtagInput] = useState("");
  const [useAI, setUseAI] = useState(true);

  const handleInputChange = (field: keyof PostInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCustomHashtag = () => {
    if (customHashtagInput.trim()) {
      const newTag = customHashtagInput.trim().startsWith('#') 
        ? customHashtagInput.trim() 
        : `#${customHashtagInput.trim()}`;
      
      setFormData(prev => ({
        ...prev,
        customHashtags: [...(prev.customHashtags || []), newTag]
      }));
      setCustomHashtagInput("");
    }
  };

  const removeHashtag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customHashtags: prev.customHashtags?.filter((_, i) => index !== i) || []
    }));
  };

  const generatePosts = async () => {
    if (!formData.business || !formData.product || !formData.audience) {
      alert("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    
    try {
      let posts: GeneratedPost[];
      
      if (useAI) {
        // Use AI-powered generation
        posts = await generateMultiplePostsWithAI(formData, 3);
      } else {
        // Use template-based generation
        posts = generateMultiplePosts(formData, 3);
      }
      
      setGeneratedPosts(posts);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Please try again or switch to template mode.');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportAllPosts = () => {
    const formattedPosts = generatedPosts.map((post, index) => 
      `=== POST ${index + 1} (${post.platform.toUpperCase()}) ===\n\n${formatPostForPlatform(post)}\n\nButton Text: ${post.buttonText}\n\n`
    ).join('\n');
    
    const blob = new Blob([formattedPosts], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viral-posts-${formData.business.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAllPosts = async () => {
    const formattedPosts = generatedPosts.map((post, index) => 
      `POST ${index + 1} (${post.platform.toUpperCase()}):\n\n${formatPostForPlatform(post)}\n\nButton: ${post.buttonText}\n\n---\n\n`
    ).join('');
    
    await navigator.clipboard.writeText(formattedPosts);
    alert("All posts copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      {/* Header Section */}
      <div className="bg-card/50 backdrop-blur-xl border-b border-border/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {/* Theme Toggle */}
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-gradient-to-r from-primary to-primary/80 rounded-3xl shadow-2xl glow">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Viral Post Generator
              </h1>
            </div>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Create engagement-driven social media content with AI-powered templates and professional optimization
            </p>
            
            {/* Device Icons */}
            <div className="flex items-center justify-center gap-6 mt-8 text-muted-foreground">
              <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm px-3 py-2 rounded-full border border-border/30">
                <Smartphone className="w-5 h-5" />
                <span className="text-sm">Mobile</span>
              </div>
              <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm px-3 py-2 rounded-full border border-border/30">
                <Tablet className="w-5 h-5" />
                <span className="text-sm">Tablet</span>
              </div>
              <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm px-3 py-2 rounded-full border border-border/30">
                <Monitor className="w-5 h-5" />
                <span className="text-sm">Desktop</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Form - Takes 1/3 on large screens */}
          <div className="xl:col-span-1">
            <Card className="sticky top-8 premium-card backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <span>Post Configuration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="ai-toggle" className="text-sm font-medium text-muted-foreground">AI Mode</Label>
                    <div className="relative">
                      <input
                        id="ai-toggle"
                        type="checkbox"
                        checked={useAI}
                        onChange={(e) => setUseAI(e.target.checked)}
                        className="sr-only"
                      />
                      <label
                        htmlFor="ai-toggle"
                        className={`block w-12 h-6 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                          useAI ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`block w-4 h-4 bg-background rounded-full shadow transform transition-transform duration-300 ease-in-out ${
                            useAI ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </label>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  {useAI 
                    ? "🤖 AI-powered content generation using Perplexity API" 
                    : "📝 Template-based content generation (offline)"
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Business Info */}
                <div className="space-y-3">
                  <Label htmlFor="business" className="text-sm font-semibold text-foreground">
                    Business Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="business"
                    placeholder="PureSip"
                    value={formData.business}
                    onChange={(e) => handleInputChange('business', e.target.value)}
                    className="h-11 dark-input focus:ring-primary/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="businessDescription" className="text-sm font-semibold text-foreground">
                    Business Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Sustainable water bottles for active lifestyles"
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                    rows={3}
                    className="dark-input focus:ring-primary/50 resize-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="product" className="text-sm font-semibold text-foreground">
                    Product/Service/Topic <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="product"
                    placeholder="New self-cleaning bottle"
                    value={formData.product}
                    onChange={(e) => handleInputChange('product', e.target.value)}
                    className="h-11 dark-input focus:ring-primary/50 transition-all duration-200"
                  />
                </div>

                {/* Platform & Tone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">Platform</Label>
                    <Select value={formData.platform} onValueChange={(value: any) => handleInputChange('platform', value)}>
                      <SelectTrigger className="h-11 dark-input focus:ring-primary/50 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border border-border/50">
                        <SelectItem value="instagram">📸 Instagram</SelectItem>
                        <SelectItem value="twitter">🐦 Twitter/X</SelectItem>
                        <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                        <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                        <SelectItem value="facebook">👥 Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Platform Info */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 rounded-lg border border-primary/20">
                      <div className="text-xs text-primary font-medium">
                        {formData.platform === 'instagram' && '📸 Max: 2,200 chars • Viral: First 125 chars'}
                        {formData.platform === 'twitter' && '🐦 Max: 280 chars • Viral: Short & punchy'}
                        {formData.platform === 'linkedin' && '💼 Max: 3,000 chars • Viral: 800-1200 chars (medium-long)'}
                        {formData.platform === 'tiktok' && '🎵 Max: 2,200 chars • Viral: Trend-aware'}
                        {formData.platform === 'facebook' && '👥 Max: 63k chars • Viral: Under 40 chars'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">Tone</Label>
                    <Select value={formData.tone} onValueChange={(value: any) => handleInputChange('tone', value)}>
                      <SelectTrigger className="h-11 dark-input focus:ring-primary/50 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border border-border/50">
                        <SelectItem value="playful">🎉 Playful</SelectItem>
                        <SelectItem value="humorous">😂 Humorous</SelectItem>
                        <SelectItem value="inspirational">✨ Inspirational</SelectItem>
                        <SelectItem value="bold">🔥 Bold</SelectItem>
                        <SelectItem value="minimalist">▫️ Minimalist</SelectItem>
                        <SelectItem value="quirky">🤪 Quirky</SelectItem>
                        <SelectItem value="premium">👑 Premium</SelectItem>
                        <SelectItem value="professional">💼 Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="audience" className="text-sm font-semibold text-foreground">
                    Target Audience <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="audience"
                    placeholder="Gen Z runners and gym goers"
                    value={formData.audience}
                    onChange={(e) => handleInputChange('audience', e.target.value)}
                    className="h-11 dark-input focus:ring-primary/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">Goal</Label>
                  <Select value={formData.goal} onValueChange={(value: any) => handleInputChange('goal', value)}>
                    <SelectTrigger className="h-11 dark-input focus:ring-primary/50 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card/95 backdrop-blur-xl border border-border/50">
                      <SelectItem value="engagement">💬 Drive Engagement</SelectItem>
                      <SelectItem value="discovery">🔍 Product Discovery</SelectItem>
                      <SelectItem value="shares">🔄 Get Shares</SelectItem>
                      <SelectItem value="signups">📝 Drive Signups</SelectItem>
                      <SelectItem value="sales">💰 Increase Sales</SelectItem>
                      <SelectItem value="awareness">📢 Brand Awareness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Hashtags */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">Custom Hashtags (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="#EcoVibes"
                      value={customHashtagInput}
                      onChange={(e) => setCustomHashtagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomHashtag()}
                      className="flex-1 dark-input focus:ring-primary/50 transition-all duration-200"
                    />
                    <Button type="button" onClick={addCustomHashtag} variant="outline" size="sm" className="px-4 border-border/50 hover:bg-accent/50">
                      Add
                    </Button>
                  </div>
                  {formData.customHashtags && formData.customHashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.customHashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-primary/20 to-primary/10 text-primary-foreground text-xs px-3 py-1.5 rounded-full cursor-pointer hover:from-primary/30 hover:to-primary/20 transition-all duration-200 border border-primary/30"
                          onClick={() => removeHashtag(index)}
                        >
                          {tag} <span className="text-primary font-bold">×</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={generatePosts} 
                  className="w-full h-12 premium-button glow hover:glow" 
                  size="lg"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                      {useAI ? 'AI Generating...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      {useAI ? '🤖 Generate with AI' : '📝 Generate with Templates'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Posts - Takes 2/3 on large screens */}
          <div className="xl:col-span-2 space-y-6">
            {generatedPosts.length > 0 && (
              <Card className="premium-card backdrop-blur-xl">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-b border-green-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-green-600 dark:text-green-400">Generated Posts</CardTitle>
                      <CardDescription className="text-green-600/70 dark:text-green-400/70 mt-1">
                        3 variations optimized for {formData.platform} - {useAI ? 'AI-powered' : 'template-based'} generation
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={copyAllPosts} variant="outline" size="sm" className="border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/10">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All
                      </Button>
                      <Button onClick={exportAllPosts} variant="outline" size="sm" className="border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/10">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {generatedPosts.map((post, index) => (
                <PostPreview
                  key={index}
                  post={post}
                  onCopy={() => console.log(`Post ${index + 1} copied`)}
                />
              ))}
            </div>

            {generatedPosts.length === 0 && !isGenerating && (
              <Card className="h-96 flex items-center justify-center premium-card backdrop-blur-xl">
                <CardContent className="text-center">
                  <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 glow">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Generate Viral Posts</h3>
                  <p className="text-muted-foreground mb-1">Fill in the form and click generate to create</p>
                  <p className="text-sm text-muted-foreground/70">AI-powered content optimized for your platform</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Example Section */}
        <Card className="mt-16 premium-card backdrop-blur-xl">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50">
            <CardTitle className="text-xl text-foreground">How It Works - Example</CardTitle>
            <CardDescription className="text-muted-foreground">
              Here's an example of the viral post generator in action
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gradient-to-r from-muted/30 to-muted/20 p-8 rounded-xl border border-border/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 text-foreground text-lg">Input Configuration:</h4>
                  <ul className="text-sm space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-foreground">Business:</strong> PureSip — sustainable water bottles for active lifestyles
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary/80 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-foreground">Product:</strong> New self-cleaning bottle
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary/60 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-foreground">Platform:</strong> Instagram
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary/40 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-foreground">Audience:</strong> Gen Z runners and gym goers
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary/20 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-foreground">Tone:</strong> Playful, energetic
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary/10 rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <strong className="text-foreground">Goal:</strong> Drive shop page visits
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4 text-foreground text-lg">Generated Output:</h4>
                  <div className="bg-card/50 p-6 rounded-lg border border-border/50 shadow-lg">
                    <p className="text-sm mb-4 text-foreground leading-relaxed">
                      "Ready to hydrate smarter, not harder? 💧💡 Our new PureSip bottle cleans itself—no judgment for post-run laziness!
                      <br /><br />
                      Join the fun! 🌱"
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary-foreground text-xs px-3 py-1.5 rounded-full border border-primary/30">#viralpost</span>
                      <span className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary-foreground text-xs px-3 py-1.5 rounded-full border border-primary/30">#trending</span>
                      <span className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary-foreground text-xs px-3 py-1.5 rounded-full border border-primary/30">#puresip</span>
                      <span className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary-foreground text-xs px-3 py-1.5 rounded-full border border-primary/30">#genz</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 text-primary hover:from-primary/20 hover:to-primary/10">
                      Shop PureSip — Stay Fresh 🚀
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
