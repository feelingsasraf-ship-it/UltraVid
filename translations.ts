export type Language = 'bn' | 'en';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  downloader: string;
  queue: string;
  history: string;
  platforms: string;
  faq: string;
  about: string;
  contact: string;
  privacy: string;
  terms: string;
  quickPaste: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  inputPlaceholder: string;
  paste: string;
  analyze: string;
  analyzing: string;
  quickTests: string;
  ssrfProtected: string;
  videoAudio: string;
  audioOnly: string;
  startDownload: string;
  preparingStream: string;
  maxQuality: string;
  estimated: string;
  selected: string;
  activeQueueTitle: string;
  activeQueueSubtitle: string;
  clearFinished: string;
  queueEmpty: string;
  queueEmptyDesc: string;
  cancel: string;
  retry: string;
  saveFile: string;
  readyDownload: string;
  downloadHistoryTitle: string;
  searchHistoryPlaceholder: string;
  all: string;
  done: string;
  noHistory: string;
  noHistoryDesc: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
  faqTitle: string;
  faqSubtitle: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  bn: {
    appName: 'UltraVid',
    tagline: 'দ্রুত। বুদ্ধিমান। উচ্চ মানসম্পন্ন।',
    downloader: 'ডাউনলোডার',
    queue: 'ডাউনলোড কিউ',
    history: 'হিস্ট্রি',
    platforms: 'সমর্থিত প্ল্যাটফর্ম',
    faq: 'প্রশ্নোত্তর (FAQ)',
    about: 'সম্পর্কে',
    contact: 'যোগাযোগ',
    privacy: 'গোপনীয়তা নীতি',
    terms: 'শর্তাবলী',
    quickPaste: 'কুইক পেস্ট',
    heroBadge: 'পরবর্তী প্রজন্মের ফুল-স্ট্যাক মিডিয়া ইঞ্জিন',
    heroTitle1: 'যে কোনো ভিডিও ডাউনলোড করুন ',
    heroTitleHighlight: 'সেরা কোয়ালিটিতে',
    heroSubtitle: 'দ্রুত, নিরাপদ ও ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করে আসল কোয়ালিটিতে 4K আল্ট্রা এইচডি এবং ৩২০ kbps MP3 অডিও ডাউনলোড করুন।',
    inputPlaceholder: 'YouTube, Vimeo, Reddit, TikTok বা ডিরেক্ট MP4 ভিডিও লিংক পেস্ট করুন...',
    paste: 'পেস্ট',
    analyze: 'ভিডিও বিশ্লেষণ',
    analyzing: 'বিশ্লেষণ হচ্ছে...',
    quickTests: 'দ্রুত পরীক্ষা:',
    ssrfProtected: 'SSRF সুরক্ষিত ও এনক্রিপ্টেড টোকেন ডেলিভারি',
    videoAudio: 'ভিডিও + অডিও',
    audioOnly: 'শুধুমাত্র অডিও',
    startDownload: 'ডাউনলোড শুরু করুন',
    preparingStream: 'স্ট্রিম প্রস্তুত হচ্ছে...',
    maxQuality: 'সর্বোচ্চ কোয়ালিটি:',
    estimated: 'আনুমানিক',
    selected: 'নির্বাচিত:',
    activeQueueTitle: 'সক্রিয় ডাউনলোড কিউ',
    activeQueueSubtitle: 'রিয়েল-টাইম ব্যাকএন্ড জব প্রসেসিং, ব্যান্ডউইথ স্পিড ট্র্যাকিং এবং সাময়িক টোকেন সিস্টেম।',
    clearFinished: 'সম্পন্নগুলো মুছুন',
    queueEmpty: 'ডাউনলোড কিউ ফাঁকা',
    queueEmptyDesc: 'হোম পেজে গিয়ে যে কোনো ভিডিও লিংক বিশ্লেষণ করুন অথবা কুইক টেস্ট ভিডিও বেছে নিয়ে ডাউনলোড শুরু করুন।',
    cancel: 'বাতিল',
    retry: 'পুনরায় চেষ্টা',
    saveFile: 'ফাইল সেভ করুন',
    readyDownload: 'ডাউনলোডের জন্য প্রস্তুত (১৫ মিনিট মেয়াদ)',
    downloadHistoryTitle: 'ডাউনলোড হিস্ট্রি',
    searchHistoryPlaceholder: 'ভিডিওর নাম বা প্ল্যাটফর্ম দিয়ে খুঁজুন...',
    all: 'সব',
    done: 'সম্পন্ন',
    noHistory: 'কোনো হিস্ট্রি নেই',
    noHistoryDesc: 'আপনার ডাউনলোড হিস্ট্রি সম্পূর্ণ ব্যক্তিগতভাবে আপনার ব্রাউজারের লোকাল স্টোরেজে থাকে। সার্ভারে কোনো তথ্য জমা রাখা হয় না।',
    howItWorksTitle: 'UltraVid কীভাবে কাজ করে',
    howItWorksSubtitle: 'গতি, নিরাপত্তা ও স্বচ্ছতার জন্য তৈরি ৪-ধাপের নিরাপদ মিডিয়া এক্সট্র্যাকশন পাইপলাইন।',
    featuresTitle: 'গতি ও নিরাপত্তার জন্য তৈরি',
    featuresSubtitle: 'কেন UltraVid আধুনিক ও পরিষ্কার মিডিয়া ডাউনলোডের জন্য সেরা পছন্দ তা জানুন।',
    faqTitle: 'সাধারণ জিজ্ঞাসা ও উত্তর',
    faqSubtitle: 'কোয়ালিটি, প্ল্যাটফর্ম সাপোর্ট ও নিরাপত্তা সম্পর্কিত সব প্রশ্নের উত্তর।',
  },
  en: {
    appName: 'UltraVid',
    tagline: 'Fast. Smart. High Quality.',
    downloader: 'Downloader',
    queue: 'Queue',
    history: 'History',
    platforms: 'Platforms',
    faq: 'FAQ',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    quickPaste: 'Quick Paste',
    heroBadge: 'Next-Gen Full-Stack Media Engine',
    heroTitle1: 'Download Any Video in ',
    heroTitleHighlight: 'Crisp Quality',
    heroSubtitle: 'Fast, secure, and privacy-first video extraction with true multi-resolution support up to 4K Ultra HD and 320kbps MP3 audio.',
    inputPlaceholder: 'Paste video link from YouTube, Vimeo, Reddit, TikTok, Direct MP4...',
    paste: 'Paste',
    analyze: 'Analyze Video',
    analyzing: 'Analyzing...',
    quickTests: 'Quick Tests:',
    ssrfProtected: 'SSRF Protected & Secure Token Delivery',
    videoAudio: 'Video + Audio',
    audioOnly: 'Audio Only',
    startDownload: 'Start Download',
    preparingStream: 'Preparing Stream...',
    maxQuality: 'Max Quality:',
    estimated: 'estimated',
    selected: 'Selected:',
    activeQueueTitle: 'Active Download Queue',
    activeQueueSubtitle: 'Real-time backend job workers with chunk streaming and temporary token expiration.',
    clearFinished: 'Clear Finished',
    queueEmpty: 'Download Queue is Empty',
    queueEmptyDesc: 'Analyze any video link or select a quick test video from the home tab to start downloading with real-time speed and progress.',
    cancel: 'Cancel',
    retry: 'Retry',
    saveFile: 'Save File',
    readyDownload: 'Ready for download (15 min token)',
    downloadHistoryTitle: 'Download History',
    searchHistoryPlaceholder: 'Search downloads by title or platform...',
    all: 'All',
    done: 'Done',
    noHistory: 'No Download History',
    noHistoryDesc: 'Your downloaded media items are safely logged locally in your browser storage. Zero personal data is stored on our servers.',
    howItWorksTitle: 'How UltraVid Works',
    howItWorksSubtitle: 'A four-step media extraction pipeline designed for speed, safety, and pristine video fidelity.',
    featuresTitle: 'Engineered for Performance & Security',
    featuresSubtitle: 'Discover why UltraVid is the premier choice for fast, clean, and respectful media extraction.',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know about resolutions, supported platforms, and security policies.',
  },
};
