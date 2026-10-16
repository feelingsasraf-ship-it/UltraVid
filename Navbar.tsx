import React, { useState } from 'react';
import { Download, History, Sparkles, HelpCircle, Layers, Moon, Sun, Menu, X, ArrowDownToLine } from 'lucide-react';
import { ActiveTab } from '../types/index.js';
import { Language, TranslationDictionary } from '../locales/translations.js';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeJobsCount: number;
  historyCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  onQuickPasteClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeJobsCount,
  historyCount,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  t,
  onQuickPasteClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 dark:bg-[#080b11]/85 border-b border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleTabClick('downloader')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <ArrowDownToLine className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                Ultra<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Vid</span>
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => handleTabClick('downloader')}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                activeTab === 'downloader'
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.downloader}
            </button>
            <button
              onClick={() => handleTabClick('manager')}
              className={`transition-colors whitespace-nowrap py-1 relative flex items-center gap-1.5 ${
                activeTab === 'manager'
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.queue}
              {activeJobsCount > 0 && (
                <span className="text-[10px] font-mono font-bold bg-blue-600 text-white rounded-full px-1.5 py-0.2">
                  {activeJobsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabClick('history')}
              className={`transition-colors whitespace-nowrap py-1 relative flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.history}
              {historyCount > 0 && (
                <span className="text-[10px] font-mono text-slate-400">
                  ({historyCount})
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabClick('platforms')}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                activeTab === 'platforms'
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.platforms}
            </button>
            <button
              onClick={() => handleTabClick('faq')}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                activeTab === 'faq'
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.faq}
            </button>
          </nav>

          {/* Zone 3: 1 primary action, language toggle & theme switch */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language toggle: BN / EN */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 border border-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="ভাষা পরিবর্তন / Switch Language"
            >
              {language === 'bn' ? 'English' : 'বাংলা'}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>

            <button
              onClick={onQuickPasteClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.quickPaste}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/5 flex flex-col gap-1 pb-4 animate-in slide-in-from-top-2">
            <button
              onClick={() => handleTabClick('downloader')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left ${
                activeTab === 'downloader' ? 'bg-blue-600/15 text-blue-400 font-medium' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Download className="w-4 h-4" />
                {t.downloader}
              </span>
            </button>
            <button
              onClick={() => handleTabClick('manager')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left ${
                activeTab === 'manager' ? 'bg-blue-600/15 text-blue-400 font-medium' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ArrowDownToLine className="w-4 h-4" />
                {t.queue}
              </span>
              {activeJobsCount > 0 && (
                <span className="text-xs font-mono font-bold bg-blue-600 text-white rounded-full px-2 py-0.5">
                  {activeJobsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabClick('history')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left ${
                activeTab === 'history' ? 'bg-blue-600/15 text-blue-400 font-medium' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <History className="w-4 h-4" />
                {t.history}
              </span>
              {historyCount > 0 && (
                <span className="text-xs text-slate-400 font-mono">
                  {historyCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabClick('platforms')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left ${
                activeTab === 'platforms' ? 'bg-blue-600/15 text-blue-400 font-medium' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              {t.platforms}
            </button>
            <button
              onClick={() => handleTabClick('faq')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left ${
                activeTab === 'faq' ? 'bg-blue-600/15 text-blue-400 font-medium' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              {t.faq}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
