import { motion } from 'framer-motion';

const particles = [
  { top: '12%', left: '8%', size: 10, delay: 0 },
  { top: '18%', left: '82%', size: 12, delay: 0.4 },
  { top: '42%', left: '12%', size: 8, delay: 0.8 },
  { top: '66%', left: '88%', size: 10, delay: 1.2 },
  { top: '82%', left: '18%', size: 7, delay: 0.2 },
  { top: '78%', left: '74%', size: 9, delay: 1.5 },
  { top: '30%', left: '50%', size: 12, delay: 0.6 },
  { top: '54%', left: '58%', size: 7, delay: 1.1 },
];

export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 isolate overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_32%),radial-gradient(circle_at_75%_25%,rgba(168,85,247,0.12),transparent_24%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.08),transparent_24%)]" />

      <motion.div
        className="absolute -top-24 left-[-8rem] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl transform-gpu"
        style={{ willChange: 'transform' }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-7rem] top-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl transform-gpu"
        style={{ willChange: 'transform' }}
        animate={{ x: [0, -24, 0], y: [0, 18, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-7rem] left-[24%] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl transform-gpu"
        style={{ willChange: 'transform' }}
        animate={{ x: [0, 18, 0], y: [0, -16, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
      />

      {particles.map((particle, index) => (
        <motion.span
          key={`${particle.top}-${index}`}
          className="absolute rounded-full bg-cyan-300/55 shadow-[0_0_30px_rgba(34,211,238,0.5)] transform-gpu"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            willChange: 'transform, opacity',
          }}
          animate={{ y: [0, -18, 0], opacity: [0.45, 1, 0.45], scale: [1, 1.35, 1] }}
          transition={{
            duration: 5 + index * 0.4,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
