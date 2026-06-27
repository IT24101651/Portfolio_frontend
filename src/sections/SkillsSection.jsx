import AnimatedSection from '../components/ui/AnimatedSection';
import SectionHeading from '../components/ui/SectionHeading';
import SkillGroupCard from '../components/ui/SkillGroupCard';
import { defaultEditableContent, iconCatalog } from '../data/editableContent';

export default function SkillsSection({ id, content }) {
  const skillsContent = { ...defaultEditableContent.skills, ...(content || {}) };
  const groups =
    Array.isArray(skillsContent.groups) && skillsContent.groups.length
      ? skillsContent.groups
      : defaultEditableContent.skills.groups;

  return (
    <AnimatedSection id={id}>
      <div className="section-shell">
        <SectionHeading
          eyebrow={skillsContent.eyebrow}
          title={skillsContent.title}
          description={skillsContent.description}
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const resolvedGroup = {
              ...group,
              icon: iconCatalog[group.iconKey] || iconCatalog.react,
              skills: (group.skills || []).map((skill) => ({
                ...skill,
                icon: iconCatalog[skill.iconKey] || iconCatalog.python,
              })),
            };

            return <SkillGroupCard key={group.title} group={resolvedGroup} />;
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
