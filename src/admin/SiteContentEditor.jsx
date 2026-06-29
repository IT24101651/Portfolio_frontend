import profileAvatar from '../assets/profile-avatar.svg';
import { getSharedSocialLinks } from '../data/editableContent';
import { uploadResumeFile } from './adminApi';

function Field({ label, helper, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200">
      <span className="text-slate-300">{label}</span>
      <input
        {...props}
        className={`rounded-2xl border border-white/10 bg-[#0d1220] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 ${props.className || ''}`.trim()}
      />
      {helper ? <span className="text-xs font-normal text-slate-500">{helper}</span> : null}
    </label>
  );
}

function TextArea({ label, helper, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200">
      <span className="text-slate-300">{label}</span>
      <textarea
        {...props}
        className={`min-h-28 rounded-2xl border border-white/10 bg-[#0d1220] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 ${props.className || ''}`.trim()}
      />
      {helper ? <span className="text-xs font-normal text-slate-500">{helper}</span> : null}
    </label>
  );
}

function parseLines(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(values) {
  return Array.isArray(values) ? values.join('\n') : '';
}

const AVATAR_MAX_DIMENSION = 1200;
const AVATAR_EXPORT_TYPE = 'image/webp';
const AVATAR_EXPORT_QUALITY = 0.92;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result || ''));
    };
    reader.onerror = () => {
      reject(reader.error || new Error('Unable to read image file'));
    };
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load image preview'));
    image.src = src;
  });
}

async function compressAvatarFile(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, AVATAR_MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Unable to prepare image for saving');
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL(AVATAR_EXPORT_TYPE, AVATAR_EXPORT_QUALITY);
}

function SaveButton({ saving, onSave }) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center justify-center rounded-full border border-violet-400/30 bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving ? 'Saving...' : 'Save content'}
    </button>
  );
}

