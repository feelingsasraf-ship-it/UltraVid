import express, { Request, Response } from 'express';
import fs from 'node:fs';
import { validateSafeUrl, createRateLimiter, SecurityError } from './security.js';
import { analyzeMediaUrl, PLATFORMS_INFO } from './providers/index.js';
import {
  createDownloadJob,
  getJob,
  cancelJob,
  retryJob,
  getJobByToken,
  getFilePathForJob,
  getAllJobs,
} from './jobs.js';
import { VERIFIED_SAMPLES } from './providers/sampleCatalog.js';

export const apiRouter = express.Router();

// Apply rate limiting to analyze and download creation: 60 reqs / minute
const analyzeRateLimiter = createRateLimiter({ maxRequests: 60, windowMs: 60 * 1000 });
const downloadRateLimiter = createRateLimiter({ maxRequests: 60, windowMs: 60 * 1000 });

/**
 * Health check endpoint
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'UltraVid Media Engine',
    uptimeSeconds: Math.round(process.uptime()),
    activeJobsCount: getAllJobs().filter((j) => j.status === 'downloading').length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Supported platforms directory
 */
apiRouter.get('/platforms', (_req: Request, res: Response) => {
  res.json({
    platforms: PLATFORMS_INFO,
  });
});

/**
 * Verified samples for quick test
 */
apiRouter.get('/samples', (_req: Request, res: Response) => {
  const sampleList = VERIFIED_SAMPLES.map((s) => ({
    key: s.key,
    title: s.metadata.title,
    platform: s.metadata.platformName,
    maxQuality: s.metadata.maxQuality,
    duration: s.metadata.durationFormatted,
    thumbnail: s.metadata.thumbnailUrl,
    url: s.metadata.originalUrl,
  }));
  res.json({ samples: sampleList });
});

/**
 * POST /api/analyze
 */
apiRouter.post('/analyze', analyzeRateLimiter, async (req: Request, res: Response): Promise<void> => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Validation Error', message: 'Please provide a valid video URL.' });
    return;
  }

  try {
    const safeUrl = await validateSafeUrl(url);
    const metadata = await analyzeMediaUrl(safeUrl, url.trim());
    res.json({
      success: true,
      metadata,
    });
  } catch (err: any) {
    if (err instanceof SecurityError) {
      res.status(err.statusCode).json({
        error: 'Security Notice',
        message: err.message,
      });
      return;
    }
    res.status(422).json({
      error: 'Analysis Failed',
      message: err.message || 'Unable to extract video information from this source.',
    });
  }
});

/**
 * POST /api/downloads
 */
apiRouter.post('/downloads', downloadRateLimiter, (req: Request, res: Response): void => {
  const { metadata, formatId } = req.body;

  if (!metadata || !formatId) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Both metadata and formatId are required to start a download.',
    });
    return;
  }

  if (metadata.isRestricted) {
    res.status(403).json({
      error: 'Platform Restricted',
      message: metadata.complianceNotice || 'This platform restricts direct downloading via API.',
    });
    return;
  }

  const selectedFormat = metadata.formats?.find((f: any) => f.id === formatId);
  if (!selectedFormat) {
    res.status(404).json({
      error: 'Format Not Found',
      message: 'The requested quality or format is not available for this video.',
    });
    return;
  }

  const job = createDownloadJob(metadata, selectedFormat);
  res.status(201).json({
    success: true,
    job,
  });
});

/**
 * GET /api/downloads/:id
 */
apiRouter.get('/downloads/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const job = getJob(id);

  if (!job) {
    res.status(404).json({
      error: 'Job Not Found',
      message: `No active or recent download job found with ID: ${id}`,
    });
    return;
  }

  res.json({
    success: true,
    job,
  });
});

/**
 * POST /api/downloads/:id/cancel
 */
apiRouter.post('/downloads/:id/cancel', (req: Request, res: Response): void => {
  const { id } = req.params;
  const success = cancelJob(id);

  if (!success) {
    res.status(400).json({
      error: 'Cannot Cancel',
      message: 'Job is not actively downloading or was already finalized.',
    });
    return;
  }

  res.json({
    success: true,
    message: 'Download job cancelled successfully.',
  });
});

/**
 * POST /api/downloads/:id/retry
 */
apiRouter.post('/downloads/:id/retry', (req: Request, res: Response): void => {
  const { id } = req.params;
  const job = retryJob(id);

  if (!job) {
    res.status(404).json({
      error: 'Job Not Found',
      message: 'Download job not found or cannot be retried.',
    });
    return;
  }

  res.json({
    success: true,
    job,
  });
});

/**
 * GET /api/files/:token
 * Serves completed download securely with expiration check and Content-Disposition
 */
apiRouter.get('/files/:token', (req: Request, res: Response): void => {
  const { token } = req.params;
  const job = getJobByToken(token);

  if (!job) {
    res.status(410).json({
      error: 'Token Expired or Invalid',
      message: 'This download link has expired (15-minute validity) or is invalid. Please restart the download.',
    });
    return;
  }

  const filePath = getFilePathForJob(job);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({
      error: 'File Removed',
      message: 'Temporary storage has purged this file.',
    });
    return;
  }

  const stats = fs.statSync(filePath);
  const mimeType = job.extension === 'mp3' ? 'audio/mpeg' : 'video/mp4';

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', stats.size);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(job.downloadFilename)}"`);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});
