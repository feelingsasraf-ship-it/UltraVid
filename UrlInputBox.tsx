import React, { useState } from 'react';
import { Search, Clipboard, X, Loader2, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PlatformId } from '../types/index.js';
import { TranslationDictionary } from '../locales/translations.js';

interface UrlInputBoxProps {
  url: string;
  setUrl: (val: string) => void;
  onAnalyze: (targetUrl?: string) => void;
  isLoading: boolean;
  error?: string | null;
  t?: TranslationDictionary;
}

export const UrlInputBox: React.FC<UrlInputBoxProps> = ({
  url,
  setUrl,
  onAnalyze,
  isLoading,
  error,
  t,
}) => {
  const [pasteError, setPasteError] = useState<string | null>(null);

  // Quick detected platform
  const detectPlatform = (text: string): { name: string; color: string; id: PlatformId } | null => {
    const lower = text.toLowerCase().trim();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      return { name: 'YouTube', color: 'text-red-400 bg-red-500/10 border-red-500/20', id: 'youtube' };
    }
    if (lower.includes('vimeo.com')) {
      return { name: 'Vimeo', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', id: 'vimeo' };
    }
    if (lower.includes('reddit.com') || lower.includes('redd.it')) {
      return { name: 'Reddit', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', id: 'reddit' };
    }
    if (lower.includes('tiktok.com')) {
      return { name: 'TikTok', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20', id: 'tiktok' };
    }
    if (lower.includes('twitter.com') || lower.includes('x.com')) {
      return { name: 'X (Twitter)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', id: 'twitter' };
    }
    if (lower.includes('instagram.com')) {
      return { name: 'Instagram', color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20', id: 'instagram' };
    }
    if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
      return { name: 'Facebook', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', id: 'facebook' };
    }
    if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mp3')) {
      return { name: 'Direct Stream', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', id: 'direct' };
    }
    return null;
  };

  const detected = detectPlatform(url);

  const handlePaste = async () => {
    setPasteError(null);
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          // Auto analyze if looks like a valid link
          if (text.startsWith('http://') || text.startsWith('https://')) {
            onAnalyze(text);
          }
        }
      } else {
        const inputElem = document.getElementById('video-url-input');
        inputElem?.focus();
      }
    } catch {
      setPasteError('Clipboard permission denied. Please paste manually into the box.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && url.trim() && !isLoading) {
      onAnalyze();
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
    onAnalyze(sampleUrl);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Container */}
      <div className="relative group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-purple-600/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-500 -z-10" />

        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#0f1523]/90 backdrop-blur-xl border border-white/10 shadow-2xl transition-all focus-within:border-blue-500/50">
          {/* Input field with icon */}
          <div className="relative flex-1 flex items-center min-w-0 px-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <input
              id="video-url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t?.inputPlaceholder || "Paste video link from YouTube, Vimeo, Reddit, TikTok, Direct MP4..."}
              disabled={isLoading}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:ring-0 py-2.5"
              autoComplete="off"
              spellCheck={false}
            />

            {/* Clear Button */}
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
                aria-label="Clear link input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 px-1 pb-1 sm:p-0">
            {/* Paste Button */}
            <button
              type="button"
              onClick={handlePaste}
              disabled={isLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl border border-white/5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>{t?.paste || 'Paste'}</span>
            </button>

            {/* Analyze Video Button */}
            <button
              type="button"
              onClick={() => onAnalyze()}
              disabled={!url.trim() || isLoading}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-lg transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                !url.trim() || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t?.analyzing || 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t?.analyze || 'Analyze Video'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Detected Platform Bar & Security Notice */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs">
        <div className="flex items-center gap-2">
          {detected ? (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${detected.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Detected: {detected.name}</span>
            </div>
          ) : (
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t?.ssrfProtected || 'SSRF Protected & Secure Token Delivery'}</span>
            </span>
          )}
        </div>

        {/* Quick sample chips */}
        <div className="flex items-center gap-1.5 text-slate-400 overflow-x-auto max-w-full py-1">
          <span className="text-slate-400 shrink-0 font-medium text-[11px]">{t?.quickTests || 'Quick Tests:'}</span>
          <button
            type="button"
            onClick={() => handleSampleClick('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
            className="px-2 py-0.5 rounded text-[11px] bg-slate-800/80 hover:bg-blue-600/20 hover:text-blue-300 text-slate-300 border border-white/5 transition-colors whitespace-nowrap"
          >
            Big Buck Bunny 4K
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4')}
            className="px-2 py-0.5 rounded text-[11px] bg-slate-800/80 hover:bg-blue-600/20 hover:text-blue-300 text-slate-300 border border-white/5 transition-colors whitespace-nowrap"
          >
            Tears of Steel 1080p
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick('https://www.youtube.com/watch?v=aqz-KE-bpKQ')}
            className="px-2 py-0.5 rounded text-[11px] bg-slate-800/80 hover:bg-blue-600/20 hover:text-blue-300 text-slate-300 border border-white/5 transition-colors whitespace-nowrap"
          >
            YouTube CC Sample
          </button>
        </div>
      </div>

      {/* Error or Warning Banner */}
      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-rose-200">Unable to analyze URL: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {pasteError && (
        <div className="mt-2 text-xs text-amber-400 flex items-center gap-1.5 px-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{pasteError}</span>
        </div>
      )}
    </div>
  );
};
