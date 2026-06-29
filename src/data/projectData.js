const projectAccents = [
  'from-emerald-400 via-cyan-400 to-blue-500',
  'from-indigo-400 via-sky-500 to-cyan-400',
  'from-fuchsia-400 via-violet-500 to-blue-500',
  'from-orange-400 via-amber-400 to-yellow-300',
  'from-cyan-400 via-blue-500 to-indigo-500',
  'from-pink-400 via-fuchsia-500 to-violet-500',
  'from-lime-400 via-green-500 to-emerald-500',
];

function normalizeTech(project) {
  if (Array.isArray(project?.technologies)) {
    return project.technologies.filter(Boolean);
  }

  if (Array.isArray(project?.tech)) {
    return project.tech.filter(Boolean);
  }

  return [];
}

export function normalizeProject(project, index) {
  return {
    title: project?.title || 'Untitled Project',
    description: project?.description || '',
    tech: normalizeTech(project),
    github: project?.githubLink || project?.github || '',
    live: project?.liveDemo || project?.live || '',
    badge: project?.category || project?.badge || 'Project',
    order: Number.isFinite(Number(project?.order)) ? Number(project.order) : index + 1,
    accent: projectAccents[index % projectAccents.length],
  };
}
