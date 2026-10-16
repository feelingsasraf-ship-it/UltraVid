import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Is UltraVid completely free to use?',
      answer:
        'Yes. UltraVid is 100% free with no subscription, account creation, or paywalls required. Rate limits are in place to ensure fair bandwidth allocation for all users.',
    },
    {
      question: 'Why do some videos not offer a 4K resolution option?',
      answer:
        'UltraVid adheres strictly to source authenticity. If an original video was recorded or uploaded in 1080p or 720p, we will never claim to upscale it to fake 4K. 4K (2160p) will appear only when genuinely available from the source.',
    },
    {
      question: 'How long do temporary download links remain valid?',
      answer:
        'Download tokens are valid for 15 minutes following job completion. After 15 minutes, temporary cache files are automatically purged from the server to protect storage resources and user privacy.',
    },
    {
      question: 'Are downloaded files safe from malware or adware?',
      answer:
        'Absolutely. Files are delivered directly via standard HTTP attachment streams without installers, toolbars, or third-party wrappers. The file you receive contains only the pure audio or video stream from the provider.',
    },
    {
      question: 'Why are platforms like Instagram or private Facebook videos restricted?',
      answer:
        'Under Meta and major platform developer terms, accessing private content without user OAuth authentication is restricted. UltraVid respects platform terms of service and legal DRM protections, clearly communicating supported public endpoints.',
    },
    {
      question: 'Can I extract audio tracks only without the video?',
      answer:
        'Yes. Under the Audio Only tab in the quality selector, you can download high-bitrate MP3 (320kbps) or AAC M4A files for music, interviews, lectures, and podcasts.',
    },
    {
      question: 'Does UltraVid log my IP address or personal download history?',
      answer:
        'No. Your download history is stored solely inside your browser localStorage. The server maintains only transient job status in memory during the active download and records zero user tracking databases.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Everything you need to know about resolutions, supported platforms, and security policies.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl bg-[#0f1523]/80 border border-white/5 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-white hover:text-blue-400 transition-colors focus:outline-none"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in-50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
