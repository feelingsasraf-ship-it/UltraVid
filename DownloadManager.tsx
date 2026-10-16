import React from 'react';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Clock,
  HardDrive,
  Activity,
  FileCheck,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DownloadJob } from '../types/index.js';

interface DownloadManagerProps {
  jobs: DownloadJob[];
  onCancelJob: (id: string) => void;
  onRetryJob: (id: string) => void;
  onClearCompleted: () => void;
}

export const DownloadManager: React.FC<DownloadManagerProps> = ({
  jobs,
  onCancelJob,
  onRetryJob,
  onClearCompleted,
}) => {
  const formatSpeed = (bytesPerSec: number): string => {
    if (!bytesPerSec || bytesPerSec <= 0) return '0 KB/s';
    if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
    return `${(bytesPerSec / (1024 * 1024)).toFixed(2)} MB/s`;
  };

  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 MB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleSaveFile = (job: DownloadJob) => {
    if (!job.fileToken) return;

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    // Trigger browser download via safe token endpoint
    const downloadUrl = `/api/files/${job.fileToken}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', job.downloadFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (jobs.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-12 text-center rounded-2xl bg-[#0f1523]/80 border border-white/5 backdrop-blur-xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4 border border-white/5">
          <Download className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-white">Download Queue is Empty</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Analyze any video link or select a quick test video from the home tab to start downloading with real-time speed and progress.
        </p>
      </div>
    );
  }

  const completedCount = jobs.filter((j) => j.status === 'completed').length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top action header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Active Download Queue</h2>
          <p className="text-xs text-slate-400">
            Real-time backend job workers with chunk streaming and temporary token expiration.
          </p>
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            Clear Finished ({completedCount})
          </button>
        )}
      </div>

      {/* Jobs list */}
      <div className="space-y-3">
        {jobs.map((job) => {
          const isDownloading = job.status === 'downloading' || job.status === 'queued';
          const isProcessing = job.status === 'processing';
          const isCompleted = job.status === 'completed';
          const isFailed = job.status === 'failed';
          const isCancelled = job.status === 'cancelled';

          return (
            <div
              key={job.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDownloading
                  ? 'bg-[#0f1523] border-blue-500/40 shadow-lg shadow-blue-500/5'
                  : isCompleted
                  ? 'bg-[#0f1523]/90 border-emerald-500/30'
                  : isFailed
                  ? 'bg-[#0f1523]/90 border-rose-500/30'
                  : 'bg-[#0f1523]/60 border-white/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Media details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-900 border border-white/5 shrink-0">
                    <img
                      src={job.thumbnailUrl}
                      alt={job.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate max-w-md">{job.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="font-semibold text-blue-400">{job.qualityLabel}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-300 uppercase">{job.extension}</span>
                      <span>·</span>
                      <span className="font-mono">{formatBytes(job.totalBytes)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isDownloading && (
                    <button
                      type="button"
                      onClick={() => onCancelJob(job.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors inline-flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {(isFailed || isCancelled) && (
                    <button
                      type="button"
                      onClick={() => onRetryJob(job.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleSaveFile(job)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Save File</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar & Telemetry */}
              <div className="mt-4">
                <div className="w-full h-2 rounded-full bg-slate-900 border border-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : isFailed || isCancelled
                        ? 'bg-rose-500'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600'
                    }`}
                    style={{ width: `${job.progressPercent}%` }}
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="font-bold text-white">{job.progressPercent}%</span>
                    <span>
                      {formatBytes(job.bytesDownloaded)} / {formatBytes(job.totalBytes)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    {isDownloading && (
                      <>
                        <span className="flex items-center gap-1 text-blue-400">
                          <Activity className="w-3 h-3" />
                          {formatSpeed(job.speedBytesPerSec)}
                        </span>
                        {job.etaSeconds > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ETA: {job.etaSeconds}s
                          </span>
                        )}
                      </>
                    )}

                    {isProcessing && (
                      <span className="text-amber-400 animate-pulse">
                        Finalizing audio/video muxing...
                      </span>
                    )}

                    {isCompleted && (
                      <span className="text-emerald-400 flex items-center gap-1 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready for download (15 min token)</span>
                      </span>
                    )}

                    {isFailed && (
                      <span className="text-rose-400 flex items-center gap-1 font-sans">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Failed: {job.error || 'Connection dropped'}</span>
                      </span>
                    )}

                    {isCancelled && (
                      <span className="text-slate-500 font-sans">
                        Cancelled by user
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
