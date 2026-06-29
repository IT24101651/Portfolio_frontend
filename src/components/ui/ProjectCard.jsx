import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

export default function ProjectCard({ project, entryDelay = 0, entryDirection = 'left' }) {
  const hasGithub = Boolean(project.github);
  const hasLiveDemo = Boolean(project.live);
  const initialX = entryDirection === 'right' ? 48 : -48;

  return (
    <motion.article
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: entryDelay }}
      whileHover={{ y: -10, rotateX: 1.5, rotateY: -1.5, transition: { type: 'spring', stiffness: 230, damping: 20 } }}
      className="group overflow-hidden rounded-[1.75rem] glass-panel premium-border transform-gpu"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className={`relative h-52 bg-gradient-to-br ${project.accent} p-5`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_24%)]" />
        <div className="relative flex h-full flex-col justify-between rounded-[1.25rem] border border-white/20 bg-slate-950/35 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-white/90">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.2em]">{project.badge}</span>
            <span className="text-xs uppercase tracking-[0.25em] text-white/70">Preview</span>
          </div>

          <div className="grid flex-1 place-items-center">
            <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white/10">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12),transparent,rgba(255,255,255,0.08))] bg-[length:200%_100%] animate-shimmer" />
              <span className="relative font-display text-4xl font-bold tracking-[0.25em] text-white/95">{project.badge}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">{project.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-200"
            >
              {tech}
            </span>
          ))}
        </div>

        {hasGithub || hasLiveDemo ? (
          <div className="flex flex-wrap gap-3">
            {hasGithub ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-300/15"
              >
                <FaGithub className="h-4 w-4" />
                GitHub
              </a>
            ) : null}
            {hasLiveDemo ? (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300/40 hover:text-blue-500 dark:text-slate-200"
              >
                <FaExternalLinkAlt className="h-4 w-4" />
                Live Demo
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
