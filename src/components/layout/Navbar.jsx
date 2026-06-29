import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { navItems } from '../../data/siteData';
import ThemeToggle from '../ui/ThemeToggle';

function resolveNavHref(itemHref) {
  return itemHref === '#home' ? '/' : `/${itemHref}`;
}

export default function Navbar({ activeSection, currentPathname = '/', onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHomeRoute = currentPathname === '/';

  function handleNavClick(itemHref, event) {
    if (isHomeRoute || !onNavigate) {
      setMenuOpen(false);
      return;
    }

    event.preventDefault();
    onNavigate(resolveNavHref(itemHref));
    setMenuOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 transform-gpu"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="section-shell pt-4">
        <nav className="glass-panel premium-border rounded-full px-4 py-3 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <a
              href={isHomeRoute ? '#home' : '/'}
              onClick={(event) => handleNavClick('#home', event)}
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 font-display text-sm font-bold text-slate-950 shadow-glow">
                KP
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-sm font-semibold text-slate-950 dark:text-white">Kumarasooriyar Paviththiran</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">Data Science Undergraduate</p>
              </div>
            </a>

            <div className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => {
                const active = activeSection === item.href.replace('#', '');

                return (
                  <a
                    key={item.label}
                    href={isHomeRoute ? item.href : resolveNavHref(item.href)}
                    onClick={(event) => handleNavClick(item.href, event)}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-cyan-300/15 text-cyan-300'
                        : 'text-slate-600 hover:bg-white/5 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                aria-label="Toggle mobile navigation"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-300/40 hover:text-cyan-300 lg:hidden"
              >
                {menuOpen ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="section-shell transform-gpu lg:hidden"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="glass-panel premium-border mt-3 rounded-3xl p-3">
              <div className="grid gap-2">
                {navItems.map((item) => {
                  const active = activeSection === item.href.replace('#', '');

                  return (
                    <a
                      key={item.label}
                      href={isHomeRoute ? item.href : resolveNavHref(item.href)}
                      onClick={(event) => handleNavClick(item.href, event)}
                      aria-current={active ? 'page' : undefined}
                      className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        active ? 'bg-cyan-300/15 text-cyan-300' : 'text-slate-700 hover:bg-white/5 dark:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
