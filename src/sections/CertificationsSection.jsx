import AnimatedSection from '../components/ui/AnimatedSection';
import CertificateCard from '../components/ui/CertificateCard';
import SectionHeading from '../components/ui/SectionHeading';
import { defaultEditableContent } from '../data/editableContent';

export default function CertificationsSection({ id, content }) {
  const certifications = { ...defaultEditableContent.certifications, ...(content || {}) };
  const certificates =
    Array.isArray(certifications.items)
      ? certifications.items
      : defaultEditableContent.certifications.items;

  return (
    <AnimatedSection id={id}>
      <div className="section-shell">
        <SectionHeading
          eyebrow={certifications.eyebrow}
          title={certifications.title}
          description={certifications.description}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {certificates.length ? (
            certificates.map((certificate, index) => (
              <CertificateCard key={`${certificate.title || 'certificate'}-${index}`} certificate={certificate} />
            ))
          ) : (
            <div className="glass-panel premium-border rounded-[1.75rem] p-8 text-center text-sm text-slate-500 dark:text-slate-400 md:col-span-2 xl:col-span-4">
              No certifications have been added yet.
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
