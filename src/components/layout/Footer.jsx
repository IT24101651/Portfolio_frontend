import { FaArrowUp } from 'react-icons/fa';
import { socialLinks } from '../../data/siteData';
import SocialLink from '../ui/SocialLink';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-10">
      <div className="section-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-slate-950 dark:text-white">Kumarasooriyar Paviththiran</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Data Science undergraduate building intelligent, scalable, and polished digital experiences.
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            © 2026 Kumarasooriyar Paviththiran. All Rights Reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {socialLinks.map((link) => (
            <SocialLink key={link.label} href={link.href} icon={link.icon} label={link.label} />
          ))}
          <a
            href="#home"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-300 dark:text-slate-200"
          >
            <FaArrowUp className="h-4 w-4" />
            Top
          </a>
        </div>
      </div>
    </footer>
  );
}
