import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constant'
import { removeUser } from '../utils/userSlice'

const NavBar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  const userName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || user?.firstname || 'Developer'
  const avatar = user?.photoUrl
  const initials = `${user?.firstname?.[0] || 'D'}${user?.lastname?.[0] || 'T'}`.toUpperCase()

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const navItems = [
    { label: 'Discover', to: '/' },
    { label: 'Connections', to: '/connections' },
    { label: 'Requests', to: '/requests' },
    { label: 'Profile', to: '/profile' },
  ]

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true })
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      delete axios.defaults.headers.common.Authorization
      dispatch(removeUser())
      localStorage.removeItem('user')
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-accent-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary text-sm font-semibold text-white shadow-lg shadow-accent-primary/20">
            DT
          </span>
          <span>
            <span className="block text-base font-semibold tracking-tight text-ink">Dev-Tinder</span>
            <span className="hidden text-xs text-ink-subtle sm:block">Match with builders</span>
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="hidden items-center gap-1 rounded-lg border border-hairline bg-surface-1 p-1 md:flex">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded px-3 py-1.5 text-xs font-semibold tracking-wide transition focus-visible:ring-2 focus-visible:ring-accent-primary ${
                    isActive ? 'bg-surface-2 text-ink border border-hairline' : 'text-ink-muted hover:bg-surface-2 hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-surface-1 text-ink-muted transition hover:bg-surface-2 hover:text-ink cursor-pointer focus-ring"
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-ink">{userName}</p>
                <p className="text-xs text-ink-subtle">
                  {user?.currentRole || (user?.skills ? user.skills.slice(0, 2).join(' + ') : '') || 'Builder'}
                </p>
              </div>
              <div className="dropdown dropdown-end">
                <button tabIndex={0} type="button" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-hairline bg-surface-2 text-xs font-semibold text-accent-primary transition hover:border-accent-primary cursor-pointer focus-ring">
                  {avatar ? (
                    <img src={avatar} alt={`${userName} avatar`} className="h-full w-full object-cover" width={40} height={40} />
                  ) : (
                    initials
                  )}
                </button>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-50 mt-3 w-56 rounded-lg border border-hairline bg-surface-3 p-2 text-ink-muted shadow-2xl shadow-black"
                >
                  {navItems.map(item => (
                    <li key={item.to}>
                      <Link to={item.to} className="rounded hover:bg-surface-2 hover:text-ink active:bg-accent-primary active:text-white">{item.label}</Link>
                    </li>
                  ))}
                  <li className="border-t border-hairline mt-1 pt-1">
                    <button type="button" onClick={handleLogout} className="rounded hover:bg-red-950/45 hover:text-red-400">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-md px-4 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent-primary">
                Sign in
              </Link>
              <Link to="/signup" className="rounded-md bg-accent-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-hover shadow-md shadow-accent-primary/10 focus-visible:ring-2 focus-visible:ring-accent-primary">
                Join free
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default NavBar
