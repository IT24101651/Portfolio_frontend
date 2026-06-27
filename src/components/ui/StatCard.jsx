import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="glass-panel premium-border rounded-3xl p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 text-cyan-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.article>
  );
}

