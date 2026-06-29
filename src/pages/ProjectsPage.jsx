import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import ProjectCard from '../components/ui/ProjectCard';
import SectionHeading from '../components/ui/SectionHeading';
import { useProjects } from '../hooks/useProjects';

export default function ProjectsPage({ onBackHome }) {
  const { projects, loading, error } = useProjects();

  return (
    <section className="section-gap pt-32">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="All Projects"
            title="The full portfolio archive with every project in one place."
            description="Each card keeps the same premium visual style, but this page opens the complete collection instead of just the featured two."
          />

          <motion.button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-300 dark:text-slate-200"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FaArrowLeft className="h-4 w-4" />
            Back to Home
          </motion.button>
        </div>

        {loading ? (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-8 text-sm text-slate-400">
            Loading projects...
          </div>
        ) : error ? (
          <div className="rounded-[1.5rem] border border-rose-400/20 bg-rose-400/10 px-5 py-8 text-sm text-rose-200">
            {error}
          </div>
        ) : projects.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                entryDelay={index * 0.08}
                entryDirection="left"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 px-5 py-8 text-sm text-slate-400">
            No projects have been added yet.
          </div>
        )}
      </div>
    </section>
  );
}
