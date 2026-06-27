import AnimatedSection from '../components/ui/AnimatedSection';
import SectionHeading from '../components/ui/SectionHeading';
import { FaFilePdf, FaCheckCircle } from 'react-icons/fa';
import { downloadResumePdf } from '../utils/resumePdf';
import { defaultEditableContent } from '../data/editableContent';

export default function ResumeSection({ id, content }) {
  const resume = { ...defaultEditableContent.resume, ...(content || {}) };

  return (
    <AnimatedSection id={id}>
      <div className="section-shell">
        <SectionHeading
          eyebrow={resume.eyebrow}
          title={resume.title}
          description={resume.description}
        />

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel premium-border rounded-[1.75rem] p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400/20 to-orange-500/20 text-red-300">
                <FaFilePdf className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/90">Resume Preview</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-slate-950 dark:text-white">{resume.previewTitle}</h3>
              </div>
            </div>

            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              {resume.summaryText}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {(resume.previewPoints || []).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FaCheckCircle className="mt-0.5 h-4 w-4 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={downloadResumePdf}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:-translate-y-0.5"
            >
              <FaFilePdf className="h-4 w-4" />
              {resume.buttonLabel}
            </button>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] glass-panel premium-border p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_24%)]" />

            <div className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/90">Preview</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">{resume.name}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300">
                  <FaFilePdf className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {(resume.bulletItems || []).map((point) => (
                  <div key={point} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-600 dark:text-slate-200">
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,15,30,0.9),rgba(17,24,39,0.6))] p-5">
                <p className="text-sm text-slate-400">{resume.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
