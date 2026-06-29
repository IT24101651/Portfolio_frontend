import { motion } from 'framer-motion';
import AnimatedSection from '../components/ui/AnimatedSection';
import ProjectCard from '../components/ui/ProjectCard';
import SectionHeading from '../components/ui/SectionHeading';
import { FaArrowRight } from 'react-icons/fa';
import { useProjects } from '../hooks/useProjects';

export default function ProjectsSection({ id, onViewAll }) {
  const { projects, loading, error } = useProjects();
  const featuredProjects = projects.slice(0, 2);

  return (
    <AnimatedSection id={id}>
      <div className="section-shell">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work that mixes engineering discipline with polished presentation."
          description="Here are two featured projects from the collection. Tap through to the full archive if you want the rest."
        />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-300">
            Showing the strongest two projects here so the section stays focused.
          </p>
          <motion.button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-300/15"
          >
            View All Projects
            <FaArrowRight className="h-4 w-4" />
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
        ) : featuredProjects.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} entryDelay={index * 0.12} entryDirection="left" />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 px-5 py-8 text-sm text-slate-400">
            No projects have been added yet.
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
