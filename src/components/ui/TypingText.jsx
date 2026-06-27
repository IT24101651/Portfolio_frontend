import { useEffect, useState } from 'react';

export default function TypingText({ words, className = '' }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const currentWord = words[wordIndex] ?? '';
    let timeoutId;

    if (phase === 'typing') {
      if (charIndex < currentWord.length) {
        timeoutId = window.setTimeout(() => setCharIndex((value) => value + 1), 95);
      } else {
        timeoutId = window.setTimeout(() => setPhase('pausing'), 1200);
      }
    }

    if (phase === 'pausing') {
      timeoutId = window.setTimeout(() => setPhase('deleting'), 250);
    }

    if (phase === 'deleting') {
      if (charIndex > 0) {
        timeoutId = window.setTimeout(() => setCharIndex((value) => value - 1), 55);
      } else {
        timeoutId = window.setTimeout(() => {
          setWordIndex((value) => (value + 1) % words.length);
          setPhase('typing');
        }, 120);
      }
    }

    return () => window.clearTimeout(timeoutId);
  }, [charIndex, phase, wordIndex, words]);

  const displayText = words[wordIndex]?.slice(0, charIndex) ?? '';

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span>{displayText}</span>
      <span className="inline-block h-6 w-[2px] animate-pulse rounded-full bg-cyan-300" aria-hidden="true" />
    </span>
  );
}

