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
          <p className="text-sm text-slate-500 dark:text-slate-300">{skills.length} skills</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {skills.map((skill) => {
          const SkillIcon = skill.icon;

          return (
            <motion.span
              key={skill.name}
              whileHover={{ y: -2 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/90 dark:bg-slate-950/30 dark:text-slate-200 dark:hover:bg-slate-950/45"
            >
              <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${accent}`} />
              <SkillIcon className="h-4 w-4 text-cyan-400 dark:text-cyan-300" />
              <span>{skill.name}</span>
            </motion.span>
          );
        })}
      </div>
    </motion.article>
  );
}
