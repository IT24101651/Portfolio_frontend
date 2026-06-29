import { useEffect, useState } from 'react';
import { apiRequest } from '../admin/adminApi';
import { projects as localProjects } from '../data/siteData';
import { normalizeProject } from '../data/projectData';

export function useProjects() {
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
          const normalizedProjects = Array.isArray(data)
            ? data.map((project, index) => normalizeProject(project, index))
            : [];

          setProjects(normalizedProjects.sort((left, right) => left.order - right.order));
        }
      } catch (requestError) {
        if (!cancelled) {
          const fallbackProjects = Array.isArray(localProjects)
            ? localProjects
                .map((project, index) => normalizeProject(project, index))
                .sort((left, right) => left.order - right.order)
            : [];

          setProjects(fallbackProjects);
          setError(
            fallbackProjects.length
              ? ''
              : requestError.message || 'Unable to load projects.',
          );
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

  return { projects, loading, error };
}
