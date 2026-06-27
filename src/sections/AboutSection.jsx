import { FaBrain } from 'react-icons/fa';
import AnimatedSection from '../components/ui/AnimatedSection';
import InfoCard from '../components/ui/InfoCard';
import SectionHeading from '../components/ui/SectionHeading';
import { defaultEditableContent, iconCatalog } from '../data/editableContent';

export default function AboutSection({ id, content }) {
  const about = { ...defaultEditableContent.about, ...(content || {}) };
  const cards = Array.isArray(about.cards) && about.cards.length ? about.cards : defaultEditableContent.about.cards;

  return (
    <AnimatedSection id={id}>
      <div className="section-shell">
        <SectionHeading
          eyebrow={about.eyebrow}
          title={about.title}
          description={about.description}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="glass-panel premium-border rounded-[1.75rem] p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300">
                <FaBrain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/90">Professional Summary</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-slate-950 dark:text-white">{about.summaryTitle}</h3>
              </div>
            </div>

            <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">
              {about.summaryText}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Academic Status</p>
                <p className="mt-2 font-display text-xl font-semibold text-slate-950 dark:text-white">{about.academicStatus}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Career Goal</p>
                <p className="mt-2 font-display text-xl font-semibold text-slate-950 dark:text-white">{about.careerGoal}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card, index) => {
              const Icon = iconCatalog[card.iconKey] || FaBrain;

              return (
              <InfoCard
                key={card.title}
                icon={Icon}
                title={card.title}
                description={card.description}
                eyebrow={`0${index + 1}`}
              />
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
