import React, { useState } from 'react';
import { Download, Music, Video, Film, Check, ExternalLink, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { VideoMetadata, VideoFormat } from '../types/index.js';

interface VideoResultCardProps {
  metadata: VideoMetadata;
  onStartDownload: (format: VideoFormat) => void;
  isStartingDownload: boolean;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({
  metadata,
  onStartDownload,
  isStartingDownload,
}) => {
  // Separate video formats vs audio-only formats
  const videoFormats = metadata.formats.filter((f: VideoFormat) => f.hasVideo);
  const audioFormats = metadata.formats.filter((f: VideoFormat) => !f.hasVideo);

  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [selectedFormatId, setSelectedFormatId] = useState<string>(
    videoFormats[0]?.id || audioFormats[0]?.id || ''
  );

  const currentFormats = activeTab === 'video' ? videoFormats : audioFormats;
  const selectedFormat = metadata.formats.find((f: VideoFormat) => f.id === selectedFormatId) || currentFormats[0];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-[#0f1523]/95 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in-50 duration-300">
      {/* Header bar */}
      <div className="px-6 py-3.5 border-b border-white/5 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide">{metadata.platformName}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Max Quality: <strong className="text-blue-400 font-semibold">{metadata.maxQuality}</strong></span>
        </div>

        {metadata.isDemoSample && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-[11px]">
            <Sparkles className="w-3 h-3" />
            <span>Verified 4K/HD Open Stream</span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 lg:p-7 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Media Thumbnail & Info */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/5 group shadow-inner">
            <img
              src={metadata.thumbnailUrl}
              alt={metadata.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback graphic
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
              }}
            />
            {metadata.durationFormatted && (
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 text-white text-[11px] font-mono tracking-wider backdrop-blur-sm">
                {metadata.durationFormatted}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug">
              {metadata.title}
            </h3>
            {metadata.author && (
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <span>By {metadata.author}</span>
                {metadata.authorUrl && (
                  <a
                    href={metadata.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Compliance & Fair-Use Notice */}
          <div className="mt-1 p-3 rounded-xl bg-blue-950/20 border border-blue-500/15 text-slate-300 text-xs">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-slate-300">
                {metadata.complianceNotice ||
                  'UltraVid processes media via authorized oEmbed metadata and public endpoints with fair-use and DRM compliance.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Format & Quality Selector */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            {/* Format category tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-xl border border-white/5 mb-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('video');
                  if (videoFormats[0]) setSelectedFormatId(videoFormats[0].id);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'video'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video + Audio ({videoFormats.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('audio');
                  if (audioFormats[0]) setSelectedFormatId(audioFormats[0].id);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'audio'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Audio Only ({audioFormats.length})</span>
              </button>
            </div>

            {/* Quality option cards */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {currentFormats.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs rounded-xl border border-white/5 bg-slate-900/30">
                  No {activeTab} streams available for this source.
                </div>
              ) : (
                currentFormats.map((format: VideoFormat) => {
                  const isSelected = selectedFormat?.id === format.id;
                  return (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() => setSelectedFormatId(format.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'border-slate-600 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white tracking-wide">
                              {format.qualityLabel}
                            </span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                              {format.extension}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            {format.videoCodec && <span>{format.videoCodec}</span>}
                            {format.fps && <span>· {format.fps} fps</span>}
                            {format.audioBitrateKbps && <span>· {format.audioBitrateKbps} kbps</span>}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-200">
                          {format.fileSizeFormatted || '~Unknown'}
                        </span>
                        <div className="text-[10px] text-slate-500">estimated</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Download CTA Bar */}
          <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Selected: <span className="font-semibold text-white">{selectedFormat?.qualityLabel || 'None'}</span> ({selectedFormat?.extension.toUpperCase()})
            </div>

            <button
              type="button"
              onClick={() => selectedFormat && onStartDownload(selectedFormat)}
              disabled={!selectedFormat || isStartingDownload || metadata.isRestricted}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-xl ${
                !selectedFormat || isStartingDownload || metadata.isRestricted
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{isStartingDownload ? 'Preparing Stream...' : 'Start Download'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
