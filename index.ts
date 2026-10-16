export type PlatformId =
  | 'youtube'
  | 'vimeo'
  | 'reddit'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'direct'
  | 'unknown';

export interface VideoFormat {
  id: string;
  qualityLabel: string;
  height?: number;
  width?: number;
  extension: 'mp4' | 'webm' | 'mp3' | 'm4a';
  fileSizeBytes?: number;
  fileSizeFormatted?: string;
  hasVideo: boolean;
  hasAudio: boolean;
  videoCodec?: string;
  audioCodec?: string;
  audioBitrateKbps?: number;
  fps?: number;
  isDirectStream: boolean;
  downloadUrl?: string;
}

export interface VideoMetadata {
  id: string;
  originalUrl: string;
  canonicalUrl: string;
  platform: PlatformId;
  platformName: string;
  title: string;
  author?: string;
  authorUrl?: string;
  thumbnailUrl: string;
  durationSeconds?: number;
  durationFormatted?: string;
  viewCount?: number;
  uploadDate?: string;
  maxQuality: string;
  formats: VideoFormat[];
  isDemoSample?: boolean;
  complianceNotice?: string;
  isRestricted?: boolean;
}

export type JobStatus =
  | 'queued'
  | 'downloading'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface DownloadJob {
  id: string;
  url: string;
  title: string;
  thumbnailUrl: string;
  platform: PlatformId;
  formatId: string;
  qualityLabel: string;
  extension: string;
  status: JobStatus;
  progressPercent: number;
  bytesDownloaded: number;
  totalBytes: number;
  speedBytesPerSec: number;
  etaSeconds: number;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  fileToken?: string;
  tokenExpiresAt?: number;
  error?: string;
  downloadFilename: string;
  simulatedStream?: boolean;
  directUrl?: string;
}

export interface PlatformInfo {
  id: PlatformId;
  name: string;
  color: string;
  supportedQualities: string[];
  maxResolution: string;
  audioExtraction: boolean;
  policyNotes: string;
  enabled: boolean;
  badge?: string;
}

export interface HistoryItem {
  id: string;
  jobId?: string;
  url: string;
  title: string;
  thumbnailUrl: string;
  platform: PlatformId;
  qualityLabel: string;
  extension: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  downloadedAt: number;
  status: 'completed' | 'failed' | 'cancelled';
  fileToken?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export type ActiveTab = 'downloader' | 'manager' | 'history' | 'platforms' | 'faq' | 'about';
