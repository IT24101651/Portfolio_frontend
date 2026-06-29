import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import AnimatedSection from '../components/ui/AnimatedSection';
import SectionHeading from '../components/ui/SectionHeading';
import SocialLink from '../components/ui/SocialLink';
import { defaultEditableContent, iconCatalog } from '../data/editableContent';
import { getLinkRel, getLinkTarget, normalizeLinkHref } from '../utils/linkHref';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactSection({ id, content, socialLinks }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const contact = { ...defaultEditableContent.contact, ...(content || {}) };
  const links = Array.isArray(socialLinks) && socialLinks.length ? socialLinks : defaultEditableContent.socialLinks;

  useEffect(() => {
    if (!submitted) return undefined;
    const timeout = window.setTimeout(() => setSubmitted(false), 4200);
    return () => window.clearTimeout(timeout);
  }, [submitted]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!form.subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!form.message.trim()) nextErrors.message = 'Message is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    setSubmitted(true);
    setForm(initialForm);
  }

  return (
    <AnimatedSection id={id}>
      <div className="section-shell">
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          description={contact.description}
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="glass-panel premium-border rounded-[1.75rem] p-6">
              <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">Direct details</h3>
              <div className="mt-6 space-y-4">
                {(contact.directDetails || []).map((item) => {
                  const Icon = iconCatalog[item.iconKey] || iconCatalog.email;
                  const href = normalizeLinkHref(item.href, item.label);

                  return (
                    <a
                      key={item.label}
                      href={href}
                      target={getLinkTarget(href)}
                      rel={getLinkRel(href)}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/30"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{item.label}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{item.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel premium-border rounded-[1.75rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/90">Social Links</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {links.map((link) => {
                  const Icon = iconCatalog[link.iconKey] || iconCatalog.github;

                  return <SocialLink key={link.label} href={link.href} icon={Icon} label={link.label} />;
                })}
              </div>
            </div>
          </div>

          <div className="glass-panel premium-border rounded-[1.75rem] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 text-cyan-300">
                <FaPaperPlane className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/90">Send a message</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-slate-950 dark:text-white">{contact.formTitle}</h3>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                aria-live="polite"
                className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-200"
              >
                {contact.formDescription}
              </motion.div>
            ) : null}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Your name"
                />
                <Field
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                  type="email"
                />
              </div>

              <Field
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                error={errors.subject}
                placeholder="Project collaboration"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={form.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  placeholder="Tell me about your idea, internship opportunity, or collaboration."
                  className={`w-full rounded-3xl border bg-white/5 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 dark:bg-white/5 dark:text-white ${
                    errors.message ? 'border-red-400/60' : 'border-white/10'
                  }`}
                />
                {errors.message ? (
                  <p id="message-error" className="mt-2 text-xs font-medium text-red-300">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:-translate-y-0.5"
              >
                <FaPaperPlane className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function Field({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor={props.name}>
        {label}
      </label>
      <input
        {...props}
        id={props.name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${props.name}-error` : undefined}
        className={`w-full rounded-3xl border bg-white/5 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 dark:bg-white/5 dark:text-white ${
          error ? 'border-red-400/60' : 'border-white/10'
        }`}
      />
      {error ? (
        <p id={`${props.name}-error`} className="mt-2 text-xs font-medium text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
