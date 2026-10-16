/**
 * Automated Verification & API Test Suite for UltraVid
 */
import { validateSafeUrl, sanitizeFilename, SecurityError } from '../server/security.js';
import { DirectVideoProvider } from '../server/providers/directVideo.js';
import { YouTubeProvider } from '../server/providers/youtube.js';
import { createSocialProviders } from '../server/providers/socialGeneric.js';
import { createDownloadJob, getJob, cancelJob, retryJob, getJobByToken } from '../server/jobs.js';
import { VERIFIED_SAMPLES } from '../server/providers/sampleCatalog.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('🚀 Running UltraVid Comprehensive Test Suite...\n');

  // Test 1: SSRF Protection on Loopback
  try {
    await validateSafeUrl('http://127.0.0.1:8080/secret');
    assert(false, 'SSRF Block: 127.0.0.1 should be rejected');
  } catch (err: any) {
    assert(err instanceof SecurityError, 'SSRF Block: 127.0.0.1 correctly rejected with SecurityError');
  }

  // Test 2: SSRF Protection on Cloud Metadata
  try {
    await validateSafeUrl('http://169.254.169.254/latest/meta-data');
    assert(false, 'SSRF Block: AWS/GCP metadata IP should be rejected');
  } catch (err: any) {
    assert(err instanceof SecurityError, 'SSRF Block: 169.254.169.254 correctly rejected');
  }

  // Test 3: SSRF Protection on Invalid Protocol
  try {
    await validateSafeUrl('ftp://example.com/video.mp4');
    assert(false, 'SSRF Block: FTP protocol should be rejected');
  } catch (err: any) {
    assert(err instanceof SecurityError, 'SSRF Block: Non-HTTP/HTTPS protocol rejected');
  }

  // Test 4: Filename Sanitizer (Path Traversal Prevention)
  const unsafeName = '../../etc/passwd..//dangerous:file*name?.mp4';
  const cleanName = sanitizeFilename(unsafeName);
  assert(!cleanName.includes('..') && !cleanName.includes('/'), 'Filename Sanitizer prevents traversal and illegal characters');

  // Test 5: Sample Catalog Matching
  const sample = VERIFIED_SAMPLES[0];
  assert(sample.metadata.formats.length >= 4, 'Sample catalog contains multi-resolution formats');
  assert(sample.metadata.maxQuality === '4K (2160p)', 'Sample catalog accurately reflects 4K source quality');

  // Test 6: YouTube Provider Video ID Extraction
  const yt = new YouTubeProvider();
  const testUrl = new URL('https://www.youtube.com/watch?v=aqz-KE-bpKQ');
  assert(yt.canHandle(testUrl), 'YouTubeProvider handles youtube.com');
  const videoId = yt.extractVideoId(testUrl);
  assert(videoId === 'aqz-KE-bpKQ', 'YouTube video ID extracted accurately');

  // Test 7: Direct Video Provider
  const direct = new DirectVideoProvider();
  const sampleUrl = new URL(sample.metadata.originalUrl);
  assert(direct.canHandle(sampleUrl), 'DirectVideoProvider identifies MP4 video stream');

  // Test 8: Social Providers Compliance & Restrictions
  const socials = createSocialProviders();
  const ig = socials.find((s) => s.id === 'instagram');
  assert(!!ig, 'Instagram provider registered in architecture');
  if (ig) {
    const igMeta = await ig.analyze(new URL('https://instagram.com/p/test'), 'https://instagram.com/p/test');
    assert(igMeta.isRestricted === true, 'Instagram accurately reports restricted API compliance status');
  }

  // Test 9: Download Job Lifecycle (Queue -> Progress -> Cancel)
  const job = createDownloadJob(sample.metadata, sample.metadata.formats[0]);
  assert(job.status === 'downloading' || job.status === 'queued', 'Download job created and enqueued');
  assert(job.totalBytes > 0, 'Download job assigns file size');

  const retrieved = getJob(job.id);
  assert(retrieved?.id === job.id, 'Job retrieved by ID from queue manager');

  // Test 10: Download Job Cancellation
  const cancelSuccess = cancelJob(job.id);
  assert(cancelSuccess, 'Job cancelled successfully on user demand');
  const cancelledJob = getJob(job.id);
  assert(cancelledJob?.status === 'cancelled', 'Job state transitioned to cancelled');

  // Test 11: Download Job Retry
  const retriedJob = retryJob(job.id);
  assert(retriedJob?.status === 'downloading' || retriedJob?.status === 'queued', 'Job retried and restarted');

  // Test 12: Invalid Token Handling
  const invalidJob = getJobByToken('non-existent-token-12345');
  assert(invalidJob === undefined, 'Non-existent or expired file token returns undefined');

  console.log(`\n🏁 Test Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
