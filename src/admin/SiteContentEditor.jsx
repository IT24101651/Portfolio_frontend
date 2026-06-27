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
  activeSection = 'home',
  error = '',
  success = '',
}) {
  const safeContent = content || {};
  const home = safeContent.home || {};
  const about = safeContent.about || {};
  const skills = safeContent.skills || {};
  const resume = safeContent.resume || {};
  const contact = safeContent.contact || {};

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

  function updateContactDetail(index, patch) {
    updateSection('contact', {
      directDetails: (contact.directDetails || []).map((detail, detailIndex) =>
        detailIndex === index ? { ...detail, ...patch } : detail,
      ),
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
          <Field
            label="Avatar URL"
            value={home.avatarSrc || ''}
            onChange={(event) => updateSection('home', { avatarSrc: event.target.value })}
            placeholder="/profile-avatar.jpeg"
          />
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
        description="Update the visible skill group titles and the skill names and levels only."
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
                  value={(group.skills || []).map((skill) => `${skill.name}|${skill.level}`).join('\n')}
                  onChange={(event) => {
                    const nextSkills = parseLines(event.target.value).map((line) => {
                      const [namePart = '', levelPart = ''] = line.split('|');
                      const parsedLevel = Number.parseInt(levelPart, 10);

                      return {
                        name: namePart.trim(),
                        level: Number.isFinite(parsedLevel) ? parsedLevel : 0,
                      };
                    });

                    updateSkillGroup(groupIndex, { skills: nextSkills });
                  }}
                  helper="One skill per line in the format Name|Level."
                  placeholder="React|88"
                />
              </div>
            </div>
          ))}
        </div>
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
    case 'resume':
      return renderResume();
    case 'contact':
      return renderContact();
    case 'home':
    default:
      return renderHome();
  }
}
