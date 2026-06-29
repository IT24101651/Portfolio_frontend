import { getLinkRel, getLinkTarget, normalizeLinkHref } from '../../utils/linkHref';

export default function SocialLink({ href, icon: Icon, label, className = '' }) {
  const linkHref = normalizeLinkHref(href, label);

  return (
    <a
      href={linkHref}
      target={getLinkTarget(linkHref)}
      rel={getLinkRel(linkHref)}
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:text-cyan-300 ${className}`}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
