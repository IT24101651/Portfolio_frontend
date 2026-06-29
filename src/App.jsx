import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AdminPage from './admin/AdminPage';
import { fetchEditableContent } from './admin/adminApi';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import SplashScreen from './components/layout/SplashScreen';
import BackToTopButton from './components/layout/BackToTopButton';
import AmbientBackground from './components/layout/AmbientBackground';
import AboutSection from './sections/AboutSection';
import CertificationsSection from './sections/CertificationsSection';
import ContactSection from './sections/ContactSection';
import GithubStatsSection from './sections/GithubStatsSection';
import HeroSection from './sections/HeroSection';
import ProjectsSection from './sections/ProjectsSection';
import ProjectsPage from './pages/ProjectsPage';
import SkillsSection from './sections/SkillsSection';
import { ThemeProvider } from './context/ThemeContext';
import { defaultEditableContent, normalizeEditableContent } from './data/editableContent';
import { useActiveSection } from './hooks/useActiveSection';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'certifications', 'contact'];

function useClientPathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname);
    }

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const { hash, pathname: currentPathname } = window.location;

    if (hash) {
      requestAnimationFrame(() => {
        const target = document.querySelector(hash);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    if (currentPathname === '/' || currentPathname.startsWith('/projects')) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname]);

  function navigate(nextPathname) {
    if (window.location.pathname === nextPathname) {
      return;
    }

    window.history.pushState({}, '', nextPathname);
    setPathname(window.location.pathname);
  }

  return { pathname, navigate };
}

function AppShell({ content, onViewAllProjects }) {
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />
      <Navbar activeSection={activeSection} />

      <main className="relative z-10">
        <HeroSection id="home" content={content?.home} resume={content?.resume} socialLinks={content?.socialLinks} />
        <AboutSection id="about" content={content?.about} />
        <SkillsSection id="skills" content={content?.skills} />
        <ProjectsSection id="projects" onViewAll={onViewAllProjects} />
        <CertificationsSection id="certifications" content={content?.certifications} />
        <GithubStatsSection />
        <ContactSection id="contact" content={content?.contact} socialLinks={content?.socialLinks} />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
}

export default function App() {
  const { pathname, navigate } = useClientPathname();
  const [editableContent, setEditableContent] = useState(defaultEditableContent);
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const isPublicRoute = window.location.pathname !== '/admin' && !window.location.pathname.startsWith('/admin/');
    try {
      return isPublicRoute && window.sessionStorage.getItem('pavi-splash-seen') !== '1';
    } catch {
      return isPublicRoute;
    }
  });
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isProjectsRoute = pathname === '/projects';

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const content = await fetchEditableContent();
        if (!cancelled && content) {
          setEditableContent(normalizeEditableContent(content));
        }
      } catch {
        if (!cancelled) {
          setEditableContent(defaultEditableContent);
        }
      }
    }

    if (!isAdminRoute) {
      loadContent();
    }

    return () => {
      cancelled = true;
    };
  }, [isAdminRoute]);

  useEffect(() => {
    if (!showSplash) {
      return;
    }

    try {
      window.sessionStorage.setItem('pavi-splash-seen', '1');
    } catch {
      // Ignore storage restrictions and still let the splash run once.
    }
  }, [showSplash]);

  const routeContent = isAdminRoute ? (
    <AdminPage onNavigateHome={() => navigate('/')} />
  ) : isProjectsRoute ? (
    <div className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />
      <Navbar activeSection={null} currentPathname={pathname} onNavigate={navigate} />

      <main className="relative z-10">
        <ProjectsPage onBackHome={() => navigate('/')} />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  ) : (
    <AppShell
      content={editableContent}
      onViewAllProjects={() => navigate('/projects')}
    />
  );

  return (
    <ThemeProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-[#02040b]">
        <AnimatePresence mode="wait">
          <motion.div
            key={isAdminRoute ? 'admin-route' : isProjectsRoute ? 'projects-route' : 'portfolio-route'}
            initial={{ opacity: 0 }}
            animate={{ opacity: showSplash ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={showSplash ? 'pointer-events-none select-none' : ''}
          >
            {routeContent}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showSplash ? (
            <SplashScreen key="splash-screen" onComplete={() => setShowSplash(false)} />
          ) : null}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
