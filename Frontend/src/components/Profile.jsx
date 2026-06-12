import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserCard from './UserCard'

const fallbackPhoto = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop'

const normalizeArray = (val) => {
  if (Array.isArray(val)) return val.filter(Boolean)
  if (typeof val === 'string') return val.split(',').map(item => item.trim()).filter(Boolean)
  return []
}

const Profile = () => {
  const user = useSelector(state => state.user.user)

  if (!user) {
    return (
      <div className="app-shell flex items-center justify-center px-4 py-10">
        <div className="linear-panel-1 p-8 text-center max-w-sm bg-surface-1">
          <p className="text-lg font-semibold text-white">No profile available.</p>
          <p className="mt-2 text-sm text-ink-subtle">Please sign in again to view your profile.</p>
          <Link to="/login" className="mt-4 inline-block rounded bg-accent-primary px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const userName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'Your name'
  const skills = normalizeArray(user?.skills)
  const lookingFor = normalizeArray(user?.lookingFor)
  
  const profileCompleteness = [
    user.firstname,
    user.email,
    user.photoUrl,
    user.bio,
    skills.length > 0,
    user.location,
    user.currentRole,
    user.experienceLevel,
    lookingFor.length > 0,
    user.githubUrl || user.linkedinUrl
  ].filter(Boolean).length

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Profile Header panel */}
        <section className="linear-panel-1 rounded-lg p-6 sm:p-8 bg-surface-1">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <img
                src={user.photoUrl || fallbackPhoto}
                alt={`${userName} avatar`}
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg border border-hairline object-cover ring-2 ring-accent-primary/20"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary eyebrow">Developer Profile</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{userName}</h1>
                <p className="text-sm text-ink-muted mt-1">{user.currentRole || 'Developer'} &bull; {user.experienceLevel || 'Mid Level'}</p>
                <p className="text-xs text-ink-subtle mt-1">{user.email}</p>
              </div>
            </div>
            <Link to="/profile/edit" className="rounded-md bg-accent-primary px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-accent-hover shadow-md shadow-accent-primary/10 focus-visible:ring-2 focus-visible:ring-accent-primary">
              Edit Profile
            </Link>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="linear-panel-1 p-5 bg-surface-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Completeness</p>
            <p className="mt-2 text-3xl font-bold text-ink">{Math.round((profileCompleteness / 10) * 100)}%</p>
            <p className="mt-1 text-xs text-ink-subtle">Expand details to boost match accuracy.</p>
          </div>
          <div className="linear-panel-1 p-5 bg-surface-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Location</p>
            <p className="mt-2 text-xl font-bold text-ink">{user?.location || 'Remote Friendly'}</p>
            <p className="mt-1 text-xs text-ink-subtle">Your default discover timezone.</p>
          </div>
          <div className="linear-panel-1 p-5 bg-surface-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Tech Stack Depth</p>
            <p className="mt-2 text-xl font-bold text-ink">{skills.length} skills listed</p>
            <p className="mt-1 text-xs text-ink-subtle">Main programming languages & frameworks.</p>
          </div>
        </section>

        {/* Double-Column Profile Layout */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle px-1">Card Preview (How others see you)</p>
            <UserCard user={user} />
          </div>
          
          <aside className="space-y-4">
            <div className="linear-panel-1 p-5 bg-surface-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">About Me</p>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                {user?.bio || 'No bio yet. Update your profile to write a brief bio about what you build, learn, or look for.'}
              </p>
            </div>
            
            <div className="linear-panel-1 p-5 bg-surface-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">System Info</p>
              <div className="mt-4 space-y-3 text-xs text-ink-muted">
                <p><span className="font-semibold text-ink-subtle">Gender:</span> {user?.gender || 'Not specified'}</p>
                <p><span className="font-semibold text-ink-subtle">Age:</span> {user?.age || 'Not specified'}</p>
                <p><span className="font-semibold text-ink-subtle">Phone:</span> {user?.phone || 'Not shown publically'}</p>
                {user?.githubUrl ? (
                  <p className="truncate">
                    <span className="font-semibold text-ink-subtle">GitHub:</span>{' '}
                    <a href={user.githubUrl} target="_blank" rel="noreferrer" className="text-accent-primary hover:underline">
                      {user.githubUrl.replace('https://github.com/', '')}
                    </a>
                  </p>
                ) : null}
                {user?.linkedinUrl ? (
                  <p className="truncate">
                    <span className="font-semibold text-ink-subtle">LinkedIn:</span>{' '}
                    <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="text-accent-primary hover:underline">
                      {user.linkedinUrl.replace('https://linkedin.com/in/', '')}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="linear-panel-1 p-5 bg-surface-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Interests & Goals</p>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">Looking For</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {lookingFor.length > 0 ? (
                      lookingFor.map(goal => (
                        <span key={goal} className="rounded bg-surface-2 border border-hairline px-2 py-0.5 text-xs text-ink-muted">
                          {goal}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-ink-subtle italic">No collaboration goals set</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">Tech Stack</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {skills.length > 0 ? (
                      skills.map(skill => (
                        <span key={skill} className="rounded bg-surface-2 border border-hairline px-2 py-0.5 text-xs text-ink-muted">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-ink-subtle italic">No skills listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>

      </div>
    </div>
  )
}

export default Profile
