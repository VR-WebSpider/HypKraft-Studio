import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Video Creator');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    sounds.playSuccess();

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#6366f1', '#ec4899', '#8b5cf6'],
    });

    const generatedId = `HYP-${Math.floor(1000 + Math.random() * 9000)}-${role.slice(0, 3).toUpperCase()}`;
    setTicketId(generatedId);
    setSubmitted(true);

    try {
      const waitlist = JSON.parse(localStorage.getItem('hypkraft_waitlist') || '[]');
      waitlist.push({ email, role, ticketId: generatedId, date: new Date().toISOString() });
      localStorage.setItem('hypkraft_waitlist', JSON.stringify(waitlist));
    } catch {
      // LocalStorage fallback
    }
  };

  return (
    <div id="waitlist" className="w-full max-w-xl mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-200/90 shadow-[0_15px_40px_-10px_rgba(99,102,241,0.12)]">
        {/* Soft pastel ambient background blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 blur-3xl pointer-events-none rounded-full" />

        {!submitted ? (
          <div>
            <div className="text-center mb-6">
              <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60 inline-block mb-2">
                VIP FOUNDER INVITATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                Request Early Access
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Join <span className="text-indigo-600 font-semibold">3,280+ creators, studios, and AI engineers</span> on the priority alpha list.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  WORK OR CREATIVE EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@webspiderstudios.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  I IDENTIFY PRIMARILY AS:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Video Creator', 'Motion VFX', 'AI Engineer', 'Studio / Agency'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        sounds.playBlip();
                        setRole(r);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        role === r
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.01] active:scale-95"
              >
                <span>CLAIM FOUNDING ACCESS PASS</span>
                <Send className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  No Spam Guarantee
                </span>
                <span className="flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-pink-500" />
                  Free 500 4K Render Mins
                </span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-200 text-indigo-600 shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
              CONFIRMED VIP ALLOCATION
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 mb-2">
              You're On The Priority List!
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6">
              We have locked in your spot for early alpha access and reserved your founding GPU rendering credits.
            </p>

            {/* Ticket Card in pristine iridescent styling */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 border border-indigo-200/80 font-mono text-left max-w-sm mx-auto shadow-sm">
              <div className="flex justify-between items-center border-b border-indigo-100 pb-2 mb-2">
                <span className="text-[10px] text-indigo-800 font-bold uppercase">
                  HYPKRAFT ACCESS PASS
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  ● ACTIVE
                </span>
              </div>
              <div className="text-indigo-900 font-black text-lg tracking-wider mb-1">
                {ticketId}
              </div>
              <div className="text-xs text-slate-600 truncate">
                Assigned: {email}
              </div>
              <div className="text-[11px] text-purple-700 mt-2 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> Includes 500 Free 4K Render Credits
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setEmail('');
              }}
              className="mt-6 text-xs text-slate-500 hover:text-slate-900 underline font-medium"
            >
              Register another email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
