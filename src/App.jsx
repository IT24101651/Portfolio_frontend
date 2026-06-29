import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AdminPage from './admin/AdminPage';
import { fetchEditableContent } from './admin/adminApi';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import BackToTopButton from './components/layout/BackToTopButton';
import AmbientBackground from './components/layout/AmbientBackground';
import AboutSection from './sections/AboutSection';
import CertificationsSection from './sections/CertificationsSection';
import ContactSection from './sections/ContactSection';
import GithubStatsSection from './sections/GithubStatsSection';
import HeroSection from './sections/HeroSection';
import ProjectsSection from './sections/ProjectsSection';
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

  function navigate(nextPathname) {
    if (window.location.pathname === nextPathname) {
      return;
    }

    window.history.pushState({}, '', nextPathname);
    setPathname(nextPathname);
  }

  return { pathname, navigate };
}

function AppShell({ content }) {
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />
      <Navbar activeSection={activeSection} />

      <main className="relative z-10">
        <HeroSection id="home" content={content?.home} resume={content?.resume} socialLinks={content?.socialLinks} />
        <AboutSection id="about" content={content?.about} />
        <SkillsSection id="skills" content={content?.skills} />
        <ProjectsSection id="projects" />
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
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

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

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={isAdminRoute ? 'admin-route' : 'portfolio-route'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isAdminRoute ? (
            <AdminPage onNavigateHome={() => navigate('/')} />
          ) : (
            <AppShell
              content={editableContent}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
}
