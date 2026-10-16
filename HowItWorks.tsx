import React from 'react';
import { Link2, Sliders, Cpu, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Paste Video Link',
      description:
        'Copy any video URL from YouTube, Vimeo, Reddit, TikTok, or direct MP4 streams and paste it into the analyzer.',
      icon: Link2,
    },
    {
      number: '02',
      title: 'Select Format & Quality',
      description:
        'Choose from genuine available resolutions (360p up to 4K Ultra HD) or extract a 320kbps MP3 audio track.',
      icon: Sliders,
    },
    {
      number: '03',
      title: 'Secure Media Processing',
      description:
        'Our background queue engine streams, multiplexes, and prepares the file with full SSRF protection.',
      icon: Cpu,
    },
    {
      number: '04',
      title: 'Direct High-Speed Download',
      description:
        'Download your ready media instantly using an encrypted, temporary 15-minute token delivered directly to your device.',
      icon: DownloadCloud,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          How UltraVid Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          A four-step media extraction pipeline designed for speed, safety, and pristine video fidelity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="p-5 rounded-2xl bg-[#0f1523]/80 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
