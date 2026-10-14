import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC = () => {
  const targetDate = new Date('2026-10-18T18:00:00Z').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-indigo-600 animate-pulse" />
        <span className="text-xs font-mono font-bold tracking-widest text-indigo-700 uppercase">
          COUNTDOWN TO PRIVATE ALPHA RELEASE
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {timeBlocks.map((block, idx) => (
          <div
            key={idx}
            className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-indigo-100 shadow-[0_8px_20px_-6px_rgba(99,102,241,0.12)] text-center relative overflow-hidden group hover:border-indigo-300 transition-all"
          >
            <div className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {String(block.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono tracking-wider text-slate-400 font-bold">
              {block.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
