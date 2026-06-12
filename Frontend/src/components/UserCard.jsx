const placeholder = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop'

const normalizeArray = (val) => {
  if (Array.isArray(val)) return val.filter(Boolean)
  if (typeof val === 'string') {
    return val.split(',').map(item => item.trim()).filter(Boolean)
  }
  return []
}

const UserCard = ({ user = {} }) => {
  const {
    firstname,
    lastname,
    gender,
    age,
    bio,
    location,
    photoUrl,
    avatar,
    currentRole,
    experienceLevel,
    githubUrl,
    linkedinUrl,
  } = user

  const skills = normalizeArray(user.skills)
  const lookingFor = normalizeArray(user.lookingFor)
  const projects = normalizeArray(user.projects)

  const name = `${firstname || ''} ${lastname || ''}`.trim() || 'Developer'
  const primaryRole = currentRole || (skills[0] ? `${skills[0]} Engineer` : 'Software Developer')
  const expText = experienceLevel ? `${experienceLevel} Developer` : (age && Number(age) >= 28 ? 'Senior Builder' : 'Growing Builder')
  const initials = `${firstname?.[0] || 'D'}${lastname?.[0] || 'V'}`.toUpperCase()

  return (
    <article className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-lg border border-hairline bg-surface-1 text-ink shadow-2xl shadow-black/80 lg:grid-cols-[0.95fr_1.05fr]">
      
      {/* Left Pane: Visual Info */}
      <div className="relative min-h-[24rem] bg-[#020204] flex flex-col justify-between p-6 lg:p-8">
        <img
          src={photoUrl || avatar || placeholder}
          alt={`${name} profile`}
          width={450}
          height={380}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010102] via-[#010102]/40 to-transparent" />
        
        {/* Recommended Tag */}
        <div className="relative flex items-center justify-between gap-3">
          <span className="rounded-full border border-accent-primary/30 bg-surface-1/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4px] text-accent-primary eyebrow">
            Active Builder
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-surface-2/90 font-black text-white">
            {initials}
          </span>
        </div>

        {/* Text Overlays */}
        <div className="relative mt-auto">
          <p className="text-xs font-semibold tracking-[0.4px] text-accent-primary uppercase eyebrow">{expText}</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-1.0px] text-white sm:text-4xl">{name}</h2>
          
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-ink-muted">
            {location ? (
              <span className="rounded-sm bg-surface-1/65 px-2.5 py-1 border border-hairline flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-subtle" />
                {location}
              </span>
            ) : null}
            {age ? (
              <span className="rounded-sm bg-surface-1/65 px-2.5 py-1 border border-hairline flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-subtle" />
                {age} yrs old
              </span>
            ) : null}
            {gender ? (
              <span className="rounded-sm bg-surface-1/65 px-2.5 py-1 border border-hairline flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-subtle" />
                {gender}
              </span>
            ) : null}
          </div>

          {/* Social Links */}
          {(githubUrl || linkedinUrl) ? (
            <div className="mt-5 flex gap-3">
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md border border-hairline bg-surface-2 px-3.5 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-3 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent-primary"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </a>
              ) : null}
              {linkedinUrl ? (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md border border-hairline bg-surface-2 px-3.5 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-3 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent-primary"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Right Pane: Match / Tech Details */}
      <div className="flex flex-col gap-6 p-6 sm:p-8 justify-between border-t border-hairline lg:border-t-0 lg:border-l bg-surface-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary eyebrow">Collaboration Profile</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{primaryRole}</h3>
          
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            {bio || 'This developer is ready to build, solve problems, and collaborate on new projects. Swipe right or connect to reach out!'}
          </p>
        </div>

        {/* Stack Block */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Tech Stack</h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded bg-surface-2 px-2.5 py-1 text-xs font-mono text-ink border border-hairline transition hover:border-accent-primary"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-ink-subtle italic">No skills listed yet</span>
            )}
          </div>
        </div>

        {/* Goals & Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Goals */}
          <div className="rounded border border-hairline bg-surface-2 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Looking For</h4>
            <div className="mt-2.5 space-y-1.5">
              {lookingFor.length > 0 ? (
                lookingFor.map(goal => (
                  <div key={goal} className="flex items-center gap-2 text-xs text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
                    {goal}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-xs text-ink-subtle italic">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-subtle/50" />
                  Ready to collaborate
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="rounded border border-hairline bg-surface-2 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Project Interests</h4>
            <div className="mt-2.5 space-y-1.5">
              {projects.length > 0 ? (
                projects.map(proj => (
                  <div key={proj} className="flex items-center gap-2 text-xs text-ink-muted min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#828fff]" />
                    <span className="truncate">{proj}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-xs text-ink-subtle italic">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-subtle/50" />
                  Side projects, hackathons
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Tip Banner */}
        <div className="rounded border border-hairline bg-canvas p-4 flex gap-3 text-xs leading-5">
          <span className="text-accent-primary font-semibold">MATCH TIP:</span>
          <span className="text-ink-subtle">
            If you connect, they will receive a notification to accept your request. Match to unlock their direct contact details.
          </span>
        </div>
      </div>
    </article>
  )
}

export default UserCard
