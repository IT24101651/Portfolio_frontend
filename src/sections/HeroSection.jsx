import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import profileAvatar from '../assets/profile-avatar.svg';
import AnimatedSection from '../components/ui/AnimatedSection';
import SocialLink from '../components/ui/SocialLink';
import TypingText from '../components/ui/TypingText';
import { defaultEditableContent, iconCatalog } from '../data/editableContent';
import { downloadResumePdf } from '../utils/resumePdf';

const floatingTech = [
  { label: 'React', top: '8%', left: '12%', delay: 0 },
  { label: 'Python', top: '16%', right: '10%', delay: 0.4 },
  { label: 'ML', bottom: '18%', left: '6%', delay: 0.8 },
  { label: 'Data', bottom: '10%', right: '12%', delay: 1.2 },
];

export default function HeroSection({ id, content, socialLinks }) {
  const [avatarSrc, setAvatarSrc] = useState('/profile-avatar.jpeg');
  const hero = { ...defaultEditableContent.home, ...(content || {}) };
  const links = Array.isArray(socialLinks) && socialLinks.length ? socialLinks : defaultEditableContent.socialLinks;

  useEffect(() => {
    setAvatarSrc(hero.avatarSrc || '/profile-avatar.jpeg');
  }, [hero.avatarSrc]);

  return (
    <AnimatedSection id={id} className="pt-32 sm:pt-36 lg:pt-40">
      <div className="section-shell">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-200">
              <span aria-hidden="true">{String.fromCodePoint(128075)}</span> {hero.greeting}
            </span>

            <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              {hero.name}
            </h1>

            <div className="mt-5 text-xl font-semibold text-slate-700 dark:text-slate-200 sm:text-2xl">
              <TypingText words={hero.roles || []} className="gradient-text" />
            </div>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              {hero.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={hero.primaryCtaHref || '#projects'}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:-translate-y-0.5"
              >
                {hero.primaryCtaLabel || 'View Projects'}
                <FaArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={downloadResumePdf}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-300 dark:text-slate-200"
              >
                {hero.secondaryCtaLabel || 'Download Resume'}
              </button>
              <a
                href={hero.tertiaryCtaHref || '#contact'}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300/40 hover:text-blue-500 dark:text-slate-200"
              >
                {hero.tertiaryCtaLabel || 'Contact Me'}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {links.map((link) => {
                const Icon = iconCatalog[link.iconKey] || iconCatalog.github;

                return <SocialLink key={link.label} href={link.href} icon={Icon} label={link.label} />;
              })}
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              {(hero.chips || []).map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-fuchsia-500/20 blur-2xl" />

            <div className="glass-panel premium-border relative overflow-hidden rounded-[2.5rem] p-5 sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_28%)]" />

              <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/35 p-5 backdrop-blur-sm dark:bg-slate-950/35">
                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,15,30,0.9),rgba(17,24,39,0.65))] p-6 sm:p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.18),transparent_20%)]" />
                  <div className="relative mx-auto grid aspect-square max-w-[24rem] place-items-center">
                    <div className="absolute inset-6 rounded-full border border-cyan-300/25 shadow-[0_0_90px_rgba(34,211,238,0.18)]" />
                    <div className="absolute inset-3 rounded-full border border-fuchsia-400/20 animate-floaty" />
                    <img
                      src={avatarSrc}
                      onError={() => setAvatarSrc(profileAvatar)}
                      alt={`${hero.name} profile photo`}
                      className="relative h-[20rem] w-[20rem] rounded-full object-cover shadow-2xl shadow-cyan-950/40"
                    />
                  </div>

                  {floatingTech.map((item) => (
                    <motion.div
                      key={item.label}
                      className="absolute rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md"
                      style={{ top: item.top, right: item.right, bottom: item.bottom, left: item.left }}
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
                    >
                      {item.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -right-2 top-8 hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md lg:block">
              {hero.availability}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
