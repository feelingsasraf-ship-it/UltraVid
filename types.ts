import { PlatformId, VideoMetadata } from '../types.js';

export interface VideoProvider {
  id: PlatformId;
  name: string;
  canHandle(url: URL): boolean;
  analyze(url: URL, originalUrl: string): Promise<VideoMetadata>;
}
