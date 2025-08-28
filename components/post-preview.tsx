"use client";

import { GeneratedPost } from "@/lib/viral-post-generator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Share2, CheckCircle, AlertCircle, Info, Sparkles } from "lucide-react";
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
        return 'bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 text-white shadow-lg';
      case 'twitter':
        return 'bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-lg';
      case 'linkedin':
        return 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg';
      case 'tiktok':
        return 'bg-gradient-to-r from-black via-gray-800 to-black text-white shadow-lg';
      case 'facebook':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg';
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
    <Card className="w-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Platform Header */}
      <CardHeader className={`${getPlatformStyle()} p-3 sm:p-4 relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg md:text-xl">{getPlatformIcon()}</span>
              <span className="font-bold capitalize text-xs sm:text-sm md:text-base">{post.platform}</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                {getStatusIcon()}
                <span className="text-xs opacity-90 font-medium hidden sm:inline">{getStatusText()}</span>
              </div>
              <span className="text-xs opacity-80 font-mono">{contentLength}/{limits.total}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Post Content */}
        <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-muted-foreground font-medium bg-background px-2 py-1 rounded-full border border-border">
              <span className="hidden sm:inline">{limits.description} • </span>{contentLength} characters
            </div>
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground font-medium">
            {post.content}
          </p>
          
          {/* Platform-specific warnings */}
          {!isWithinPreviewLimit && post.platform !== 'linkedin' && (
            <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-700">
                  <strong className="hidden sm:inline">Content Length Warning:</strong> 
                  <span className="sm:hidden">Warning: </span>
                  Content exceeds optimal length for {post.platform}. 
                  <span className="hidden sm:inline"> Consider shortening for better engagement.</span>
                </div>
              </div>
            </div>
          )}
          
          {post.platform === 'linkedin' && contentLength < 600 && (
            <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  <strong className="hidden sm:inline">LinkedIn Tip:</strong> 
                  <span className="sm:hidden">Tip: </span>
                  Consider expanding to 800-1200 characters for better professional engagement.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hashtags */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hashtags</span>
            <span className="text-xs text-muted-foreground">({post.hashtags.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-primary/20"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA Preview */}
        <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Call to Action</p>
          </div>
          <p className="text-sm text-green-800 font-medium">{post.cta}</p>
        </div>

        {/* Button Preview */}
        <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Suggested Button</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-8 sm:h-9 font-medium text-xs"
          >
            {post.buttonText}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Post'}</span>
            <span className="sm:hidden">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
          >
            <Share2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
