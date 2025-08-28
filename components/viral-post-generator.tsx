"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PostPreview } from "@/components/post-preview";
import { ThemeToggle } from "@/components/theme-toggle";
import { generateViralPost, generateMultiplePosts, generateMultiplePostsWithAI, formatPostForPlatform, type PostInput, type GeneratedPost } from "@/lib/viral-post-generator";
import { 
  Sparkles, 
  RefreshCw, 
  Download, 
  Copy, 
  Palette,
  Zap,
  Target,
  TrendingUp,
  Bot,
  FileText,
  CheckCircle2,
  XCircle,
  Plus,
  Hash,
  MessageSquare,
  Send,
  Trash2,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Bot as BotIcon,
  Sparkles as SparklesIcon,
  Instagram,
  Twitter,
  Linkedin,
  MessageCircle,
  BarChart3,
  Zap as ZapIcon,
  Github,
  Gift
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  postData?: PostInput;
  generatedPosts?: GeneratedPost[];
}

type Platform = "instagram" | "twitter" | "linkedin" | "tiktok" | "facebook";

interface PlatformOption {
  id: Platform;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradient: string;
}

export function ViralPostGenerator() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPlatformSelection, setShowPlatformSelection] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [parsedData, setParsedData] = useState<PostInput | null>(null);
  const [showDataEdit, setShowDataEdit] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const platformOptions: PlatformOption[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />,
      description: 'Visual storytelling & engagement',
      color: 'from-pink-500 to-purple-600',
      gradient: 'bg-gradient-to-r from-pink-500 to-purple-600'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />,
      description: 'Concise, viral content',
      color: 'from-blue-500 to-sky-600',
      gradient: 'bg-gradient-to-r from-blue-500 to-sky-600'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />,
      description: 'Professional thought leadership',
      color: 'from-blue-600 to-indigo-700',
      gradient: 'bg-gradient-to-r from-blue-600 to-indigo-700'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      description: 'Trend-driven viral content',
      color: 'from-black to-gray-800',
      gradient: 'bg-gradient-to-r from-black to-gray-800'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      description: 'Community & brand building',
      color: 'from-blue-600 to-blue-700',
      gradient: 'bg-gradient-to-r from-blue-600 to-blue-700'
    }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setPendingPrompt(inputValue);
    setInputValue("");
    setShowPlatformSelection(true);
  };

  const handlePlatformSelection = async (platformId: string) => {
    setSelectedPlatform(platformId);
    setShowPlatformSelection(false);
    
    // Parse user input to extract post requirements
    const postData = parseUserInput(pendingPrompt, platformId as Platform);
    setParsedData(postData);
    
    // Show parsing confirmation to user
    const parsingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: `I understand you want to create content for ${platformOptions.find(p => p.id === platformId)?.name}. Here's what I extracted from your request:

Business: ${postData.business}
Product/Service: ${postData.product}
Audience: ${postData.audience}
Tone: ${postData.tone}
Goal: ${postData.goal}
Platform: ${platformOptions.find(p => p.id === platformId)?.name}

Is this correct? If yes, I'll generate viral posts. If not, you can edit the details.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, parsingMessage]);
    setShowDataEdit(true);
  };

  const handleGeneratePosts = async () => {
    if (!parsedData || !selectedPlatform) return;

    setIsGenerating(true);
    setShowDataEdit(false);
    
    try {
      // Generate posts
      let generatedPosts: GeneratedPost[];
      
      try {
        generatedPosts = await generateMultiplePostsWithAI(parsedData, 3);
      } catch (error) {
        console.error('Error generating posts with AI:', error);
        // Fallback to template-based generation if AI fails
        generatedPosts = generateMultiplePosts(parsedData, 3);
      }

      // Add AI response with generated posts
      const aiMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: `Perfect! I've created ${generatedPosts.length} viral posts optimized for ${platformOptions.find(p => p.id === selectedPlatform)?.name}! Here they are:`,
        timestamp: new Date(),
        generatedPosts: generatedPosts
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating posts:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: "I apologize, but I encountered an error while generating your posts. Please try again or check your input.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
      setSelectedPlatform("");
      setParsedData(null);
    }
  };

  // AI mode is always on
  const getAIModeStatus = () => {
    return "🤖 AI Mode: ON";
  };

  const parseUserInput = (input: string, platform: Platform): PostInput => {
    // Enhanced parsing logic to extract user's actual requirements
    const lowerInput = input.toLowerCase();
    
    // Extract business name - look for patterns like "for [business]", "about [business]", etc.
    let business = '';
    const businessPatterns = [
      /for\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /about\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /business\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /company\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /brand\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /startup\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /shop\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /restaurant\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /agency\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i
    ];
    
    for (const pattern of businessPatterns) {
      const match = input.match(pattern);
      if (match && match[1] && match[1].trim().length > 2 && !['my', 'the', 'a', 'an'].includes(match[1].trim().toLowerCase())) {
        business = match[1].trim();
        break;
      }
    }
    
    // Extract product/service - look for patterns like "product", "service", "about [product]", etc.
    let product = '';
    const productPatterns = [
      /product\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /service\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /about\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /create\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /generate\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /new\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /our\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i
    ];
    
    for (const pattern of productPatterns) {
      const match = input.match(pattern);
      if (match && match[1] && match[1].trim().length > 2 && !['my', 'the', 'a', 'an'].includes(match[1].trim().toLowerCase())) {
        product = match[1].trim();
        break;
      }
    }
    
    // Extract business description from the user's input
    let businessDescription = input.length > 50 ? input.substring(0, 100) + '...' : input;
    
    // Extract audience - look for patterns like "for [audience]", "targeting [audience]", etc.
    let audience = '';
    const audiencePatterns = [
      /for\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /targeting\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /audience\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /customers\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /professionals\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i,
      /businesses\s+([a-zA-Z0-9\s&]+?)(?:\s|$|,|\.)/i
    ];
    
    for (const pattern of audiencePatterns) {
      const match = input.match(pattern);
      if (match && match[1] && match[1].trim().length > 2 && !['my', 'the', 'a', 'an'].includes(match[1].trim().toLowerCase())) {
        audience = match[1].trim();
        break;
      }
    }
    
    // Determine tone based on user's input
    let tone: PostInput['tone'] = 'playful';
    if (lowerInput.includes('professional') || lowerInput.includes('business') || lowerInput.includes('corporate') || lowerInput.includes('linkedin')) {
      tone = 'professional';
    } else if (lowerInput.includes('funny') || lowerInput.includes('humorous') || lowerInput.includes('comedy')) {
      tone = 'humorous';
    } else if (lowerInput.includes('inspirational') || lowerInput.includes('motivational') || lowerInput.includes('uplifting')) {
      tone = 'inspirational';
    } else if (lowerInput.includes('bold') || lowerInput.includes('confident') || lowerInput.includes('assertive')) {
      tone = 'bold';
    } else if (lowerInput.includes('minimalist') || lowerInput.includes('simple') || lowerInput.includes('clean')) {
      tone = 'minimalist';
    } else if (lowerInput.includes('quirky') || lowerInput.includes('unique') || lowerInput.includes('different')) {
      tone = 'quirky';
    } else if (lowerInput.includes('premium') || lowerInput.includes('luxury') || lowerInput.includes('high-end')) {
      tone = 'premium';
    }
    
    // Determine goal based on user's input
    let goal: PostInput['goal'] = 'engagement';
    if (lowerInput.includes('sales') || lowerInput.includes('buy') || lowerInput.includes('purchase')) {
      goal = 'sales';
    } else if (lowerInput.includes('signup') || lowerInput.includes('register') || lowerInput.includes('join')) {
      goal = 'signups';
    } else if (lowerInput.includes('awareness') || lowerInput.includes('brand') || lowerInput.includes('visibility')) {
      goal = 'awareness';
    } else if (lowerInput.includes('shares') || lowerInput.includes('viral') || lowerInput.includes('spread')) {
      goal = 'shares';
    } else if (lowerInput.includes('discovery') || lowerInput.includes('learn') || lowerInput.includes('find')) {
      goal = 'discovery';
    }
    
    // Extract custom hashtags if mentioned
    const hashtagMatches = input.match(/#[a-zA-Z0-9]+/g);
    const customHashtags = hashtagMatches ? hashtagMatches.map(tag => tag.substring(1)) : [];
    
    // If we couldn't extract meaningful business/product info, use the input as business description
    if (business === 'Your Business' && product === 'Product/Service') {
      business = 'Your Business';
      product = 'Your Product/Service';
      businessDescription = input;
    }
    
    return {
      business,
      businessDescription,
      product,
      platform,
      audience,
      tone,
      goal,
      customHashtags
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowPlatformSelection(false);
    setPendingPrompt("");
    setSelectedPlatform("");
  };

  const exportAllPosts = () => {
    const allPosts = messages
      .filter(msg => msg.generatedPosts)
      .flatMap(msg => msg.generatedPosts || []);
    
    if (allPosts.length === 0) return;

    const formattedPosts = allPosts.map((post, index) => 
      `=== POST ${index + 1} (${post.platform.toUpperCase()}) ===\n\n${formatPostForPlatform(post)}\n\nButton Text: ${post.buttonText}\n\n`
    ).join('\n');
    
    const blob = new Blob([formattedPosts], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viral-posts-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAllPosts = async () => {
    const allPosts = messages
      .filter(msg => msg.generatedPosts)
      .flatMap(msg => msg.generatedPosts || []);
    
    if (allPosts.length === 0) return;

    const formattedPosts = allPosts.map((post, index) => 
      `POST ${index + 1} (${post.platform.toUpperCase()}):\n\n${formatPostForPlatform(post)}\n\nButton: ${post.buttonText}\n\n---\n\n`
    ).join('');
    
    await navigator.clipboard.writeText(formattedPosts);
    alert("All posts copied to clipboard!");
  };

  const hasGeneratedPosts = messages.some(msg => msg.generatedPosts && msg.generatedPosts.length > 0);

  return (
    <div className="h-screen bg-background flex overflow-hidden no-zoom">
      {/* Fixed Sidebar - Never Scrolls */}
      <div className="hidden lg:block w-80 bg-card border-r border-border flex-shrink-0 h-screen">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl border border-primary/20">
                <span className="text-2xl font-bold text-primary">P.</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Promotely</h2>
                <p className="text-xs text-muted-foreground">AI Viral Post Generator</p>
              </div>
            </div>
            
            {/* AI Mode Toggle */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ZapIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI Mode: Always ON</span>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">🤖 AI Mode: ON</span>
                </div>
                <p className="mt-1">
                  AI-powered content generation using advanced algorithms
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-b border-border space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Actions
            </h3>
            <Button 
              onClick={clearChat} 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
            {hasGeneratedPosts && (
              <>
                <Button 
                  onClick={copyAllPosts} 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Posts
                </Button>
                <Button 
                  onClick={exportAllPosts} 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="p-6 mt-auto">
            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-border relative sidebar-theme-toggle">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Theme</span>
              <div className="relative">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[95vw] sm:max-w-[85vw] md:max-w-[70vw] bg-card border-r border-border mobile-sidebar z-50 shadow-2xl">
            <div className="flex flex-col h-full bg-card">
              {/* Mobile Sidebar Header */}
              <div className="p-4 md:p-6 border-b border-border flex items-center justify-between flex-shrink-0 bg-card">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">Promotely</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden h-10 w-10 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto bg-card">
                {/* AI Mode Toggle */}
                <div className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <ZapIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm md:text-base font-medium text-foreground">AI Mode: Always ON</span>
                  </div>
                  
                  <div className="text-sm md:text-base text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">🤖 AI Mode: ON</span>
                    </div>
                    <p>
                      AI-powered content generation using advanced algorithms
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 md:p-6 border-b border-border space-y-3">
                  <h3 className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Actions
                  </h3>
                  <Button 
                    onClick={clearChat} 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-10 md:h-11"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Chat
                  </Button>
                  {hasGeneratedPosts && (
                    <>
                      <Button 
                        onClick={copyAllPosts} 
                        variant="outline" 
                        size="sm" 
                        className="w-full h-10 md:h-11"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All Posts
                      </Button>
                      <Button 
                        onClick={exportAllPosts} 
                        variant="outline" 
                        size="sm" 
                        className="w-full h-10 md:h-11"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export All
                      </Button>
                    </>
                  )}
                </div>
                </div>

              {/* Theme Toggle - Fixed at Bottom */}
              <div className="p-4 md:p-6 border-t border-border flex-shrink-0 bg-card">
                <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-lg border border-border relative sidebar-theme-toggle">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm md:text-base text-muted-foreground">Theme</span>
                  <div className="relative">
                    <ThemeToggle />
                  </div>
                </div>
                      </div>
                    </div>
                  </div>

          {/* Overlay - Only covers area outside sidebar */}
          <div 
            className="fixed top-0 right-0 bottom-0 bg-black/50 z-40 mobile-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
                  </div>
      )}

      {/* Main Chat Area - Fixed Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-background">
        {/* Fixed Header */}
        <div className="bg-card border-b border-border p-3 sm:p-4 md:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 p-0"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl border border-primary/20">
                  <span className="text-lg sm:text-xl font-bold text-primary">P.</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Promotely</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">AI Viral Post Generator</p>
                </div>
              </div>
                </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs hidden sm:inline-flex">
                🤖 AI Mode: ON
              </Badge>
              
              {/* GitHub and Support Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://github.com/shremyagupta', '_blank')}
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-muted/50"
                  title="View on GitHub"
                >
                  <Github className="w-4 h-4" />
                    </Button>
{/*                 
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://syedimtiyazali.gumroad.com/coffee', '_blank')}
                  className="h-8 px-2 sm:h-9 sm:px-3 text-xs hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                  title="Support the project"
                >
                  <Gift className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Support</span>
                </Button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Messages Area - Only This Scrolls */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 bg-background pb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-full sm:max-w-2xl md:max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 sm:mb-3 ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-primary to-primary/80 ml-2 sm:ml-3' 
                    : 'bg-gradient-to-r from-muted to-muted/80 mr-2 sm:mr-3'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  ) : (
                    <BotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  )}
          </div>

                {/* Message Content */}
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-full sm:max-w-2xl md:max-w-3xl rounded-2xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground'
                  }`}>
                    {message.content.includes('Business:') && message.content.includes('Product/Service:') ? (
                      <div className="space-y-3">
                        {message.content.split('\n').map((line, index) => {
                          if (line.includes('Business:') || line.includes('Product/Service:') || line.includes('Audience:') || line.includes('Tone:') || line.includes('Goal:') || line.includes('Platform:')) {
                            const [label, value] = line.split(':');
                            return (
                              <div key={index} className="flex items-center gap-2 py-1">
                                <span className="font-semibold text-primary min-w-[120px]">{label}:</span>
                                <span className="text-foreground">{value}</span>
                    </div>
                            );
                          }
                          return <p key={index} className="text-foreground">{line}</p>;
                        })}
                    </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    )}
                    
                    {/* Generated Posts */}
                    {message.generatedPosts && (
                      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                          {message.generatedPosts.map((post, index) => (
                <PostPreview
                  key={index}
                  post={post}
                  onCopy={() => console.log(`Post ${index + 1} copied`)}
                />
              ))}
            </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Timestamp */}
                <div className={`text-xs text-muted-foreground mt-1 sm:mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
          </div>
        </div>
          ))}
          
          {/* Platform Selection */}
          {showPlatformSelection && (
            <div className="flex justify-start">
              <div className="max-w-full sm:max-w-2xl md:max-w-4xl order-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-muted to-muted/80 flex items-center justify-center mb-2 sm:mb-3 mr-2 sm:mr-3">
                  <BotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </div>
                <div className="flex justify-start">
                  <Card className="max-w-full sm:max-w-2xl md:max-w-3xl">
                    <CardHeader className="p-3 sm:p-4 md:p-6">
                      <CardTitle className="text-base sm:text-lg">Choose Your Platform</CardTitle>
                      <CardDescription className="text-sm">
                        I understand you want to create: <span className="text-primary font-medium">"{pendingPrompt}"</span>
            </CardDescription>
          </CardHeader>
                    <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                      <p className="text-sm text-muted-foreground">Which platform would you like me to optimize the content for?</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {platformOptions.map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() => handlePlatformSelection(platform.id)}
                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 group hover:scale-105 ${
                              selectedPlatform === platform.id 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-border/60 hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`p-2 rounded-lg ${platform.gradient} text-white group-hover:shadow-lg transition-all duration-200`}>
                                {platform.icon}
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-foreground group-hover:text-foreground transition-colors duration-200 text-sm sm:text-base">
                                  {platform.name}
                                </h4>
                                <p className="text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors duration-200">
                                  {platform.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <div className="pt-3 sm:pt-4 border-t border-border">
                        <Button
                          onClick={() => setShowPlatformSelection(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
                      </div>
          )}
          
          {/* Generating indicator */}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="max-w-full sm:max-w-2xl md:max-w-4xl order-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-muted to-muted/80 flex items-center justify-center mb-2 sm:mb-3 mr-2 sm:mr-3">
                  <BotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      </div>
                <div className="flex justify-start">
                  <Card className="max-w-full sm:max-w-2xl md:max-w-3xl">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                        <span className="text-sm">Generating viral posts...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {/* Data Editing Interface */}
          {showDataEdit && parsedData && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Review and Edit Your Content Details</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowDataEdit(false);
                        setParsedData(null);
                        setSelectedPlatform("");
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Helpful Instructions */}
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">i</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          💡 How to get the best results:
                        </h4>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• <strong>Be specific</strong> - Instead of "my business", use "TechFlow Solutions"</li>
                          <li>• <strong>Describe clearly</strong> - Explain what you do and who you help</li>
                          <li>• <strong>Choose appropriate tone</strong> - Professional for LinkedIn, playful for Instagram</li>
                          <li>• <strong>Set clear goals</strong> - What do you want people to do?</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-business" className="text-sm font-medium text-foreground">
                          Business Name <span className="text-muted-foreground">*</span>
                        </Label>
                        <Input
                          id="edit-business"
                          value={parsedData.business}
                          onChange={(e) => setParsedData({...parsedData, business: e.target.value})}
                          placeholder="e.g., TechFlow, Acme Corp, My Startup, Digital Agency"
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          The name of your business, brand, or company
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="edit-product" className="text-sm font-medium text-foreground">
                          Product/Service <span className="text-muted-foreground">*</span>
                        </Label>
                        <Input
                          id="edit-product"
                          value={parsedData.product}
                          onChange={(e) => setParsedData({...parsedData, product: e.target.value})}
                          placeholder="e.g., AI software, Consulting services, Mobile app, E-commerce platform"
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          What you're selling, offering, or promoting
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-audience" className="text-sm font-medium text-foreground">
                          Target Audience <span className="text-muted-foreground">*</span>
                        </Label>
                        <Input
                          id="edit-audience"
                          value={parsedData.audience}
                          onChange={(e) => setParsedData({...parsedData, audience: e.target.value})}
                          placeholder="e.g., Small business owners, Tech professionals, Entrepreneurs, Students"
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your ideal customer or target demographic
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="edit-tone" className="text-sm font-medium text-foreground">
                          Content Tone <span className="text-muted-foreground">*</span>
                        </Label>
                        <Select value={parsedData.tone} onValueChange={(value: any) => setParsedData({...parsedData, tone: value})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Choose how you want to sound" />
                          </SelectTrigger>
                          <SelectContent position="popper" side="bottom" sideOffset={4} className="z-[10000]">
                            <SelectItem value="professional">🎯 Professional - Formal and business-like</SelectItem>
                            <SelectItem value="playful">🎨 Playful - Fun and creative</SelectItem>
                            <SelectItem value="humorous">😄 Humorous - Funny and entertaining</SelectItem>
                            <SelectItem value="inspirational">✨ Inspirational - Motivational and uplifting</SelectItem>
                            <SelectItem value="bold">💪 Bold - Confident and assertive</SelectItem>
                            <SelectItem value="minimalist">⚡ Minimalist - Clean and simple</SelectItem>
                            <SelectItem value="quirky">🎭 Quirky - Unique and unconventional</SelectItem>
                            <SelectItem value="premium">💎 Premium - High-end and luxurious</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          How you want your content to sound and feel
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-goal" className="text-sm font-medium text-foreground">
                        Content Goal <span className="text-muted-foreground">*</span>
                      </Label>
                      <Select value={parsedData.goal} onValueChange={(value: any) => setParsedData({...parsedData, goal: value})}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="What do you want to achieve?" />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={4} className="z-[10000]">
                          <SelectItem value="engagement">💬 Engagement - Get likes, comments, shares</SelectItem>
                          <SelectItem value="sales">💰 Sales - Drive purchases and conversions</SelectItem>
                          <SelectItem value="signups">📝 Signups - Get email subscriptions</SelectItem>
                          <SelectItem value="awareness">📢 Awareness - Increase brand visibility</SelectItem>
                          <SelectItem value="shares">🔄 Shares - Make content go viral</SelectItem>
                          <SelectItem value="discovery">🔍 Discovery - Help people find your business</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        What you want to achieve with this content
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-description" className="text-sm font-medium text-foreground">
                        Business Description <span className="text-muted-foreground">*</span>
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={parsedData.businessDescription}
                        onChange={(e) => setParsedData({...parsedData, businessDescription: e.target.value})}
                        placeholder="Describe your business in detail: What do you do? What problems do you solve? What makes you unique? Who do you help? What are your key benefits? Be specific and compelling."
                        className="mt-2 min-h-[120px] resize-none"
                        rows={5}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Detailed description helps AI create more relevant and engaging content
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                    <Button onClick={handleGeneratePosts} className="flex-1 h-11">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Viral Posts
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowDataEdit(false);
                        setParsedData(null);
                        setSelectedPlatform("");
                      }}
                      className="h-11 px-6"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="max-w-2xl mx-auto space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  Welcome to Promotely
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  AI-powered viral social media content generator
                </p>
                <div className="bg-muted/50 p-4 rounded-lg border border-border text-left">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>💡 Pro Tip:</strong> Write detailed prompts for better results. For example:
                  </p>
                  <p className="text-xs bg-background p-3 rounded border font-mono">
                    "Create a professional LinkedIn post for my tech startup TechFlow about our new AI-powered workflow automation software, targeting small business owners who want to streamline operations"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    This helps the AI understand: Business (TechFlow), Product (AI workflow automation), Audience (small business owners), Tone (professional), Goal (engagement)
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Area at Bottom - Never Scrolls */}
        <div className="border-t border-border bg-card p-3 sm:p-4 md:p-6 flex-shrink-0">
          <div className="max-w-full sm:max-w-2xl md:max-w-4xl mx-auto">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe the viral post you want to create..."
                  className="min-h-[50px] sm:min-h-[60px] max-h-24 sm:max-h-32 resize-none pr-12 text-sm sm:text-base"
                  disabled={isGenerating || showPlatformSelection}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isGenerating || showPlatformSelection}
                  size="sm"
                  className="absolute right-2 bottom-2 w-7 h-7 sm:w-8 sm:h-8 p-0"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 sm:mt-3">
              <p className="text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <SparklesIcon className="w-3 h-3 text-primary" />
                <span className="hidden sm:inline">Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
