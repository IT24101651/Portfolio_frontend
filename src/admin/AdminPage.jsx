import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowLeft,
  FaBars,
  FaBell,
  FaChartLine,
  FaCode,
  FaCog,
  FaEdit,
  FaEnvelope,
  FaExternalLinkAlt,
  FaCertificate,
  FaGithub,
  FaFileAlt,
  FaFolderOpen,
  FaHome,
  FaPlus,
  FaProjectDiagram,
  FaSave,
  FaSignOutAlt,
  FaSpinner,
  FaTrash,
  FaUser,
  FaUserShield,
} from 'react-icons/fa';
import { defaultEditableContent, cloneEditableContent, normalizeEditableContent } from '../data/editableContent';
import SiteContentEditor from './SiteContentEditor';
import {
  apiRequest,
  clearAdminSession,
  fetchEditableContent,
  loadAdminSession,
  saveAdminSession,
  saveEditableContent,
} from './adminApi';

const initialProjectForm = {
  title: '',
  description: '',
  image: '',
  technologies: '',
  githubLink: '',
  liveDemo: '',
  category: '',
  order: '',
};

const initialLoginForm = {
  email: '',
  password: '',
};

const sidebarGroups = [
  {
    title: 'Main',
    items: [
      { key: 'dashboard', label: 'Dashboard', description: 'Overview', icon: FaChartLine },
      { key: 'home', label: 'Home', description: 'Hero copy', icon: FaHome },
      { key: 'about', label: 'About', description: 'Profile section', icon: FaUser },
      { key: 'skills', label: 'Skills', description: 'Tool stack', icon: FaCode },
      { key: 'certifications', label: 'Certifications', description: 'Learning proofs', icon: FaCertificate },
      { key: 'resume', label: 'Resume', description: 'CV content', icon: FaFileAlt },
      { key: 'contact', label: 'Contact', description: 'Form copy', icon: FaEnvelope },
    ],
  },
  {
    title: 'Management',
    items: [
      { key: 'projects', label: 'Projects', description: 'Portfolio items', icon: FaProjectDiagram },
      { key: 'messages', label: 'Messages', description: 'Inbox', icon: FaEnvelope },
      { key: 'settings', label: 'Settings', description: 'System', icon: FaCog },
    ],
  },
];

const editablePanels = new Set(['home', 'about', 'skills', 'certifications', 'resume', 'contact']);
const browserColors = ['#7c3aed', '#3b82f6', '#06b6d4', '#f59e0b', '#ec4899'];

function formatDate(value) {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatMonthLabel(value) {
  if (!value) {
    return 'Unknown';
  }

  const [year, month] = String(value).split('-');
  const parsedYear = Number.parseInt(year, 10);
  const parsedMonth = Number.parseInt(month, 10);

  if (!Number.isFinite(parsedYear) || !Number.isFinite(parsedMonth)) {
    return String(value);
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: '2-digit',
  }).format(new Date(parsedYear, parsedMonth - 1, 1));
}

function toProjectForm(project) {
  return {
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    technologies: Array.isArray(project?.technologies) ? project.technologies.join(', ') : '',
    githubLink: project?.githubLink || '',
    liveDemo: project?.liveDemo || '',
    category: project?.category || '',
    order: project?.order ?? '',
  };
}

function statFormatter(value) {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  return value ?? '0';
}

