import { motion } from 'framer-motion';

export default function SkillGroupCard({ group }) {
  const { title, icon: Icon, accent, skills } = group;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      className="glass-panel premium-border rounded-[1.75rem] p-6"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-slate-950`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">{skills.length} core tools</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {skills.map((skill) => {
          const SkillIcon = skill.icon;

          return (
            <div key={skill.name}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <SkillIcon className="h-4 w-4 text-cyan-300" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{skill.name}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{skill.level}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${accent}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.article>
  );
}

