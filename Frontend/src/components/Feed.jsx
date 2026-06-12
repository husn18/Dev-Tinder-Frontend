import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { API_BASE_URL } from '../utils/constant'
import UserCard from './UserCard'

const Feed = () => {
  const user = useSelector(state => state.user.user)
  const [feedUsers, setFeedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingAction, setPendingAction] = useState('')

  const fetchFeed = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${API_BASE_URL}/user/feed`, {
        withCredentials: true,
      })
      const body = response.data
      setFeedUsers(body?.data || body || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your developer feed. Please login again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const loadFeed = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/feed`, {
          withCredentials: true,
        })
        const body = response.data
        if (isMounted) setFeedUsers(body?.data || body || [])
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Unable to load your developer feed. Please login again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadFeed()
    return () => {
      isMounted = false
    }
  }, [])

  const activeUser = feedUsers[0]

  const advanceCard = () => {
    setFeedUsers(prev => prev.slice(1))
  }

  const sendRequest = async (status) => {
    if (!activeUser) return
    setPendingAction(activeUser._id)
    setError('')
    try {
      await axios.post(`${API_BASE_URL}/sendconnectionrequest/${status}/${activeUser._id}`, {}, {
        withCredentials: true,
      })
      advanceCard()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update this profile. Please try again.')
    } finally {
      setPendingAction('')
    }
  }

  const remainingProfiles = Math.max(feedUsers.length - 1, 0)
  const firstName = user?.firstname || 'there'

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        
        {/* Info Sidebar */}
        <aside className="linear-panel-1 p-6 self-start bg-surface-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary eyebrow">Discover</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.6px] text-white">Find collaborators</h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Welcome back, {firstName}. View developers matching your focus. Pass or send connection requests to collaborate on real projects.
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded border border-hairline bg-surface-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Profiles loaded</p>
              <p className="mt-2 text-2xl font-bold text-white">{feedUsers.length}</p>
              <p className="text-xs text-ink-subtle">available in queue</p>
            </div>
            <div className="rounded border border-hairline bg-surface-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">Best for</p>
              <p className="mt-2 text-xs text-ink-muted">Hackathon teams, startup partners, and pair programming.</p>
            </div>
          </div>
        </aside>

        {/* Swipe Queue */}
        <section className="space-y-5">
          {error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4 text-sm font-medium text-red-400 shadow-lg">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="linear-panel-1 flex min-h-[34rem] items-center justify-center p-10 text-center">
              <div>
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
                <p className="mt-4 text-lg font-semibold text-white">Searching developer network…</p>
                <p className="mt-2 text-sm text-ink-subtle">Fetching matching developer profiles from the database.</p>
              </div>
            </div>
          ) : activeUser ? (
            <>
              <UserCard user={activeUser} />
              
              {/* Decision Control Bar */}
              <div className="linear-panel-1 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between bg-surface-1">
                <div>
                  <p className="text-sm font-semibold text-white">Ready to connect?</p>
                  <p className="text-xs text-ink-subtle">{remainingProfiles} more developers in queue after this.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:flex">
                  <button
                    onClick={() => sendRequest('ignored')}
                    disabled={pendingAction === activeUser?._id}
                    className="rounded-md border border-hairline bg-surface-2 px-6 py-2 text-sm font-semibold text-ink transition hover:bg-surface-3 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-accent-primary cursor-pointer"
                  >
                    {pendingAction === activeUser?._id ? 'Saving…' : 'Pass'}
                  </button>
                  <button
                    onClick={() => sendRequest('interested')}
                    disabled={pendingAction === activeUser?._id}
                    className="rounded-md bg-accent-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-accent-primary/10 focus-visible:ring-2 focus-visible:ring-accent-primary cursor-pointer"
                  >
                    {pendingAction === activeUser?._id ? 'Saving…' : 'Connect'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="linear-panel-1 flex min-h-[34rem] items-center justify-center p-10 text-center bg-surface-1">
              <div className="max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary eyebrow">All caught up</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">No new developer suggestions</h2>
                <p className="mt-3 text-sm text-ink-subtle">
                  You have reviewed all available builders. Try refreshing your feed, expanding your tech stack preferences, or check back later!
                </p>
                <button
                  type="button"
                  onClick={fetchFeed}
                  className="mt-6 rounded-md bg-accent-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover shadow-md shadow-accent-primary/10 focus-visible:ring-2 focus-visible:ring-accent-primary cursor-pointer"
                >
                  Refresh Feed
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Feed
