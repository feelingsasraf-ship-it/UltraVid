import React from 'react';
import { ArrowDownToLine, Heart, Shield } from 'lucide-react';
import { LegalModalType } from './LegalModals.js';

interface FooterProps {
  onOpenLegal: (type: LegalModalType) => void;
  onNavigateTab: (tab: 'downloader' | 'platforms' | 'faq' | 'history') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigateTab }) => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#06080d] py-10 px-4 sm:px-6 lg:px-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand and tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <ArrowDownToLine className="w-3.5 h-3.5" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Ultra<span className="text-blue-400">Vid</span>
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs text-slate-400">Fast. Smart. High Quality.</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Full-stack responsive media downloader engineered with genuine resolution extraction and SSRF security.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
          <button
            onClick={() => onNavigateTab('downloader')}
            className="hover:text-white transition-colors"
          >
            Downloader
          </button>
          <button
            onClick={() => onNavigateTab('platforms')}
            className="hover:text-white transition-colors"
          >
            Platforms
          </button>
          <button
            onClick={() => onNavigateTab('faq')}
            className="hover:text-white transition-colors"
          >
            FAQ
          </button>
          <button
            onClick={() => onOpenLegal('about')}
            className="hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={() => onOpenLegal('contact')}
            className="hover:text-white transition-colors"
          >
            Contact
          </button>
          <button
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onOpenLegal('terms')}
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-400 text-center md:text-right">
          <div>© {new Date().getFullYear()} UltraVid. All rights reserved.</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Compliant with fair-use and authorized media licenses.</div>
        </div>
      </div>
    </footer>
  );
};
