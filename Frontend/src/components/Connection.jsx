import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constant'

const fallbackPhoto = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop'

const Connection = () => {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadConnections = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/connections`, {
          withCredentials: true,
        })
        if (isMounted) setConnections(response.data?.data || [])
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Unable to load connections. Please login again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadConnections()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Connection Header */}
        <section className="linear-panel-1 rounded-lg p-6 sm:p-8 bg-surface-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary eyebrow">Network</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.6px] text-ink">Your developer connections</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
            Accepted matches live here. Review their tech stack, experience levels, and click through to their GitHub/LinkedIn profiles to start building together.
          </p>
        </section>

        {/* Connections Grid */}
        <section className="linear-panel-1 p-5 sm:p-6 bg-surface-1">
          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
              <p className="mt-4 text-sm font-semibold text-ink">Loading connections…</p>
              <p className="mt-2 text-xs text-ink-subtle">Retrieving accepted matches from your developer network.</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4 text-sm text-red-400">{error}</div>
          ) : connections.length === 0 ? (
            <div className="rounded-lg border border-dashed border-hairline bg-surface-2/20 p-12 text-center max-w-md mx-auto">
              <p className="text-lg font-semibold text-ink">No matches established yet</p>
              <p className="mt-2 text-sm text-ink-subtle">
                Explore the discovery feed and connect with builders who match your tech stack or startup goals.
              </p>
              <a href="/" className="mt-5 inline-block rounded bg-accent-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-accent-hover transition shadow-md shadow-accent-primary/10">
                Explore Discover
              </a>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {connections.map((connection) => {
                const connectedUser = connection.user || {}
                const name = `${connectedUser.firstname || ''} ${connectedUser.lastname || ''}`.trim() || 'Developer'
                const skills = connectedUser.skills || []
                const role = connectedUser.currentRole || 'Builder'
                const github = connectedUser.githubUrl
                const linkedin = connectedUser.linkedinUrl
 
                return (
                  <article key={connection._id} className="bg-surface-2 border border-hairline rounded-xl p-5 shadow-lg flex flex-col justify-between hover:translate-y-[-2px] transition duration-200">
                    <div>
                      {/* Avatar and Main Header */}
                      <div className="flex items-center gap-4">
                        <img
                          src={connectedUser.photoUrl || fallbackPhoto}
                          alt={`${name} avatar`}
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-lg object-cover border border-hairline"
                        />
                        <div className="truncate">
                          <h2 className="text-sm font-semibold text-ink truncate">{name}</h2>
                          <p className="text-xs text-accent-primary truncate">{role}</p>
                          <p className="text-[10px] text-ink-subtle truncate">{connectedUser.location || 'Remote friendly'}</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="mt-4 line-clamp-3 text-xs leading-5 text-ink-muted">
                        {connectedUser.bio || 'This developer matches your profile and is ready to collaborate. Reach out via social links below!'}
                      </p>

                      {/* Skills */}
                      <div className="mt-4 flex flex-wrap gap-1">
                        {skills.length ? (
                          skills.slice(0, 4).map(skill => (
                            <span key={skill} className="rounded bg-surface-1 px-2.5 py-1 text-[10px] font-mono text-ink-muted border border-hairline">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-ink-subtle italic">No skills listed</span>
                        )}
                      </div>
                    </div>

                    {/* Social links & Connected date */}
                    <div className="mt-6 pt-4 border-t border-hairline flex flex-col gap-3">
                      {(github || linkedin) ? (
                        <div className="flex gap-2.5">
                          {github ? (
                            <a
                              href={github}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 rounded bg-surface-1 border border-hairline px-2.5 py-1.5 text-[10px] font-semibold text-ink-muted hover:bg-surface-3 hover:text-ink transition"
                            >
                              GitHub
                            </a>
                          ) : null}
                          {linkedin ? (
                            <a
                              href={linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 rounded bg-surface-1 border border-hairline px-2.5 py-1.5 text-[10px] font-semibold text-ink-muted hover:bg-surface-3 hover:text-ink transition"
                            >
                              LinkedIn
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                      <div className="text-[10px] text-ink-subtle italic">
                        Connected on {new Date(connection.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Connection
