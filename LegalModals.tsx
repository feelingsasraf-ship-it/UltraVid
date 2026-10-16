import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Info, Mail, Send, CheckCircle2 } from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'about' | 'contact' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactEmail && contactMessage) {
      setContactSent(true);
      setTimeout(() => {
        setContactSent(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0f1523] border border-white/10 shadow-2xl p-6 sm:p-8 text-slate-300">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Privacy Policy</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <p>
                At UltraVid, privacy is a fundamental architecture commitment, not an afterthought. We do not require account registration, collect personal identifiers, or profile user browsing habits.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">1. Client-Side Download History</h4>
              <p>
                Your download history and file logs are stored strictly inside your web browser’s local storage (HTML5 localStorage). This data never touches our database and can be cleared by you at any time with a single click.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">2. Temporary Media Cache</h4>
              <p>
                When a download stream is requested, transient media chunks are cached temporarily in an isolated server directory for high-speed transmission. Completed files are assigned an encrypted 15-minute token and are irreversibly purged after token expiry.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">3. No Telemetry or Advertising Trackers</h4>
              <p>
                UltraVid operates zero third-party advertising scripts, biometric trackers, or telemetry beacons.
              </p>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-purple-400">
              <FileText className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Terms of Service</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
              <p>
                <strong>Fair Use & Copyright Policy</strong>
              </p>
              <p>
                UltraVid is designed as a personal media backup and format utility for content creators, students, researchers, and consumers managing authorized personal media or public Creative Commons streams.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">1. Permitted Usage</h4>
              <p>
                Users must ensure they possess the necessary rights, licenses, or fair-use justifications under applicable copyright legislation before downloading any media. UltraVid does not bypass technical access controls, encrypted DRM locks, or subscription paywalls.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">2. Platform Restrictions</h4>
              <p>
                UltraVid honors platform restrictions. Media requiring authenticated user tokens or private authorizations will not be scraped or exported.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">3. Service Limits</h4>
              <p>
                To safeguard shared infrastructure, rate limits are automatically enforced on automated requests and mass downloading scripts.
              </p>
            </div>
          </div>
        )}

        {type === 'about' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-blue-400">
              <Info className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">About UltraVid</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
              <p>
                <strong>UltraVid — Fast. Smart. High Quality.</strong>
              </p>
              <p>
                UltraVid was built to address the cluttered, ad-ridden, and unreliable landscape of online video downloaders. We believe downloading your favorite Creative Commons animations, study lectures, open podcasts, and personal backup clips should be fast, clean, and secure.
              </p>
              <p>
                Our core engine utilizes modern Node.js chunk streaming, strict SSRF protection filters, real-time bandwidth metering, and an extensible Provider Adapter Architecture.
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2 text-xs">
                <div className="text-white font-semibold">Engineering Highlights:</div>
                <div>• Zero-tracking client persistence</div>
                <div>• Real-time progress with byte telemetry & speed calculation</div>
                <div>• Genuine multi-resolution mapping (from 360p up to 4K Ultra HD)</div>
                <div>• Responsive interface crafted with Tailwind CSS & Motion</div>
              </div>
            </div>
          </div>
        )}

        {type === 'contact' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
              <Mail className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Contact & Support</h3>
            </div>

            {contactSent ? (
              <div className="p-6 text-center space-y-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Thank you for reaching out. The UltraVid technical team will review your inquiry shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs sm:text-sm">
                <p className="text-xs text-slate-400">
                  Have a suggestion, adapter integration question, or bug report? Reach out to our technical engineering team.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your inquiry or platform feedback..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
