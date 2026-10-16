import React from 'react';
import { Zap, ShieldCheck, UserCheck, Smartphone, Music, CheckCircle2 } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Fast Streaming Pipeline',
      description:
        'Engineered with chunk streaming and range acceleration to maximize your device bandwidth without buffer stalling.',
      icon: Zap,
    },
    {
      title: 'Authentic Resolution Engine',
      description:
        'We never upscale or fake resolutions. 4K, 1440p, and 1080p options appear strictly when genuinely available at the source.',
      icon: CheckCircle2,
    },
    {
      title: 'High-Bitrate Audio Extraction',
      description:
        'Extract crystal-clear MP3 (320kbps) and M4A audio tracks directly from videos for offline podcast or music listening.',
      icon: Music,
    },
    {
      title: 'SSRF & Network Shield',
      description:
        'Robust server-side DNS verification blocks loopbacks, intranet exploits, and malicious redirected targets.',
      icon: ShieldCheck,
    },
    {
      title: 'Zero Server Data Retention',
      description:
        'Your download history stays exclusively inside your browser local storage. No tracking cookies, no accounts, no server logs.',
      icon: UserCheck,
    },
    {
      title: 'Adaptive Mobile Design',
      description:
        'Seamless experience across iOS, Android, tablets, and wide desktop screens with touch-friendly 48px controls.',
      icon: Smartphone,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Engineered for Performance & Security
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Discover why UltraVid is the premier choice for fast, clean, and respectful media extraction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#0f1523]/80 border border-white/5 hover:border-indigo-500/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600/15 to-purple-600/15 border border-white/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
