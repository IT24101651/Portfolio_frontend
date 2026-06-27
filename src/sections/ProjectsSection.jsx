import { useEffect, useState } from 'react';
import { apiRequest } from '../admin/adminApi';
import AnimatedSection from '../components/ui/AnimatedSection';
import ProjectCard from '../components/ui/ProjectCard';
import SectionHeading from '../components/ui/SectionHeading';

const projectAccents = [
  'from-emerald-400 via-cyan-400 to-blue-500',
  'from-indigo-400 via-sky-500 to-cyan-400',
  'from-fuchsia-400 via-violet-500 to-blue-500',
  'from-orange-400 via-amber-400 to-yellow-300',
  'from-cyan-400 via-blue-500 to-indigo-500',
  'from-pink-400 via-fuchsia-500 to-violet-500',
  'from-lime-400 via-green-500 to-emerald-500',
];

function normalizeProject(project, index) {
  return {
    title: project?.title || 'Untitled Project',
    description: project?.description || '',
    tech: Array.isArray(project?.technologies) ? project.technologies.filter(Boolean) : [],
    github: project?.githubLink || '',
    live: project?.liveDemo || '',
    badge: project?.category || 'Project',
    accent: projectAccents[index % projectAccents.length],
  };
}

export default function ProjectsSection({ id }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setLoading(true);
      setError('');

      try {
        const data = await apiRequest('/projects');
        if (!cancelled) {
          setProjects(Array.isArray(data) ? data.map((project, index) => normalizeProject(project, index)) : []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setProjects([]);
          setError(requestError.message || 'Unable to load projects.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AnimatedSection id={id}>
      <div className="section-shell">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work that mixes engineering discipline with polished presentation."
          description="Each project card includes a snapshot, stack tags, and direct links so the work feels easy to explore."
        />

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
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
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
