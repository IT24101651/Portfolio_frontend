import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const updateVisibility = () => {
      frameId = 0;
      const nextVisible = window.scrollY > 500;
      setVisible((currentVisible) => (currentVisible === nextVisible ? currentVisible : nextVisible));
    };

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 transform-gpu items-center justify-center rounded-full border border-cyan-300/30 bg-slate-950/85 text-cyan-300 shadow-glow backdrop-blur-md transition hover:-translate-y-1 hover:bg-slate-900 dark:bg-slate-950/85"
      style={{ willChange: 'transform, opacity' }}
    >
      <FaArrowUp className="h-4 w-4" />
    </button>
  );
}
