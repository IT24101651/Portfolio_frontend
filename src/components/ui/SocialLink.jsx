export default function SocialLink({ href, icon: Icon, label, className = '' }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') || href.startsWith('tel:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') || href.startsWith('tel:') ? undefined : 'noreferrer'}
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:text-cyan-300 ${className}`}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

