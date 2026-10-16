import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar.js';
import { UrlInputBox } from './components/UrlInputBox.js';
import { VideoResultCard } from './components/VideoResultCard.js';
import { DownloadManager } from './components/DownloadManager.js';
import { DownloadHistory } from './components/DownloadHistory.js';
import { SupportedPlatforms } from './components/SupportedPlatforms.js';
import { HowItWorks } from './components/HowItWorks.js';
import { Features } from './components/Features.js';
import { FaqAccordion } from './components/FaqAccordion.js';
import { Footer } from './components/Footer.js';
import { LegalModal, LegalModalType } from './components/LegalModals.js';
import { ToastContainer } from './components/Toast.js';
import {
  ActiveTab,
  DownloadJob,
  HistoryItem,
  ToastMessage,
  VideoFormat,
  VideoMetadata,
} from './types/index.js';
import { Language, translations } from './locales/translations.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('downloader');
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ultravid_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ultravid_lang', lang);
  };

  const t = translations[language];

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ultravid_theme');
    return saved ? saved === 'dark' : true;
  });

  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);

  // Active background downloads & history
  const [activeJobs, setActiveJobs] = useState<DownloadJob[]>([]);
  const [isStartingDownload, setIsStartingDownload] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('ultravid_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Toasts & Modals
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  // Sync theme to root class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('ultravid_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('ultravid_theme', 'light');
    }
  }, [darkMode]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('ultravid_history', JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save history to localStorage:', err);
    }
  }, [history]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Analyze video URL
  const handleAnalyze = async (targetUrl?: string) => {
    const inputUrl = targetUrl || url;
    if (!inputUrl.trim()) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setVideoMetadata(null);

    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.message || data.error || 'Failed to analyze video URL.');
      }

      setVideoMetadata(data.metadata);
      addToast({
        type: 'success',
        title: 'Video Analyzed',
        message: `Found ${data.metadata.formats.length} formats for "${data.metadata.title.slice(0, 35)}..."`,
      });
    } catch (err: any) {
      setAnalysisError(err.message || 'Network error occurred while analyzing URL.');
      addToast({
        type: 'error',
        title: 'Analysis Failed',
        message: err.message || 'Could not process this video URL.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Start download for selected format
  const handleStartDownload = async (format: VideoFormat) => {
    if (!videoMetadata) return;

    setIsStartingDownload(true);

    try {
      const resp = await fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: videoMetadata,
          formatId: format.id,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.message || data.error || 'Could not create download job.');
      }

      const newJob: DownloadJob = data.job;
      setActiveJobs((prev) => [newJob, ...prev]);

      addToast({
        type: 'info',
        title: 'Download Queued',
        message: `Processing ${format.qualityLabel} (${format.extension.toUpperCase()})...`,
      });

      // Switch to Queue tab so user sees real-time progress
      setActiveTab('manager');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Download Failed to Start',
        message: err.message,
      });
    } finally {
      setIsStartingDownload(false);
    }
  };

  // Poll active jobs from backend
  const activeJobsRef = useRef(activeJobs);
  activeJobsRef.current = activeJobs;

  useEffect(() => {
    const activeRunning = activeJobs.filter(
      (j) => j.status === 'downloading' || j.status === 'queued' || j.status === 'processing'
    );
    if (activeRunning.length === 0) return;

    const interval = setInterval(async () => {
      for (const runningJob of activeRunning) {
        try {
          const resp = await fetch(`/api/downloads/${runningJob.id}`);
          if (resp.ok) {
            const data = await resp.json();
            const updatedJob: DownloadJob = data.job;

            setActiveJobs((prev) =>
              prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
            );

            // If job transitioned to completed or failed, add to history
            if (updatedJob.status === 'completed' && runningJob.status !== 'completed') {
              const historyItem: HistoryItem = {
                id: Math.random().toString(36).substring(2, 9),
                jobId: updatedJob.id,
                url: updatedJob.url,
                title: updatedJob.title,
                thumbnailUrl: updatedJob.thumbnailUrl,
                platform: updatedJob.platform,
                qualityLabel: updatedJob.qualityLabel,
                extension: updatedJob.extension,
                fileSizeBytes: updatedJob.totalBytes,
                fileSizeFormatted: `${(updatedJob.totalBytes / (1024 * 1024)).toFixed(1)} MB`,
                downloadedAt: Date.now(),
                status: 'completed',
                fileToken: updatedJob.fileToken,
              };

              setHistory((h) => [historyItem, ...h.filter((x) => x.jobId !== updatedJob.id)]);

              addToast({
                type: 'success',
                title: 'Download Ready!',
                message: `"${updatedJob.title.slice(0, 30)}..." is ready for save.`,
              });
            } else if (updatedJob.status === 'failed' && runningJob.status !== 'failed') {
              addToast({
                type: 'error',
                title: 'Download Stream Failed',
                message: updatedJob.error || 'Connection dropped by remote server.',
              });
            }
          }
        } catch {
          // Ignore transient poll glitches
        }
      }
    }, 800);

    return () => clearInterval(interval);
  }, [activeJobs, addToast]);

  // Cancel job
  const handleCancelJob = async (id: string) => {
    try {
      const resp = await fetch(`/api/downloads/${id}/cancel`, { method: 'POST' });
      if (resp.ok) {
        setActiveJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: 'cancelled' } : j))
        );
        addToast({
          type: 'info',
          title: 'Job Cancelled',
          message: 'The download stream was cleanly terminated.',
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Cancellation Failed' });
    }
  };

  // Retry job
  const handleRetryJob = async (id: string) => {
    try {
      const resp = await fetch(`/api/downloads/${id}/retry`, { method: 'POST' });
      const data = await resp.json();
      if (resp.ok && data.job) {
        setActiveJobs((prev) =>
          prev.map((j) => (j.id === id ? data.job : j))
        );
        addToast({
          type: 'info',
          title: 'Restarting Stream',
          message: 'Download job re-queued for transmission.',
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Retry Failed' });
    }
  };

  const handleClearCompletedJobs = () => {
    setActiveJobs((prev) => prev.filter((j) => j.status === 'downloading' || j.status === 'queued'));
    addToast({ type: 'info', title: 'Queue Cleaned', message: 'Finished jobs cleared from active list.' });
  };

  // History Actions
  const handleRemoveHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    addToast({ type: 'info', title: 'History Entry Removed' });
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    addToast({ type: 'info', title: 'History Cleared', message: 'All local download logs have been removed.' });
  };

  const handleRedownloadHistoryItem = (item: HistoryItem) => {
    setUrl(item.url);
    setActiveTab('downloader');
    handleAnalyze(item.url);
  };

  const handleQuickPaste = () => {
    setActiveTab('downloader');
    setTimeout(() => {
      const input = document.getElementById('video-url-input') as HTMLInputElement | null;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  };

  const activeDownloadingCount = activeJobs.filter(
    (j) => j.status === 'downloading' || j.status === 'queued'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 selection:bg-blue-600/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeJobsCount={activeDownloadingCount}
        historyCount={history.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        t={t}
        onQuickPasteClick={handleQuickPaste}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab 1: Downloader & Analyzer */}
        {activeTab === 'downloader' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto pt-4 sm:pt-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>{t.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t.heroTitle1}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  {t.heroTitleHighlight}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {t.heroSubtitle}
              </p>

              {/* URL Input Box */}
              <div className="pt-4">
                <UrlInputBox
                  url={url}
                  setUrl={setUrl}
                  onAnalyze={handleAnalyze}
                  isLoading={isAnalyzing}
                  error={analysisError}
                  t={t}
                />
              </div>
            </div>

            {/* Video Analysis Result Card */}
            {videoMetadata && (
              <div className="pt-2">
                <VideoResultCard
                  metadata={videoMetadata}
                  onStartDownload={handleStartDownload}
                  isStartingDownload={isStartingDownload}
                />
              </div>
            )}

            {/* How It Works & Key Features */}
            <HowItWorks />
            <Features />
            <FaqAccordion />
          </div>
        )}

        {/* Tab 2: Active Download Queue Manager */}
        {activeTab === 'manager' && (
          <div className="pt-4">
            <DownloadManager
              jobs={activeJobs}
              onCancelJob={handleCancelJob}
              onRetryJob={handleRetryJob}
              onClearCompleted={handleClearCompletedJobs}
            />
          </div>
        )}

        {/* Tab 3: Local Storage Download History */}
        {activeTab === 'history' && (
          <div className="pt-4">
            <DownloadHistory
              history={history}
              onRemoveItem={handleRemoveHistoryItem}
              onClearAll={handleClearAllHistory}
              onRedownload={handleRedownloadHistoryItem}
            />
          </div>
        )}

        {/* Tab 4: Supported Platforms */}
        {activeTab === 'platforms' && (
          <div className="pt-4">
            <SupportedPlatforms
              onSelectSample={(sampleUrl) => {
                setUrl(sampleUrl);
                setActiveTab('downloader');
                handleAnalyze(sampleUrl);
              }}
            />
          </div>
        )}

        {/* Tab 5: FAQ */}
        {activeTab === 'faq' && (
          <div className="pt-4">
            <FaqAccordion />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenLegal={(type) => setLegalModal(type)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Legal & Contact Modals */}
      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
