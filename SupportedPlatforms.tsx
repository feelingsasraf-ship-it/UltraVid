import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Video,
  Music,
  Lock,
  Layers,
} from 'lucide-react';
import { PlatformInfo } from '../types/index.js';

interface SupportedPlatformsProps {
  onSelectSample: (url: string) => void;
}

export const SUPPORTED_PLATFORMS: PlatformInfo[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    supportedQualities: ['1080p', '720p', '480p', '360p', 'Audio MP3', 'Audio M4A'],
    maxResolution: '1080p (Full HD)',
    audioExtraction: true,
    policyNotes: 'oEmbed API verified. Respects copyright, Creative Commons, and fair-use guidelines.',
    enabled: true,
    badge: 'Popular',
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    color: '#1AB7EA',
    supportedQualities: ['1080p', '720p', 'Audio MP3'],
    maxResolution: '1080p (Full HD)',
    audioExtraction: true,
    policyNotes: 'Official Vimeo oEmbed. High bitrate professional video streams.',
    enabled: true,
    badge: 'High Bitrate',
  },
  {
    id: 'direct',
    name: 'Direct MP4 / WebM',
    color: '#3B82F6',
    supportedQualities: ['4K (2160p)', '1440p', '1080p', '720p', 'Source Audio'],
    maxResolution: '4K (2160p)',
    audioExtraction: true,
    policyNotes: 'Direct HTTP/HTTPS stream download with range requests and SSRF security shield.',
    enabled: true,
    badge: 'Fastest',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    color: '#FF4500',
    supportedQualities: ['720p', '480p', 'Audio MP3'],
    maxResolution: '720p (HD)',
    audioExtraction: true,
    policyNotes: 'Public posts parsed with video-audio stream multiplexing into clean MP4.',
    enabled: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#EE1D52',
    supportedQualities: ['720p', '480p', 'Audio MP3'],
    maxResolution: '720p (HD)',
    audioExtraction: true,
    policyNotes: 'Official oEmbed metadata. Preserves creator attribution and original watermarks.',
    enabled: true,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    color: '#1DA1F2',
    supportedQualities: ['720p', '480p', 'Audio MP3'],
    maxResolution: '720p (HD)',
    audioExtraction: true,
    policyNotes: 'X Publish API. Complies with developer terms and rate limits.',
    enabled: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    supportedQualities: ['Requires API Access Token'],
    maxResolution: 'Meta API Restricted',
    audioExtraction: false,
    policyNotes: 'Meta Policy Notice: Direct downloading of private feeds requires Meta Graph API User OAuth tokens. Use official Save.',
    enabled: false,
    badge: 'Auth Required',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    supportedQualities: ['Requires Graph Token'],
    maxResolution: 'Meta API Restricted',
    audioExtraction: false,
    policyNotes: 'Meta Policy Notice: Direct downloading requires Meta Page Access Token for authorized enterprise downloads.',
    enabled: false,
    badge: 'Auth Required',
  },
];

export const SupportedPlatforms: React.FC<SupportedPlatformsProps> = ({ onSelectSample }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Supported Platforms & Compliance
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          UltraVid follows an explicit Provider Adapter Architecture. We strictly interface with official APIs, public oEmbed schemas, and authorized open streams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORTED_PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              platform.enabled
                ? 'bg-[#0f1523]/90 border-white/10 hover:border-blue-500/30'
                : 'bg-[#0f1523]/40 border-white/5 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <h3 className="text-base font-bold text-white">{platform.name}</h3>
                </div>

                {platform.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      platform.enabled
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {platform.badge}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Max Resolution:</span>
                  <span className="font-semibold text-white">{platform.maxResolution}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Audio Extraction:</span>
                  <span className="text-slate-300">
                    {platform.audioExtraction ? 'Supported (MP3)' : 'Not Available'}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 leading-relaxed">
                  {platform.policyNotes}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              {platform.enabled ? (
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Adapter
                </span>
              ) : (
                <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Restricted by Terms
                </span>
              )}

              {platform.id === 'direct' && (
                <button
                  type="button"
                  onClick={() =>
                    onSelectSample(
                      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                    )
                  }
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                >
                  Test Sample →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
