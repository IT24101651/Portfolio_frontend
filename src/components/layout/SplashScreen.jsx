import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const wavePoints =
  '0,82 18,82 30,82 40,58 50,110 60,24 70,168 78,84 90,84 102,70 112,96 124,60 136,84 152,84 176,84 198,84 216,84 234,84 250,84 266,84 282,84 298,84 316,84 332,84 350,84 372,84 388,84 404,84 420,84 438,84 452,84 468,84 486,84 504,84 520,84 536,84 552,84 568,84 584,84 600,84 618,84 630,84 650,84 662,84 674,84 686,84 698,84 708,84 720,84 732,58 744,118 756,18 768,172 778,84 790,84 804,72 816,96 830,58 844,84 860,84 878,84 896,84';

function useSplashProgress(durationMs) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    let rafId = 0;
    let finished = false;
    const start = performance.now();

    function animate(now) {
      const elapsed = now - start;
      const nextProgress = Math.min(100, Math.max(1, Math.round((elapsed / durationMs) * 100)));

      setProgress((current) => (current === nextProgress ? current : nextProgress));

      if (nextProgress < 100) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        finished = true;
      }
    }

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      if (!finished) {
        setProgress(1);
      }
    };
  }, [durationMs]);

  return progress;
}

export default function SplashScreen({ onComplete }) {
  const prefersReducedMotion = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false, []);
  const durationMs = prefersReducedMotion ? 1400 : 3800;
  const progress = useSplashProgress(durationMs);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;

    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (progress < 100) {
      return;
    }

    let completeTimer = 0;
    const exitTimer = window.setTimeout(() => {
      setExiting(true);
      completeTimer = window.setTimeout(onComplete, 520);
    }, prefersReducedMotion ? 180 : 420);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, prefersReducedMotion, progress]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#02040b] text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      aria-label="Loading portfolio"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(217,70,239,0.16),transparent_28%),radial-gradient(circle_at_50%_85%,rgba(34,211,238,0.1),transparent_24%)]" />

      <div className="absolute inset-0 opacity-30 splash-noise" />

      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="absolute inset-0">
        <div className="absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_24px_rgba(34,211,238,0.8)] splash-ping" />
        <div className="absolute right-[12%] top-[26%] h-2.5 w-2.5 rounded-full bg-fuchsia-400/80 shadow-[0_0_24px_rgba(217,70,239,0.8)] splash-ping" />
        <div className="absolute bottom-[18%] left-[16%] h-1.5 w-1.5 rounded-full bg-blue-300/80 shadow-[0_0_18px_rgba(96,165,250,0.7)] splash-ping" />
      </div>

      <div className="relative flex h-full items-center justify-center px-4">
        <div className="w-full max-w-4xl text-center">
          <motion.p
            className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-cyan-200/75 sm:text-xs"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, ease: 'easeOut' }}
          >
            Loading portfolio
          </motion.p>

          <motion.h1
            className="font-display text-4xl font-bold tracking-[0.14em] text-transparent sm:text-5xl lg:text-6xl splash-word"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
          >
            PAVI
          </motion.h1>

          <div className="mt-8 flex justify-center">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <svg viewBox="0 0 896 180" className="h-16 w-full sm:h-[72px]">
                <defs>
                  <linearGradient id="splashWave" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                  <filter id="splashGlow">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d={`M 0 84 ${wavePoints}`}
                  fill="none"
                  stroke="url(#splashWave)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#splashGlow)"
                  className="splash-wave"
                />
              </svg>

              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
                <div className="relative flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#22d3ee,#3b82f6,#d946ef,#22d3ee)] p-[2px] shadow-[0_0_50px_rgba(59,130,246,0.4)]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#050816]/95 backdrop-blur-sm">
                      <span className="font-display text-3xl font-semibold text-white sm:text-4xl">
                        {progress}
                      </span>
                    </div>
                  </div>
                  <motion.span
                    className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.95)]"
                    animate={{ rotate: prefersReducedMotion ? 0 : 360 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 6, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '50% 64px' }}
                  />
                </div>

                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-300/80 sm:text-xs">
                  {progress === 100 ? 'Ready' : 'Loading'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
