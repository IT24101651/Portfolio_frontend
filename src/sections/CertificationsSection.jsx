import AnimatedSection from '../components/ui/AnimatedSection';
import CertificateCard from '../components/ui/CertificateCard';
import SectionHeading from '../components/ui/SectionHeading';
import { certificates } from '../data/siteData';

export default function CertificationsSection() {
  return (
    <AnimatedSection>
      <div className="section-shell">
        <SectionHeading
          eyebrow="Certifications"
          title="Learning milestones that show steady technical growth."
          description="These certificates can be connected to verified course completion pages or uploaded proof files."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.title} certificate={certificate} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
