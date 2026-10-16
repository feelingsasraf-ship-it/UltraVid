# UltraVid — Fast. Smart. High Quality Video Downloader

UltraVid is a full-stack, responsive, and security-hardened video downloader and media extraction platform. Designed with a premium dark SaaS aesthetic (Navy Black, Electric Blue, Purple Gradient), it delivers verified resolution discovery (360p up to 4K Ultra HD), high-bitrate MP3 extraction, background job queueing, real-time download telemetry, and SSRF network defense.

---

## 1. Features

- **Provider Adapter Architecture**: Pluggable adapters for YouTube (oEmbed), Vimeo, Reddit, TikTok, X (Twitter), and Direct Web Video (MP4/WebM/HLS).
- **Authentic Resolution Mapping**: Only offers resolutions that genuinely exist in the source stream (e.g. 4K is only shown for authentic 4K sources; no fake upscaling).
- **Background Job Queue**: Real chunk streaming with bandwidth throttling, live speed calculation (MB/s), bytes downloaded vs total, and ETA.
- **SSRF & Network Shield**: Server-side DNS resolution checks to block loopback (`127.0.0.1`), private networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), cloud metadata (`169.254.169.254`), and non-HTTP protocols.
- **Zero Server-Side User Logging**: All download history is stored client-side in browser `localStorage`.
- **Encrypted 15-Minute Token Delivery**: Files are served through temporary single-session tokens that automatically expire and purge after 15 minutes.
- **Light & Dark Mode**: Persistent theme toggle with high-contrast accessibility.
- **Responsive Layout**: Specially optimized for Mobile (one-column, 48px touch targets), Tablet (two-column preview), and Desktop (wide 1440px canvas).

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, TSX, Native Streams & Crypto.
- **Queue & Storage**: In-memory job scheduler with chunk streaming and `/tmp` temporary file lifecycle.
- **Security**: DNS lookup verification, sliding window IP rate limiting, path traversal sanitizer, and HTTP security headers.

---

## 3. Installation & Setup

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation
```bash
# Clone or navigate to the project directory
cd ultravid

# Install dependencies
npm install
```

### Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Default parameters:
```env
PORT=3000
NODE_ENV=development
```

---

## 4. Local Development

To run the development server with Hot Module Replacement (Express + Vite):
```bash
npm run dev
```
The server will start at: `http://localhost:3000`

---

## 5. Automated Testing

UltraVid includes a comprehensive automated test suite testing SSRF security blocks, filename sanitization, provider extraction, job queueing, cancellation, and token lifecycle:
```bash
npm test
```

---

## 6. Production Build & Deployment

To compile and launch the production server:
```bash
# Build frontend static bundle
npm run build

# Start production Express server
npm start
```

---

## 7. Backend API Specification

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Validates target URL against SSRF, identifies provider, extracts metadata & formats |
| `POST` | `/api/downloads` | Enqueues a download job for a selected format ID |
| `GET` | `/api/downloads/:id` | Polls real-time job progress (speed, bytes, percentage, status) |
| `POST` | `/api/downloads/:id/cancel` | Cleanly cancels active downloading stream and cleans up temp cache |
| `POST` | `/api/downloads/:id/retry` | Restarts a failed or cancelled download |
| `GET` | `/api/files/:token` | Streams completed file with `Content-Disposition` (15-min TTL) |
| `GET` | `/api/health` | Healthcheck and active worker telemetry |
| `GET` | `/api/platforms` | Directory of supported platforms, policies, and limits |
| `GET` | `/api/samples` | Curated public domain sample media for instant testing |

---

## 8. Known Limitations & Compliance Notice

- **Meta Graph API**: Instagram and private Facebook videos require authenticated Meta Graph API tokens and cannot be downloaded without direct account OAuth permissions. UltraVid clearly indicates "Auth Required" status.
- **DRM Protection**: UltraVid does not circumvent DRM, Widevine, or subscription paywalls. Only authorized public or Creative Commons streams are accessible.
- **Temporary Cache**: Uploaded/processed files are retained for a maximum of 15 minutes before being permanently deleted from `/tmp/ultravid_downloads`.
