import { motion } from 'framer-motion';

export default function InfoCard({ icon: Icon, title, description, eyebrow, className = '' }) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      className={`glass-panel premium-border rounded-3xl p-5 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/90">{eyebrow}</p> : null}
          <h3 className="mt-1 font-display text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
    </motion.article>
  );
}