function getAvatarLabel(name) {
  return String(name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function PanelCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <section
      className={`rounded-[1.75rem] border border-white/10 bg-[#09101d] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${className}`.trim()}
    >
      <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

function SidebarItem({ icon: Icon, label, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
        active
          ? 'bg-violet-500 text-white shadow-[0_18px_40px_rgba(124,58,237,0.35)]'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
          active ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5'
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {description ? <span className="block text-xs text-slate-400">{description}</span> : null}
      </span>
    </button>
  );
}

function AdminButton({ children, variant = 'primary', icon: Icon, className = '', ...props }) {
  const styles = {
    primary: 'bg-violet-500 text-white hover:bg-violet-400 shadow-[0_12px_30px_rgba(124,58,237,0.25)]',
    secondary: 'border border-white/10 bg-white/5 text-slate-200 hover:border-violet-400/40 hover:text-violet-200',
    danger: 'border border-rose-500/20 bg-rose-500/10 text-rose-200 hover:border-rose-400/40 hover:bg-rose-500/15',
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`.trim()}
    >
      {Icon ? <Icon className={Icon === FaSpinner ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} /> : null}
      {children}
    </button>
  );
}

function InputField({ label, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200">
      <span className="text-slate-300">{label}</span>
      <input
        {...props}
        className={`rounded-2xl border border-white/10 bg-[#0d1220] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 ${props.className || ''}`.trim()}
      />
    </label>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200">
      <span className="text-slate-300">{label}</span>
      <textarea
        {...props}
        className={`min-h-32 rounded-2xl border border-white/10 bg-[#0d1220] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 ${props.className || ''}`.trim()}
      />
    </label>
  );
}

function MetricCard({ title, value, helper, icon: Icon, tone = 'violet' }) {
  const tones = {
    violet: 'from-violet-500/25 to-violet-500/5 text-violet-200',
    blue: 'from-blue-500/25 to-blue-500/5 text-blue-200',
    cyan: 'from-cyan-500/25 to-cyan-500/5 text-cyan-200',
    amber: 'from-amber-500/25 to-amber-500/5 text-amber-200',
    emerald: 'from-emerald-500/25 to-emerald-500/5 text-emerald-200',
  };

  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-[#09101d] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
          {helper ? <p className="mt-2 text-sm text-slate-400">{helper}</p> : null}
        </div>
        {Icon ? (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tones[tone] || tones.violet}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function SimpleLineChart({ data }) {
  const values = Array.isArray(data) ? data : [];
  const width = 1000;
  const height = 320;
  const paddingX = 24;
  const paddingY = 24;
  const chartHeight = height - paddingY * 2;
  const chartWidth = width - paddingX * 2;
  const maxValue = Math.max(1, ...values.map((item) => Number(item.count) || 0));

  const points = values.map((item, index) => {
    const x = values.length > 1 ? paddingX + (chartWidth * index) / (values.length - 1) : width / 2;
    const value = Number(item.count) || 0;
    const y = paddingY + chartHeight - (value / maxValue) * chartHeight;

    return { x, y, value };
  });

  const linePath = points.length ? `M ${points.map((point) => `${point.x},${point.y}`).join(' L ')}` : '';
  const areaPath =
    points.length > 0
      ? `M ${points[0].x},${height - paddingY} L ${points.map((point) => `${point.x},${point.y}`).join(' L ')} L ${points[points.length - 1].x},${height - paddingY} Z`
      : '';

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0a1020] p-4">
      {values.length ? (
        <>
          <svg viewBox={`0 0 ${width} ${height}`} className="h-[320px] w-full">
            <defs>
              <linearGradient id="visitorsFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="visitorsStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="55%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1={paddingX}
                x2={width - paddingX}
                y1={paddingY + chartHeight * ratio}
                y2={paddingY + chartHeight * ratio}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 6"
              />
            ))}

            <path d={areaPath} fill="url(#visitorsFill)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#visitorsStroke)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point, index) => (
              <g key={`${point.x}-${point.y}-${index}`}>
                <circle cx={point.x} cy={point.y} r="8" fill="#0a1020" stroke="#a855f7" strokeWidth="5" />
              </g>
            ))}
          </svg>

          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {values.map((item) => (
              <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-xs text-slate-400">{formatMonthLabel(item._id)}</p>
                <p className="mt-1 text-sm font-semibold text-white">{statFormatter(item.count)}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex min-h-[220px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 text-sm text-slate-400">
          No monthly visitor data yet.
        </div>
      )}
    </div>
  );
}

function buildBrowserBreakdown(visitors) {
  const counts = new Map();

  (Array.isArray(visitors) ? visitors : []).forEach((visitor) => {
    const label = visitor?.browser || 'Unknown';
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);
}

function TrafficBreakdown({ visitors }) {
  const breakdown = buildBrowserBreakdown(visitors);
  const total = breakdown.reduce((sum, item) => sum + item.count, 0);

  const gradient = breakdown.length
    ? `conic-gradient(${breakdown
        .map((item, index) => {
          const previous = breakdown.slice(0, index).reduce((sum, entry) => sum + (entry.count / total) * 100, 0);
          const current = previous + (item.count / total) * 100;
          return `${browserColors[index % browserColors.length]} ${previous}% ${current}%`;
        })
        .join(', ')})`
    : 'conic-gradient(#1f2937 0% 100%)';

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#0a1020] p-4">
      {breakdown.length ? (
        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
          <div className="flex items-center justify-center">
            <div className="relative h-52 w-52 rounded-full p-4" style={{ background: gradient }}>
              <div className="absolute inset-10 rounded-full bg-[#09101d] ring-1 ring-white/10" />
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Top browser</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{statFormatter(breakdown[0].count)}</p>
                  <p className="mt-1 text-sm text-slate-400">{breakdown[0].label}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {breakdown.map((item, index) => {
              const percent = total ? Math.round((item.count / total) * 100) : 0;

              return (
                <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: browserColors[index % browserColors.length] }} />
                    <p className="text-sm text-slate-200">{item.label}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">{percent}%</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[260px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 text-sm text-slate-400">
          No recent visitor data yet.
        </div>
      )}
    </div>
  );
}

function buildQuickActions(setActivePanel, beginCreateProject) {
  return [
    { label: 'Add New Project', description: 'Create a new project', onClick: beginCreateProject, icon: FaPlus },
    { label: 'Edit Home', description: 'Hero copy and buttons', onClick: () => setActivePanel('home'), icon: FaHome },
    { label: 'Edit Skills', description: 'Skill groups and labels', onClick: () => setActivePanel('skills'), icon: FaCode },
    { label: 'Edit Certifications', description: 'Certificate cards', onClick: () => setActivePanel('certifications'), icon: FaCertificate },
    { label: 'Update Resume', description: 'Resume preview content', onClick: () => setActivePanel('resume'), icon: FaFileAlt },
    { label: 'Open Contact', description: 'Contact page text', onClick: () => setActivePanel('contact'), icon: FaEnvelope },
  ];
}

export default function AdminPage({ onNavigateHome }) {
  const [session, setSession] = useState(() => loadAdminSession());
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [editingProjectId, setEditingProjectId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [content, setContent] = useState(() => cloneEditableContent(defaultEditableContent));
  const [loading, setLoading] = useState(Boolean(loadAdminSession().token));
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [projectError, setProjectError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [contentError, setContentError] = useState('');
  const [contentSuccess, setContentSuccess] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [contentSaving, setContentSaving] = useState(false);
  const [busyMessageId, setBusyMessageId] = useState('');
  const [busyProjectId, setBusyProjectId] = useState('');
  const [activePanel, setActivePanel] = useState('dashboard');
  const contentSuccessTimerRef = useRef(null);

  const token = session.token;
  const admin = session.admin;

  useEffect(() => {
    document.title = 'Admin | Paviththiran Portfolio';
  }, []);

  useEffect(() => {
    return () => {
      if (contentSuccessTimerRef.current) {
        window.clearTimeout(contentSuccessTimerRef.current);
      }
    };
  }, []);

  async function refreshDashboard(currentToken = token) {
    if (!currentToken) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [analyticsResult, messagesResult, projectsResult] = await Promise.allSettled([
        apiRequest('/admin/analytics', { token: currentToken }),
        apiRequest('/admin/messages', { token: currentToken }),
        apiRequest('/admin/projects', { token: currentToken }),
      ]);

      const rejectedResults = [analyticsResult, messagesResult, projectsResult].filter(
        (result) => result.status === 'rejected',
      );
      const unauthorizedResult = rejectedResults.find((result) => result.reason?.status === 401);

      if (unauthorizedResult) {
        handleLogout();
        return;
      }

      setAnalytics(analyticsResult.status === 'fulfilled' ? analyticsResult.value : null);
      setMessages(messagesResult.status === 'fulfilled' && Array.isArray(messagesResult.value) ? messagesResult.value : []);
      setProjects(projectsResult.status === 'fulfilled' && Array.isArray(projectsResult.value) ? projectsResult.value : []);

      try {
        const contentData = await fetchEditableContent();
        setContent(normalizeEditableContent(contentData));
      } catch {
        setContent(cloneEditableContent(defaultEditableContent));
      }

      if (rejectedResults.length) {
        setError(
          rejectedResults.length === 3
            ? 'Unable to reach the backend API. Check that the server is running and reload the page.'
            : 'Some dashboard data could not be loaded. The available sections are still shown below.',
        );
      }
    } catch (requestError) {
      if (requestError.status === 401) {
        handleLogout();
        return;
      }

      setError(requestError.message || 'Unable to load the dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    refreshDashboard(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleLogout() {
    if (contentSuccessTimerRef.current) {
      window.clearTimeout(contentSuccessTimerRef.current);
      contentSuccessTimerRef.current = null;
    }

    clearAdminSession();
    setSession({ token: '', admin: null });
    setAnalytics(null);
    setMessages([]);
    setProjects([]);
    setError('');
    setLoginError('');
    setProjectError('');
    setContentError('');
    setContentSuccess('');
    setMessageError('');
    setEditingProjectId('');
    setProjectForm(initialProjectForm);
    setContent(cloneEditableContent(defaultEditableContent));
    setLoading(false);
    setActivePanel('dashboard');
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setLoginSubmitting(true);
    setLoginError('');

    try {
      const data = await apiRequest('/admin/login', {
        method: 'POST',
        body: loginForm,
      });

      const nextSession = {
        token: data.token,
        admin: data.admin,
      };

      saveAdminSession(nextSession);
      setSession(nextSession);
      setActivePanel('dashboard');
      setLoginForm(initialLoginForm);
    } catch (requestError) {
      setLoginError(requestError.message || 'Unable to sign in');
    } finally {
      setLoginSubmitting(false);
    }
  }

  async function handleContentSave() {
    setContentSaving(true);
    setContentError('');
    setContentSuccess('');

    try {
      const contentSnapshot = cloneEditableContent(content);
      const savedContent = await saveEditableContent(token, contentSnapshot);
      setContent(normalizeEditableContent(savedContent));
      setContentSuccess('Content saved successfully.');

      if (contentSuccessTimerRef.current) {
        window.clearTimeout(contentSuccessTimerRef.current);
      }

      contentSuccessTimerRef.current = window.setTimeout(() => {
        contentSuccessTimerRef.current = null;
        setContentSuccess('');
      }, 3000);
    } catch (requestError) {
      if (requestError.status === 401) {
        handleLogout();
        return;
      }

      setContentError(requestError.message || 'Unable to save site content');
    } finally {
      setContentSaving(false);
    }
  }

  function beginCreateProject() {
    setEditingProjectId('');
    setProjectForm(initialProjectForm);
    setProjectError('');
    setActivePanel('projects');
  }

  function beginEditProject(project) {
    setEditingProjectId(project._id);
    setProjectForm(toProjectForm(project));
    setProjectError('');
    setActivePanel('projects');
  }

  async function handleProjectSubmit(event) {
    event.preventDefault();
    setProjectSubmitting(true);
    setProjectError('');

    const payload = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      image: projectForm.image.trim(),
      technologies: projectForm.technologies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      githubLink: projectForm.githubLink.trim(),
      liveDemo: projectForm.liveDemo.trim(),
      category: projectForm.category.trim(),
      order: projectForm.order,
    };

    try {
      const path = editingProjectId ? `/admin/projects/${editingProjectId}` : '/admin/projects';
      const method = editingProjectId ? 'PUT' : 'POST';

      await apiRequest(path, {
        method,
        token,
        body: payload,
      });

      beginCreateProject();
      await refreshDashboard(token);
    } catch (requestError) {
      if (requestError.status === 401) {
        handleLogout();
        return;
      }

      const validationErrors = Array.isArray(requestError.details?.errors) ? requestError.details.errors : [];
      setProjectError(validationErrors.length ? validationErrors.join(' ') : requestError.message || 'Unable to save the project');
    } finally {
      setProjectSubmitting(false);
    }
  }

  async function handleDeleteProject(projectId) {
    const confirmDelete = window.confirm('Delete this project? This cannot be undone.');
    if (!confirmDelete) {
      return;
    }

    setBusyProjectId(projectId);
    setProjectError('');

    try {
      await apiRequest(`/admin/projects/${projectId}`, {
        method: 'DELETE',
        token,
      });

      if (editingProjectId === projectId) {
        beginCreateProject();
      }

      await refreshDashboard(token);
    } catch (requestError) {
      if (requestError.status === 401) {
        handleLogout();
        return;
      }

      setProjectError(requestError.message || 'Unable to delete the project');
    } finally {
      setBusyProjectId('');
    }
  }

  async function handleDeleteMessage(messageId) {
    const confirmDelete = window.confirm('Delete this message? This cannot be undone.');
    if (!confirmDelete) {
      return;
    }

    setBusyMessageId(messageId);
    setMessageError('');

    try {
      await apiRequest(`/admin/messages/${messageId}`, {
        method: 'DELETE',
        token,
      });

      await refreshDashboard(token);
    } catch (requestError) {
      if (requestError.status === 401) {
        handleLogout();
        return;
      }

      setMessageError(requestError.message || 'Unable to delete the message');
    } finally {
      setBusyMessageId('');
    }
  }

  const monthlyVisitors = useMemo(() => analytics?.monthlyVisitors || [], [analytics]);
  const recentVisitors = useMemo(() => analytics?.recentVisitors || [], [analytics]);
  const browserBreakdown = useMemo(() => buildBrowserBreakdown(recentVisitors), [recentVisitors]);
  const totalRecentBrowsers = browserBreakdown.reduce((sum, item) => sum + item.count, 0);
  const visibleMessages = useMemo(() => messages.slice(0, 4), [messages]);
  const visibleProjects = useMemo(() => projects, [projects]);
  const quickActions = useMemo(() => buildQuickActions(setActivePanel, beginCreateProject), []);
  const activeSectionLabel =
    sidebarGroups.flatMap((group) => group.items).find((item) => item.key === activePanel)?.label || 'Dashboard';
  function openWebsiteInNewTab() {
    // Keep the admin dashboard open and launch the public site in a separate tab.
    window.open(`${window.location.origin}/`, '_blank', 'noopener,noreferrer');
  }

  function navigateHome() {
    if (onNavigateHome) {
      onNavigateHome();
      return;
    }

    window.location.href = '/';
  }

  function renderDashboard() {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Visitors"
            value={statFormatter(analytics?.totalVisitors || 0)}
            helper="vs last sync"
            icon={FaChartLine}
            tone="violet"
          />
          <MetricCard
            title="Messages"
            value={statFormatter(messages.length)}
            helper="incoming inbox items"
            icon={FaEnvelope}
            tone="blue"
          />
          <MetricCard
            title="Projects"
            value={statFormatter(projects.length)}
            helper="portfolio projects"
            icon={FaFolderOpen}
            tone="emerald"
          />
          <MetricCard
            title="Recent Visits"
            value={statFormatter(recentVisitors.length)}
            helper="latest visitor rows"
            icon={FaUser}
            tone="amber"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <PanelCard
            title="Website Visitors"
            subtitle="Monthly visitor activity reported by the backend."
            actions={[
              <button
                key="chart-label"
                type="button"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300"
              >
                Last 12 months
              </button>,
            ]}
          >
            <SimpleLineChart data={monthlyVisitors} />
          </PanelCard>

          <PanelCard title="Browser Mix" subtitle="Recent visitors grouped by browser.">
            <TrafficBreakdown visitors={recentVisitors} />
          </PanelCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <PanelCard
            title="Recent Messages"
            subtitle="Latest contact form submissions."
            actions={[
              <button
                key="view-messages"
                type="button"
                onClick={() => setActivePanel('messages')}
                className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
              >
                View All
              </button>,
            ]}
          >
            <div className="grid gap-4">
              {visibleMessages.length ? (
                visibleMessages.map((message) => (
                  <div key={message._id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">{message.name}</p>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                            {message.status || 'new'}
                          </span>
                        </div>
                        <a href={`mailto:${message.email}`} className="text-sm text-cyan-300 transition hover:text-cyan-200">
                          {message.email}
                        </a>
                        <p className="text-sm font-medium text-slate-200">{message.subject}</p>
                        <p className="line-clamp-2 text-sm leading-6 text-slate-400">{message.message}</p>
                        <p className="text-xs text-slate-500">{formatDate(message.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-3xl border border-dashed border-white/10 px-5 py-8 text-sm text-slate-400">
                  No messages found.
                </p>
              )}
            </div>
          </PanelCard>

          <PanelCard
            title="Recent Projects"
            subtitle="Latest portfolio projects stored in the backend."
            actions={[
              <button
                key="view-projects"
                type="button"
                onClick={() => setActivePanel('projects')}
                className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
              >
                View All
              </button>,
            ]}
          >
            <div className="grid gap-4">
              {visibleProjects.length ? (
                visibleProjects.map((project) => (
                  <div key={project._id} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="h-16 w-20 overflow-hidden rounded-2xl border border-white/10 bg-[#070b15]">
                      {project.image ? (
                        <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-white">{project.title}</p>
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                          {project.liveDemo ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{project.category || 'Project'}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{project.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-3xl border border-dashed border-white/10 px-5 py-8 text-sm text-slate-400">
                  No projects have been added yet.
                </p>
              )}
            </div>
          </PanelCard>
        </div>

        <PanelCard title="Quick Actions" subtitle="Common updates are one click away.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-white/10"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{action.label}</span>
                    <span className="block text-xs text-slate-400">{action.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </PanelCard>
      </div>
    );
  }

  function renderProjectsPanel() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PanelCard
          title={editingProjectId ? 'Edit Project' : 'Create Project'}
          subtitle="Manage the project cards shown on the public portfolio."
          actions={[
            <AdminButton key="reset-project" type="button" variant="secondary" onClick={beginCreateProject}>
              Reset form
            </AdminButton>,
          ]}
        >
          <form className="grid gap-4" onSubmit={handleProjectSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Title"
                value={projectForm.title}
                onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Project title"
                required
              />
              <InputField
                label="Category"
                value={projectForm.category}
                onChange={(event) => setProjectForm((current) => ({ ...current, category: event.target.value }))}
                placeholder="Portfolio, ML, App"
                required
              />
            </div>

            <InputField
              label="Order Number"
              type="number"
              min="0"
              step="1"
              value={projectForm.order}
              onChange={(event) => setProjectForm((current) => ({ ...current, order: event.target.value }))}
              placeholder="1"
              required
            />

            <TextAreaField
              label="Description"
              value={projectForm.description}
              onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Short project description"
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Image URL"
                value={projectForm.image}
                onChange={(event) => setProjectForm((current) => ({ ...current, image: event.target.value }))}
                placeholder="https://..."
                required
              />
              <InputField
                label="Technologies"
                value={projectForm.technologies}
                onChange={(event) => setProjectForm((current) => ({ ...current, technologies: event.target.value }))}
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="GitHub link (optional)"
                value={projectForm.githubLink}
                onChange={(event) => setProjectForm((current) => ({ ...current, githubLink: event.target.value }))}
                placeholder="https://github.com/..."
              />
              <InputField
                label="Live demo (optional)"
                value={projectForm.liveDemo}
                onChange={(event) => setProjectForm((current) => ({ ...current, liveDemo: event.target.value }))}
                placeholder="https://..."
              />
            </div>

            {projectError ? (
              <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {projectError}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <AdminButton type="submit" icon={projectSubmitting ? FaSpinner : FaSave} disabled={projectSubmitting}>
                {projectSubmitting ? 'Saving...' : editingProjectId ? 'Update project' : 'Create project'}
              </AdminButton>
              {editingProjectId ? (
                <AdminButton type="button" variant="secondary" onClick={beginCreateProject}>
                  Cancel edit
                </AdminButton>
              ) : null}
            </div>
          </form>
        </PanelCard>

        <PanelCard title="Projects" subtitle="Edit or remove the current backend projects.">
          <div className="grid gap-4">
            {projects.length ? (
              projects.map((project) => (
                <article key={project._id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="h-20 w-24 overflow-hidden rounded-2xl border border-white/10 bg-[#070b15]">
                        {project.image ? <img src={project.image} alt={project.title} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
                            {project.category || 'Project'}
                          </span>
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                            Order {project.order ?? '—'}
                          </span>
                        </div>
                        <p className="max-w-3xl text-sm leading-7 text-slate-400">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {(project.technologies || []).map((technology) => (
                            <span
                              key={technology}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.githubLink ? (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400/40 hover:text-violet-200"
                        >
                          <FaGithub className="h-4 w-4" />
                          GitHub
                        </a>
                      ) : null}
                      {project.liveDemo ? (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400/40 hover:text-violet-200"
                        >
                          <FaExternalLinkAlt className="h-4 w-4" />
                          Live
                        </a>
                      ) : null}
                      <AdminButton type="button" variant="secondary" icon={FaEdit} onClick={() => beginEditProject(project)}>
                        Edit
                      </AdminButton>
                      <AdminButton
                        type="button"
                        variant="danger"
                        icon={FaTrash}
                        onClick={() => handleDeleteProject(project._id)}
                        disabled={busyProjectId === project._id}
                      >
                        {busyProjectId === project._id ? 'Deleting...' : 'Delete'}
                      </AdminButton>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-3xl border border-dashed border-white/10 px-5 py-8 text-sm text-slate-400">
                No projects have been added yet.
              </p>
            )}
          </div>
        </PanelCard>
      </div>
    );
  }

  function renderMessagesPanel() {
    return (
      <PanelCard title="Messages" subtitle="Review the contact form submissions from the public site.">
        {messageError ? (
          <p className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {messageError}
          </p>
        ) : null}

        <div className="grid gap-4">
          {messages.length ? (
            messages.map((message) => (
              <article key={message._id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">{message.name}</p>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                        {message.status || 'new'}
                      </span>
                    </div>
                    <a href={`mailto:${message.email}`} className="text-sm text-cyan-300 transition hover:text-cyan-200">
                      {message.email}
                    </a>
                    <p className="text-sm font-medium text-slate-200">{message.subject}</p>
                    <p className="max-h-32 overflow-hidden text-sm leading-6 text-slate-400">{message.message}</p>
                    <p className="text-xs text-slate-500">{formatDate(message.createdAt)}</p>
                  </div>

                  <AdminButton
                    type="button"
                    variant="danger"
                    icon={FaTrash}
                    onClick={() => handleDeleteMessage(message._id)}
                    disabled={busyMessageId === message._id}
                  >
                    {busyMessageId === message._id ? 'Deleting...' : 'Delete'}
                  </AdminButton>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-3xl border border-dashed border-white/10 px-5 py-8 text-sm text-slate-400">
              No messages found.
            </p>
          )}
        </div>
      </PanelCard>
    );
  }

  function renderSettingsPanel() {
    return (
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PanelCard title="Admin Profile" subtitle="Current session and dashboard controls.">
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-xl font-bold text-white">
              {getAvatarLabel(admin?.name)}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{admin?.name || 'Admin'}</p>
              <p className="text-sm text-slate-400">{admin?.email || 'admin'}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <AdminButton
              type="button"
              variant="secondary"
              icon={FaExternalLinkAlt}
              onClick={openWebsiteInNewTab}
            >
              Visit website
            </AdminButton>
            <AdminButton type="button" variant="secondary" icon={FaChartLine} onClick={() => refreshDashboard(token)}>
              Refresh dashboard
            </AdminButton>
            <AdminButton type="button" variant="danger" icon={FaSignOutAlt} onClick={handleLogout}>
              Logout
            </AdminButton>
          </div>
        </PanelCard>

        <PanelCard title="System Notes" subtitle="What this admin view is controlling.">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              title="Editable Sections"
              value="6"
              helper="Home, About, Skills, Certifications, Resume, Contact"
              icon={FaEdit}
              tone="violet"
            />
            <MetricCard
              title="Project Tools"
              value={statFormatter(projects.length)}
              helper="Create, edit, delete"
              icon={FaFolderOpen}
              tone="blue"
            />
            <MetricCard
              title="Inbox"
              value={statFormatter(messages.length)}
              helper="Contact messages"
              icon={FaEnvelope}
              tone="emerald"
            />
            <MetricCard
              title="Live Content"
              value={content ? 'Ready' : 'No'}
              helper="Loaded from backend"
              icon={FaCog}
              tone="amber"
            />
          </div>
        </PanelCard>
      </div>
    );
  }

  function renderActivePanel() {
    if (activePanel === 'dashboard') {
      return renderDashboard();
    }

    if (editablePanels.has(activePanel)) {
      return (
        <div className="max-w-5xl">
          <SiteContentEditor
            content={content}
            onChange={setContent}
            onSave={handleContentSave}
            saving={contentSaving}
            token={token}
            activeSection={activePanel}
            error={contentError}
            success={contentSuccess}
          />
        </div>
      );
    }

    if (activePanel === 'projects') {
      return renderProjectsPanel();
    }

    if (activePanel === 'messages') {
      return renderMessagesPanel();
    }

    if (activePanel === 'settings') {
      return renderSettingsPanel();
    }

    return renderDashboard();
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#040815] text-slate-100">
        <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-between gap-8 border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),_transparent_28%),#040815] p-6 lg:border-b-0 lg:border-r lg:p-10">
            <button
              type="button"
              onClick={navigateHome}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400/40 hover:text-violet-200"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to portfolio
            </button>

            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200">
                <FaUserShield className="h-4 w-4" />
                Admin portal
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Manage the portfolio from one dark dashboard.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-300">
                  Sign in with your admin account to update the visible homepage sections, review messages, and manage
                  projects without leaving the browser.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Security</p>
                  <p className="mt-2 text-lg font-semibold text-white">JWT login</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Content</p>
                  <p className="mt-2 text-lg font-semibold text-white">Home to contact</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Insights</p>
                  <p className="mt-2 text-lg font-semibold text-white">Visitors and inbox</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-[#09101d] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500 text-white">
                    <FaUserShield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Admin login</h2>
                    <p className="text-sm text-slate-400">Use the admin email and password from your backend .env file.</p>
                  </div>
                </div>

                <form className="mt-6 grid gap-4" onSubmit={handleLoginSubmit}>
                  <InputField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="admin@example.com"
                    required
                  />
                  <InputField
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Your admin password"
                    required
                  />

                  {loginError ? (
                    <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      {loginError}
                    </p>
                  ) : null}

                  <AdminButton type="submit" icon={loginSubmitting ? FaSpinner : FaSignOutAlt} disabled={loginSubmitting}>
                    {loginSubmitting ? 'Signing in...' : 'Sign in'}
                  </AdminButton>
                </form>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center p-6 lg:p-10">
            <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#09101d] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-violet-200">Dashboard preview</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Paviththiran Admin</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-white">
                  <FaBars className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <MetricCard title="Visitors" value="2,487" helper="Live dashboard example" icon={FaChartLine} tone="violet" />
                <MetricCard title="Messages" value="18" helper="Inbox example" icon={FaEnvelope} tone="blue" />
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[#0a1020] p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Section editor</p>
                    <p className="mt-2 text-lg font-semibold text-white">Home, About, Skills, Certifications, Resume, Contact</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Focus</p>
                    <p className="mt-2 text-lg font-semibold text-white">Important fields only</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#040815] text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[#050a14]/95 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-xl font-bold text-white shadow-[0_16px_40px_rgba(124,58,237,0.35)]">
                  PT
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{admin?.name || 'Paviththiran'}</p>
                  <p className="text-sm text-slate-400">Portfolio Admin</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto p-4">
              {sidebarGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{group.title}</p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <SidebarItem
                        key={item.key}
                        icon={item.icon}
                        label={item.label}
                        description={item.description}
                        active={activePanel === item.key}
                        onClick={() => setActivePanel(item.key)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t border-white/10 p-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#09101d] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500 text-white">
                    {getAvatarLabel(admin?.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{admin?.name || 'Admin'}</p>
                    <p className="truncate text-xs text-slate-400">{admin?.email || 'admin'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="ml-auto rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
                    aria-label="Logout"
                  >
                    <FaSignOutAlt className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="border-b border-white/10 bg-[#060b17]/90 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200">
                  <FaBars className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{activeSectionLabel}</p>
                  <h1 className="text-2xl font-semibold text-white">
                    {activePanel === 'dashboard'
                      ? 'Dashboard'
                      : editablePanels.has(activePanel)
                        ? 'Content Editor'
                        : activeSectionLabel}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <AdminButton type="button" variant="secondary" icon={FaExternalLinkAlt} onClick={openWebsiteInNewTab}>
                  Visit Website
                </AdminButton>

                <button
                  type="button"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-violet-400/40 hover:text-white"
                  aria-label="Notifications"
                >
                  <FaBell className="h-4 w-4" />
                  {messages.length ? (
                    <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {Math.min(messages.length, 9)}
                    </span>
                  ) : null}
                </button>

                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-sm font-bold text-white">
                    {getAvatarLabel(admin?.name)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-white">{admin?.name || 'Admin'}</p>
                    <p className="text-xs text-slate-400">Admin</p>
                  </div>
                  <span className="text-slate-400">˅</span>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {loading ? (
              <div className="mb-6 rounded-3xl border border-violet-400/20 bg-violet-500/10 px-5 py-4 text-sm text-violet-100">
                <span className="inline-flex items-center gap-2">
                  <FaSpinner className="h-4 w-4 animate-spin" />
                  Syncing dashboard data...
                </span>
              </div>
            ) : null}

            {error ? (
              <div className="mb-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            {renderActivePanel()}
          </div>
        </div>
      </div>
    </main>
  );
}