function SectionCard({ title, description, children, action }) {
  return (
    <section className="rounded-[1.75rem] border border-white/8 bg-[#090f1a] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p> : null}
        </div>
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export default function SiteContentEditor({
  content,
  onChange,
  onSave,
  saving,
  token = '',
  activeSection = 'home',
  error = '',
  success = '',
}) {
  const safeContent = content || {};
  const home = safeContent.home || {};
  const about = safeContent.about || {};
  const skills = safeContent.skills || {};
  const certifications = safeContent.certifications || {};
  const resume = safeContent.resume || {};
  const contact = safeContent.contact || {};

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      window.alert('Please choose an image file for the avatar.');
      return;
    }

    try {
      const avatarSrc = await compressAvatarFile(file);
      updateSection('home', {
        avatarSrc,
        avatarObjectPosition: home.avatarObjectPosition || 'center center',
      });
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to process that image.');
    }
  }

  async function handleResumeUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      window.alert('Please choose a PDF file for the resume.');
      return;
    }

    try {
      const resumeFileDataUrl = await readFileAsDataUrl(file);
      const uploaded = await uploadResumeFile(token, file.name, resumeFileDataUrl);
      updateSection('resume', {
        resumeFileName: uploaded?.resumeFileName || file.name,
        resumeFileUrl: uploaded?.resumeFileUrl || '',
        resumeFileDataUrl: '',
      });
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to upload that resume file.');
    }
  }

  function updateSection(section, patch) {
    onChange({
      ...safeContent,
      [section]: {
        ...(safeContent[section] || {}),
        ...patch,
      },
    });
  }

  function updateAboutCard(index, patch) {
    updateSection('about', {
      cards: (about.cards || []).map((card, cardIndex) => (cardIndex === index ? { ...card, ...patch } : card)),
    });
  }

  function updateSkillGroup(index, patch) {
    updateSection('skills', {
      groups: (skills.groups || []).map((group, groupIndex) => (groupIndex === index ? { ...group, ...patch } : group)),
    });
  }

  function updateCertification(index, patch) {
    updateSection('certifications', {
      items: (certifications.items || []).map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    });
  }

  function addCertification() {
    updateSection('certifications', {
      items: [...(certifications.items || []), { title: '', issuer: '', year: '', link: '' }],
    });
  }

  function removeCertification(index) {
    updateSection('certifications', {
      items: (certifications.items || []).filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function updateContactDetail(index, patch) {
    const directDetails = (contact.directDetails || []).map((detail, detailIndex) =>
      detailIndex === index ? { ...detail, ...patch } : detail,
    );

    onChange({
      ...safeContent,
      contact: {
        ...(safeContent.contact || {}),
        directDetails,
      },
      socialLinks: getSharedSocialLinks(directDetails, safeContent.socialLinks || []),
    });
  }

  function renderHome() {
    return (
      <SectionCard
        title="Home"
        description="Update the hero copy, call-to-action buttons, and the short chips visitors see first."
        action={<SaveButton saving={saving} onSave={onSave} />}
      >
        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Greeting"
            value={home.greeting || ''}
            onChange={(event) => updateSection('home', { greeting: event.target.value })}
            placeholder="Hello, I'm"
          />
          <Field
            label="Name"
            value={home.name || ''}
            onChange={(event) => updateSection('home', { name: event.target.value })}
            placeholder="Your name"
          />
        </div>

        <div className="mt-4 grid gap-4">
          <TextArea
            label="Roles"
            value={joinLines(home.roles)}
            onChange={(event) => updateSection('home', { roles: parseLines(event.target.value) })}
            helper="One role per line."
            placeholder="Data Science Undergraduate"
          />
          <TextArea
            label="Intro"
            value={home.intro || ''}
            onChange={(event) => updateSection('home', { intro: event.target.value })}
            placeholder="Short hero introduction"
          />
          <TextArea
            label="Chips"
            value={joinLines(home.chips)}
            onChange={(event) => updateSection('home', { chips: parseLines(event.target.value) })}
            helper="One chip per line."
            placeholder="Data Science"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field
            label="Primary Button"
            value={home.primaryCtaLabel || ''}
            onChange={(event) => updateSection('home', { primaryCtaLabel: event.target.value })}
            placeholder="View Projects"
          />
          <Field
            label="Primary Link"
            value={home.primaryCtaHref || ''}
            onChange={(event) => updateSection('home', { primaryCtaHref: event.target.value })}
            placeholder="#projects"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field
            label="Resume Button"
            value={home.secondaryCtaLabel || ''}
            onChange={(event) => updateSection('home', { secondaryCtaLabel: event.target.value })}
            placeholder="Download Resume"
          />
          <Field
            label="Contact Button"
            value={home.tertiaryCtaLabel || ''}
            onChange={(event) => updateSection('home', { tertiaryCtaLabel: event.target.value })}
            placeholder="Contact Me"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field
            label="Contact Link"
            value={home.tertiaryCtaHref || ''}
            onChange={(event) => updateSection('home', { tertiaryCtaHref: event.target.value })}
            placeholder="#contact"
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-200">
              <span className="text-slate-300">Avatar photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="rounded-2xl border border-white/10 bg-[#0d1220] px-4 py-3 text-slate-100 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
              />
              <span className="text-xs font-normal text-slate-500">
                Choose a local image from your computer. It will be resized before saving to keep the content light.
              </span>
            </label>

            <Field
              label="Avatar crop focus"
              value={home.avatarObjectPosition || ''}
              onChange={(event) => updateSection('home', { avatarObjectPosition: event.target.value })}
              placeholder="center center"
              helper="Manual crop control for the round photo. Examples: center, center top, 50% 20%."
            />
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-[#0d1220] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Current avatar</p>
              <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Preview</span>
            </div>
            <div className="mt-4 grid place-items-center">
              <img
                src={home.avatarSrc || '/profile-avatar.jpeg'}
                onError={(event) => {
                  event.currentTarget.src = profileAvatar;
                }}
                alt="Avatar preview"
                style={{ objectPosition: home.avatarObjectPosition || 'center center' }}
                className="h-48 w-48 rounded-full object-cover shadow-2xl shadow-cyan-950/40"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Field
            label="Availability"
            value={home.availability || ''}
            onChange={(event) => updateSection('home', { availability: event.target.value })}
            placeholder="Available for internships and collaborations"
          />
        </div>
      </SectionCard>
    );
  }

  function renderAbout() {
    return (
      <SectionCard
        title="About"
        description="Edit the main about copy, the summary block, and the existing feature cards."
        action={<SaveButton saving={saving} onSave={onSave} />}
      >
        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={about.eyebrow || ''}
            onChange={(event) => updateSection('about', { eyebrow: event.target.value })}
            placeholder="About Me"
          />
          <Field
            label="Section Title"
            value={about.title || ''}
            onChange={(event) => updateSection('about', { title: event.target.value })}
            placeholder="A focused undergraduate..."
          />
        </div>

        <div className="mt-4 grid gap-4">
          <TextArea
            label="Description"
            value={about.description || ''}
            onChange={(event) => updateSection('about', { description: event.target.value })}
            placeholder="Short about description"
          />
          <Field
            label="Summary Title"
            value={about.summaryTitle || ''}
            onChange={(event) => updateSection('about', { summaryTitle: event.target.value })}
            placeholder="Curious, practical, and always building."
          />
          <TextArea
            label="Summary Text"
            value={about.summaryText || ''}
            onChange={(event) => updateSection('about', { summaryText: event.target.value })}
            placeholder="Longer summary text"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field
            label="Academic Status"
            value={about.academicStatus || ''}
            onChange={(event) => updateSection('about', { academicStatus: event.target.value })}
            placeholder="Year 2 Semester 2 Undergraduate"
          />
          <Field
            label="Career Goal"
            value={about.careerGoal || ''}
            onChange={(event) => updateSection('about', { careerGoal: event.target.value })}
            placeholder="Full Stack + ML Product Engineer"
          />
        </div>

        <div className="mt-4 grid gap-4">
          {(about.cards || []).map((card, index) => (
            <div key={`${card.title || 'card'}-${index}`} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300/90">
                Card {index + 1}
              </p>
              <Field
                label="Title"
                value={card.title || ''}
                onChange={(event) => updateAboutCard(index, { title: event.target.value })}
                placeholder="Card title"
              />
              <div className="mt-4">
                <TextArea
                  label="Description"
                  value={card.description || ''}
                  onChange={(event) => updateAboutCard(index, { description: event.target.value })}
                  placeholder="Card description"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  function renderSkills() {
    return (
      <SectionCard
        title="Skills"
        description="Update the visible skill group titles and skill names only."
        action={<SaveButton saving={saving} onSave={onSave} />}
      >
        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={skills.eyebrow || ''}
            onChange={(event) => updateSection('skills', { eyebrow: event.target.value })}
            placeholder="Skills"
          />
          <Field
            label="Section Title"
            value={skills.title || ''}
            onChange={(event) => updateSection('skills', { title: event.target.value })}
            placeholder="A balanced toolkit..."
          />
        </div>

        <div className="mt-4">
          <TextArea
            label="Description"
            value={skills.description || ''}
            onChange={(event) => updateSection('skills', { description: event.target.value })}
            placeholder="Short skills description"
          />
        </div>

        <div className="mt-4 grid gap-4">
          {(skills.groups || []).map((group, groupIndex) => (
            <div key={`${group.title || 'group'}-${groupIndex}`} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300/90">
                Group {groupIndex + 1}
              </p>
              <Field
                label="Title"
                value={group.title || ''}
                onChange={(event) => updateSkillGroup(groupIndex, { title: event.target.value })}
                placeholder="Frontend"
              />
              <div className="mt-4">
                <TextArea
                  label="Skills"
                  value={(group.skills || []).map((skill) => skill.name).join('\n')}
                  onChange={(event) => {
                    const nextSkills = parseLines(event.target.value).map((line) => ({
                      name: line.trim(),
                    }));

                    updateSkillGroup(groupIndex, { skills: nextSkills });
                  }}
                  helper="One skill per line."
                  placeholder="React"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  function renderCertifications() {
    return (
      <SectionCard
        title="Certifications"
        description="Create, update, and delete the certification cards shown on the portfolio."
        action={
          <div className="flex flex-wrap gap-2">
            <SaveButton saving={saving} onSave={onSave} />
            <button
              type="button"
              onClick={addCertification}
              className="inline-flex items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/40 hover:bg-emerald-500/20"
            >
              Add Certification
            </button>
          </div>
        }
      >
        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        {(certifications.items || []).length ? (
          <div className="grid gap-4">
            {(certifications.items || []).map((item, index) => (
              <div key={`${item.title || 'certificate'}-${index}`} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300/90">
                      Certificate {index + 1}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">Edit the details that appear on the public card.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-400/40 hover:bg-rose-500/15"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Title"
                    value={item.title || ''}
                    onChange={(event) => updateCertification(index, { title: event.target.value })}
                    placeholder="Python for Beginners"
                  />
                  <Field
                    label="Issuer"
                    value={item.issuer || ''}
                    onChange={(event) => updateCertification(index, { issuer: event.target.value })}
                    placeholder="Introductory Programming"
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Year"
                    value={item.year || ''}
                    onChange={(event) => updateCertification(index, { year: event.target.value })}
                    placeholder="2024"
                  />
                  <Field
                    label="Link"
                    value={item.link || ''}
                    onChange={(event) => updateCertification(index, { link: event.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
            No certifications yet. Add one to create the first public card.
          </div>
        )}
      </SectionCard>
    );
  }

  function renderResume() {
    return (
      <SectionCard
        title="Resume"
        description="Edit the resume heading, preview text, download button, and bullet points."
        action={<SaveButton saving={saving} onSave={onSave} />}
      >
        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={resume.eyebrow || ''}
            onChange={(event) => updateSection('resume', { eyebrow: event.target.value })}
            placeholder="Resume"
          />
          <Field
            label="Section Title"
            value={resume.title || ''}
            onChange={(event) => updateSection('resume', { title: event.target.value })}
            placeholder="A concise resume preview..."
          />
        </div>

        <div className="mt-4 grid gap-4">
          <TextArea
            label="Description"
            value={resume.description || ''}
            onChange={(event) => updateSection('resume', { description: event.target.value })}
            placeholder="Short resume description"
          />
          <Field
            label="Preview Title"
            value={resume.previewTitle || ''}
            onChange={(event) => updateSection('resume', { previewTitle: event.target.value })}
            placeholder="Professional snapshot"
          />
          <TextArea
            label="Summary Text"
            value={resume.summaryText || ''}
            onChange={(event) => updateSection('resume', { summaryText: event.target.value })}
            placeholder="Preview summary text"
          />
          <Field
            label="Button Label"
            value={resume.buttonLabel || ''}
            onChange={(event) => updateSection('resume', { buttonLabel: event.target.value })}
            placeholder="Download Resume"
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            <span className="text-slate-300">Resume PDF</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeUpload}
              className="rounded-2xl border border-white/10 bg-[#0d1220] px-4 py-3 text-slate-100 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            />
            <span className="text-xs font-normal text-slate-500">
              Choose a PDF from your computer. It will be stored with the site content and used by the Resume buttons.
            </span>
          </label>

          <div className="rounded-[1.5rem] border border-white/10 bg-[#0d1220] p-4">
            <p className="text-sm font-semibold text-white">Selected file</p>
            <p className="mt-3 break-all text-sm text-slate-300">{resume.resumeFileName || 'No custom resume selected'}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextArea
            label="Preview Points"
            value={joinLines(resume.previewPoints)}
            onChange={(event) => updateSection('resume', { previewPoints: parseLines(event.target.value) })}
            helper="One bullet per line."
            placeholder="Focused on machine learning and full stack development"
          />
          <TextArea
            label="Resume Bullets"
            value={joinLines(resume.bulletItems)}
            onChange={(event) => updateSection('resume', { bulletItems: parseLines(event.target.value) })}
            helper="One bullet per line."
            placeholder="React, Tailwind, Framer Motion"
          />
        </div>
      </SectionCard>
    );
  }

  function renderContact() {
    return (
      <SectionCard
        title="Contact"
        description="Update the contact heading, form copy, and the details shown on the page."
        action={<SaveButton saving={saving} onSave={onSave} />}
      >
        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={contact.eyebrow || ''}
            onChange={(event) => updateSection('contact', { eyebrow: event.target.value })}
            placeholder="Contact"
          />
          <Field
            label="Section Title"
            value={contact.title || ''}
            onChange={(event) => updateSection('contact', { title: event.target.value })}
            placeholder="Let's build something..."
          />
        </div>

        <div className="mt-4 grid gap-4">
          <TextArea
            label="Description"
            value={contact.description || ''}
            onChange={(event) => updateSection('contact', { description: event.target.value })}
            placeholder="Short contact description"
          />
          <Field
            label="Form Title"
            value={contact.formTitle || ''}
            onChange={(event) => updateSection('contact', { formTitle: event.target.value })}
            placeholder="Modern contact form"
          />
          <TextArea
            label="Form Description"
            value={contact.formDescription || ''}
            onChange={(event) => updateSection('contact', { formDescription: event.target.value })}
            placeholder="Form helper text"
          />
        </div>

        <div className="mt-4 grid gap-4">
          <p className="text-xs leading-6 text-slate-500">
            GitHub, LinkedIn, and Email entries here also power the shared social links shown on Home and Contact.
          </p>
          {(contact.directDetails || []).map((detail, index) => (
            <div key={`${detail.label || 'detail'}-${index}`} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300/90">
                {detail.label || `Detail ${index + 1}`}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Value"
                  value={detail.value || ''}
                  onChange={(event) => updateContactDetail(index, { value: event.target.value })}
                  placeholder="Visible text"
                />
                <Field
                  label="Link"
                  value={detail.href || ''}
                  onChange={(event) => updateContactDetail(index, { href: event.target.value })}
                  placeholder="mailto:..."
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  switch (activeSection) {
    case 'about':
      return renderAbout();
    case 'skills':
      return renderSkills();
    case 'certifications':
      return renderCertifications();
    case 'resume':
      return renderResume();
    case 'contact':
      return renderContact();
    case 'home':
    default:
      return renderHome();
  }
}
