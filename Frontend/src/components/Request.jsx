import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constant'

const fallbackPhoto = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop'

const Request = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingAction, setPendingAction] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadRequests = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/requests/received`, {
          withCredentials: true,
        })
        if (isMounted) setRequests(response.data?.data || [])
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Unable to load requests. Please login again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadRequests()
    return () => {
      isMounted = false
    }
  }, [])

  const respondToRequest = async (requestId, action) => {
    setPendingAction(requestId)
    setError('')
    try {
      const response = await axios.post(`${API_BASE_URL}/connectionrequestresponse/${action}/${requestId}`, {}, {
        withCredentials: true,
      })

      if (response.status === 200) {
        setRequests(prev => prev.filter(request => request._id !== requestId))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update this request. Please try again.')
    } finally {
      setPendingAction('')
    }
  }

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Request Header Panel */}
        <section className="linear-panel-1 rounded-lg p-6 sm:p-8 bg-surface-1">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary eyebrow">Requests</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.6px] text-ink">Incoming connection requests</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
                Review other builders who want to connect with you. Accept their requests to establish connection and view each other's contacts.
              </p>
            </div>
            <div className="rounded-lg bg-surface-1 border border-hairline px-5 py-3 text-center self-start sm:self-center">
              <p className="text-2xl font-bold text-accent-primary">{requests.length}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-ink-subtle">pending</p>
            </div>
          </div>
        </section>

        {/* Requests Queue */}
        <section className="linear-panel-1 p-5 sm:p-6 bg-surface-1">
          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
              <p className="mt-4 text-sm font-semibold text-ink">Loading requests…</p>
              <p className="mt-2 text-xs text-ink-subtle">Checking who wants to build with you.</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4 text-sm text-red-400">{error}</div>
          ) : requests.length === 0 ? (
            <div className="rounded-lg border border-dashed border-hairline bg-surface-2/20 p-12 text-center max-w-md mx-auto">
              <p className="text-lg font-bold text-ink">All requests handled</p>
              <p className="mt-2 text-sm text-ink-subtle">
                No pending requests right now. Keep your developer profile current so prospective collaborators know what projects you are building.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {requests.map(request => {
                const user = request.fromUserId || {}
                const name = `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Developer'
                const skills = user.skills || []
                const role = user.currentRole || 'Full-Stack Developer'
                const exp = user.experienceLevel ? `${user.experienceLevel} Level` : 'Developer'

                return (
                  <article key={request._id} className="bg-surface-2 border border-hairline rounded-xl p-5 shadow-lg flex flex-col justify-between hover:translate-y-[-2px] transition duration-200">
                    <div>
                      {/* Requester Info */}
                      <div className="flex gap-4">
                        <img
                          src={user.photoUrl || fallbackPhoto}
                          alt={`${name} avatar`}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover border border-hairline flex-shrink-0"
                        />
                        <div className="truncate">
                          <h2 className="text-sm font-semibold text-ink truncate">{name}</h2>
                          <p className="text-xs text-accent-primary truncate">{role}</p>
                          <p className="text-[10px] text-ink-subtle mt-0.5">{user.location || 'Remote friendly'} &bull; {exp} {user.age ? `(${user.age} yrs)` : ''}</p>
                        </div>
                      </div>

                      {/* Bio snippet */}
                      <p className="mt-4 text-xs leading-5 text-ink-muted">
                        {user.bio || 'Wants to connect with you to discuss projects and stack collaboration.'}
                      </p>

                      {/* Skills */}
                      <div className="mt-4 flex flex-wrap gap-1">
                        {skills.length ? (
                          skills.slice(0, 5).map(skill => (
                            <span key={skill} className="rounded bg-surface-1 px-2.5 py-1 text-[10px] font-mono text-ink-muted border border-hairline">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-ink-subtle italic">No skills listed</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-hairline grid gap-3 grid-cols-2">
                      <button
                        onClick={() => respondToRequest(request._id, 'accepted')}
                        disabled={pendingAction === request._id}
                        className="rounded bg-accent-primary py-2 text-xs font-semibold text-white hover:bg-accent-hover transition shadow-md shadow-accent-primary/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary"
                      >
                        {pendingAction === request._id ? 'Saving…' : 'Accept'}
                      </button>
                      <button
                        onClick={() => respondToRequest(request._id, 'rejected')}
                        disabled={pendingAction === request._id}
                        className="rounded border border-hairline bg-surface-1 py-2 text-xs font-semibold text-ink-muted hover:bg-surface-3 hover:text-ink transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary"
                      >
                        {pendingAction === request._id ? 'Saving…' : 'Reject'}
                      </button>
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

export default Request
