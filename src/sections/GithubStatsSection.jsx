import AnimatedSection from '../components/ui/AnimatedSection';
import SectionHeading from '../components/ui/SectionHeading';
import StatCard from '../components/ui/StatCard';
import { githubStats } from '../data/siteData';
import { FaGithub } from 'react-icons/fa';

const graphRows = 7;
const graphCols = 12;

function getIntensity(index) {
  const pattern = [15, 30, 60, 100, 75, 45, 20];
  return pattern[index % pattern.length];
}

export default function GithubStatsSection() {
  const cells = Array.from({ length: graphRows * graphCols }, (_, index) => index);

  return (
    <AnimatedSection>
      <div className="section-shell">
        <SectionHeading
          eyebrow="GitHub Stats"
          title="A quick snapshot of repository activity and community reach."
          description="A compact snapshot that can later be wired to live GitHub API data if you want the numbers to update automatically."
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-panel premium-border rounded-[1.75rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/90">Contribution Graph</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                  Recent activity overview
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300">
                <FaGithub className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <div className="grid grid-cols-12 gap-2">
                {cells.map((cell) => {
                  const intensity = getIntensity(cell);
                  return (
                    <div
                      key={cell}
                      className="h-4 rounded-[4px]"
                      style={{
                        background:
                          intensity >= 90
                            ? 'rgba(34, 211, 238, 0.95)'
                            : intensity >= 60
                              ? 'rgba(59, 130, 246, 0.85)'
                              : intensity >= 30
                                ? 'rgba(168, 85, 247, 0.55)'
                                : 'rgba(148, 163, 184, 0.22)',
                        opacity: 0.25 + intensity / 120,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-300">
              This contribution graph can later be swapped with a live embed or a GitHub API-driven chart.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {githubStats.map((stat) => (
              <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
