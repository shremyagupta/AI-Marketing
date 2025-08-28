"use client";

import { GeneratedPost } from "@/lib/viral-post-generator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Share2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";

interface PostPreviewProps {
  post: GeneratedPost;
  onCopy?: () => void;
}

export function PostPreview({ post, onCopy }: PostPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullPost = `${post.content}\n\n${post.hashtags.join(' ')}`;
    await navigator.clipboard.writeText(fullPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const getPlatformStyle = () => {
    switch (post.platform) {
      case 'instagram':
        return 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg glow';
      case 'twitter':
        return 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg glow';
      case 'linkedin':
        return 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg glow';
      case 'tiktok':
        return 'bg-gradient-to-r from-black via-gray-800 to-black text-white shadow-lg glow';
      case 'facebook':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg glow';
      default:
        return 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg glow';
    }
  };

  const getPlatformIcon = () => {
    switch (post.platform) {
      case 'instagram':
        return '📸';
      case 'twitter':
        return '🐦';
      case 'linkedin':
        return '💼';
      case 'tiktok':
        return '🎵';
      case 'facebook':
        return '👥';
      default:
        return '📱';
    }
  };

  const getPlatformLimits = () => {
    switch (post.platform) {
      case 'instagram':
        return { total: 2200, preview: 125, description: 'First 125 chars show before "more"' };
      case 'twitter':
        return { total: 280, preview: 280, description: 'Twitter character limit' };
      case 'linkedin':
        return { total: 3000, preview: 800, description: 'Medium-long content (800-1200 chars optimal)' };
      case 'tiktok':
        return { total: 2200, preview: 150, description: 'Optimal for engagement' };
      case 'facebook':
        return { total: 63206, preview: 40, description: 'Optimal for engagement' };
      default:
        return { total: 280, preview: 280, description: 'Standard limit' };
    }
  };

  const limits = getPlatformLimits();
  const contentLength = post.content.length;
  const isWithinPreviewLimit = contentLength <= limits.preview;
  const isWithinTotalLimit = contentLength <= limits.total;

  const getStatusIcon = () => {
    if (post.platform === 'linkedin') {
      return contentLength >= 800 ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : (
        <Info className="w-4 h-4 text-blue-400" />
      );
    }
    return isWithinPreviewLimit ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <AlertCircle className="w-4 h-4 text-yellow-400" />
    );
  };

  const getStatusText = () => {
    if (post.platform === 'linkedin') {
      return contentLength >= 800 ? '✓ Professional Length' : '📝 Expand for LinkedIn';
    }
    return isWithinPreviewLimit ? '✓ Viral Length' : '⚠ Long';
  };

  return (
    <Card className="w-full premium-card backdrop-blur-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Platform Header */}
      <CardHeader className={`${getPlatformStyle()} p-4 sm:p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">{getPlatformIcon()}</span>
            <span className="font-bold capitalize text-lg sm:text-xl">{post.platform}</span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon()}
              <span className="text-sm opacity-90 font-medium">{getStatusText()}</span>
            </div>
            <span className="text-sm opacity-80 font-mono">{contentLength}/{limits.total}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 space-y-5">
        {/* Post Content */}
        <div className="bg-gradient-to-br from-muted/30 to-muted/20 p-4 sm:p-5 rounded-xl border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-muted-foreground font-medium bg-card/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
              {limits.description} • {contentLength} characters
            </div>
          </div>
          <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-foreground font-medium">
            {post.content}
          </p>
          
          {/* Platform-specific warnings */}
          {!isWithinPreviewLimit && post.platform !== 'linkedin' && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-700 dark:text-yellow-300">
                  <strong>Content Length Warning:</strong> Content exceeds optimal length for {post.platform}. 
                  Consider shortening for better engagement.
                </div>
              </div>
            </div>
          )}
          
          {post.platform === 'linkedin' && contentLength < 600 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>LinkedIn Tip:</strong> Consider expanding to 800-1200 characters for better professional engagement and thought leadership positioning.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hashtags */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hashtags</span>
            <span className="text-xs text-muted-foreground/70">({post.hashtags.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gradient-to-r from-primary/20 to-primary/10 text-primary-foreground text-xs px-3 py-2 rounded-full font-medium border border-primary/30 hover:from-primary/30 hover:to-primary/20 transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        {/* Emojis Used */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-lg border border-pink-500/20">
          <span className="text-xs font-semibold text-pink-700 dark:text-pink-300 uppercase tracking-wide">Emojis Used</span>
          <div className="flex gap-2">
            {post.emojis.map((emoji, index) => (
              <span key={index} className="text-xl bg-card/50 p-2 rounded-lg shadow-sm border border-border/30 backdrop-blur-sm">
                {emoji}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Preview */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">Call to Action</p>
          </div>
          <p className="text-sm sm:text-base text-green-800 dark:text-green-200 font-medium">{post.cta}</p>
        </div>

        {/* Button Preview */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Suggested Button</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-card/50 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 h-11 font-medium backdrop-blur-sm"
          >
            {post.buttonText}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex-1 h-11 bg-gradient-to-r from-muted/30 to-muted/20 border-border/50 text-foreground hover:from-muted/40 hover:to-muted/30 hover:border-border/70 transition-all duration-200 backdrop-blur-sm"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Post'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-11 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 text-primary hover:from-primary/20 hover:to-primary/10 hover:border-primary/50 transition-all duration-200 backdrop-blur-sm"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
