import { motion } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';

export default function CertificateCard({ certificate }) {
  const title = certificate.title || 'Untitled Certificate';
  const issuer = certificate.issuer || 'Issuer not added';
  const year = certificate.year || 'Year not set';
  const hasLink = Boolean(certificate.link);

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      className="glass-panel premium-border overflow-hidden rounded-[1.75rem]"
    >
      <div className="relative h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-5 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.24),transparent_32%)]" />
        <div className="relative flex h-full items-center justify-between rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/90">Certificate</p>
            <h3 className="mt-3 max-w-[14rem] font-display text-xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{issuer}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
            <FaCertificate className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
          <span>{year}</span>
          <span>Verified learning</span>
        </div>
        {hasLink ? (
          <a
            href={certificate.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-300 dark:text-slate-200"
          >
            <FaExternalLinkAlt className="h-4 w-4" />
            View Certificate
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-400 dark:text-slate-500">
            Certificate link not added
          </span>
        )}
      </div>
    </motion.article>
  );
}
