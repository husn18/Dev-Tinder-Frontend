import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constant'
import { addUser } from '../utils/userSlice'

const defaultForm = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  age: '',
  gender: 'Male',
  skills: '',
  location: '',
  bio: '',
  photoUrl: '',
  currentRole: '',
  experienceLevel: 'Mid',
  lookingFor: [],
  projects: '',
  githubUrl: '',
  linkedinUrl: '',
}

const benefits = [
  'Connect with pair-programming partners and project collaborators.',
  'Display your coding stack, experience level, and looking-for tags.',
  'Verify profiles easily via embedded GitHub and LinkedIn links.',
]

const AVAILABLE_GOALS = [
  'Coding Partner',
  'Co-Founder',
  'Hackathon Teammate',
  'Mentor',
  'Mentee',
  'Project Collaborator',
]

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  const [form, setForm] = useState(defaultForm)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'photoUrl') {
      setPhotoPreview(value)
    }
  }

  const handlePhotoFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setPhotoPreview(dataUrl)
      setForm(prev => ({
        ...prev,
        photoUrl: dataUrl,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleGoalChange = (goal) => (event) => {
    const isChecked = event.target.checked
    setForm(prev => {
      const lookingFor = isChecked
        ? [...prev.lookingFor, goal]
        : prev.lookingFor.filter(g => g !== goal)
      return { ...prev, lookingFor }
    })
  }

  const handleAuth = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const authMode = location.pathname.includes('signup') ? 'signup' : 'login'
    const isSignup = authMode === 'signup'

    if (isSignup && form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.')
      setLoading(false)
      return
    }

    const payload = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      age: form.age ? Number(form.age) : undefined,
      gender: form.gender,
      skills: form.skills,
      location: form.location.trim(),
      bio: form.bio.trim(),
      photoUrl: form.photoUrl.trim(),
      currentRole: form.currentRole.trim(),
      experienceLevel: form.experienceLevel,
      lookingFor: form.lookingFor,
      projects: form.projects,
      githubUrl: form.githubUrl.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/${authMode}`,
        authMode === 'login'
          ? { email: form.email, password: form.password, remember }
          : payload,
        { withCredentials: true }
      )

      const userData = response.data?.data
      if (!userData) {
        throw new Error('Unexpected server response')
      }

      dispatch(addUser(userData))
      localStorage.setItem('user', JSON.stringify(userData))
      if (response.data?.token) {
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`
      }

      setMessage(response.data.message)
      navigate('/', { replace: true })
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message
      setError(serverMessage || 'Unable to complete request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const authMode = location.pathname.includes('signup') ? 'signup' : 'login'
  const isSignup = authMode === 'signup'
  const heading = isSignup ? 'Create your developer profile' : 'Welcome back, builder'
  const subheading = isSignup
    ? 'Join Dev-Tinder to meet builders who want to cofound, learn, mentor, and ship.'
    : 'Sign in to review your queue, accept requests, and keep your developer network moving.'

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg border border-hairline bg-surface-1 shadow-2xl shadow-black/80 lg:grid-cols-[0.8fr_1.2fr]">
        
        {/* Left pane: Benefits and Stats */}
        <section className="relative flex flex-col justify-between gap-10 bg-surface-2 p-8 text-ink sm:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary eyebrow">Dev-Tinder</p>
            <h1 className="mt-4 max-w-lg text-3xl font-semibold tracking-[-1.0px] text-ink sm:text-4xl">{heading}</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-ink-muted">{subheading}</p>
          </div>

          <div className="grid gap-3">
            {benefits.map(benefit => (
              <div key={benefit} className="rounded-lg border border-hairline bg-surface-1 p-4 text-sm text-ink-muted">
                {benefit}
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-accent-primary/10 border border-accent-primary/20 p-4 text-accent-primary text-center">
              <p className="text-2xl font-bold">1:1</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-primary">Match model</p>
            </div>
            <div className="rounded-lg border border-hairline bg-surface-1 p-4 text-center">
              <p className="text-2xl font-bold text-ink">Stack</p>
              <p className="text-[10px] text-ink-subtle uppercase tracking-wider">First profiles</p>
            </div>
            <div className="rounded-lg border border-hairline bg-surface-1 p-4 text-center">
              <p className="text-2xl font-bold text-ink">Teams</p>
              <p className="text-[10px] text-ink-subtle uppercase tracking-wider">Real building</p>
            </div>
          </div>
        </section>

        {/* Right pane: Auth Form */}
        <section className="bg-canvas p-6 text-ink sm:p-10 border-t lg:border-t-0 lg:border-l border-hairline">
          <div className="mb-8 flex rounded-lg border border-hairline bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => {
                setError('');
                setMessage('');
                navigate('/login');
              }}
              className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary ${!isSignup ? 'bg-accent-primary text-white shadow-sm' : 'text-ink-subtle hover:text-ink'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                setMessage('');
                navigate('/signup');
              }}
              className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary ${isSignup ? 'bg-accent-primary text-white shadow-sm' : 'text-ink-subtle hover:text-ink'}`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            {isSignup ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label htmlFor="firstname" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                  <span>First name *</span>
                  <input id="firstname" name="firstname" value={form.firstname} onChange={handleChange('firstname')} type="text" placeholder="Sarah" required className="field-input" autocomplete="given-name" spellCheck={false} />
                </label>
                <label htmlFor="lastname" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                  <span>Last name</span>
                  <input id="lastname" name="lastname" value={form.lastname} onChange={handleChange('lastname')} type="text" placeholder="Chen" className="field-input" autocomplete="family-name" spellCheck={false} />
                </label>
              </div>
            ) : null}

            <label htmlFor="email" className="block space-y-1.5 text-sm font-medium text-ink-muted">
              <span>Email Address *</span>
              <input id="email" name="email" value={form.email} onChange={handleChange('email')} type="email" placeholder="sarah.chen@example.com" required className="field-input" autocomplete="email" spellCheck={false} />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label htmlFor="password" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>Password *</span>
                <input id="password" name="password" value={form.password} onChange={handleChange('password')} type="password" placeholder="Password" required className="field-input" autocomplete={isSignup ? "new-password" : "current-password"} spellCheck={false} />
              </label>
              {isSignup ? (
                <label htmlFor="confirmPassword" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                  <span>Confirm Password *</span>
                  <input id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange('confirmPassword')} type="password" placeholder="Confirm password" required className="field-input" autocomplete="new-password" spellCheck={false} />
                </label>
              ) : null}
            </div>

            {isSignup ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label htmlFor="phone" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                    <span>Phone Number *</span>
                    <input id="phone" name="phone" value={form.phone} onChange={handleChange('phone')} type="tel" placeholder="+1234567890" required className="field-input" autocomplete="tel" />
                  </label>
                  <label htmlFor="age" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                    <span>Age</span>
                    <input id="age" name="age" value={form.age} onChange={handleChange('age')} type="number" placeholder="24" min="18" className="field-input" autocomplete="off" />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label htmlFor="gender" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                    <span>Gender</span>
                    <select id="gender" name="gender" value={form.gender} onChange={handleChange('gender')} className="field-input" autocomplete="off">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label htmlFor="currentRole" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                    <span>Current Role / Title</span>
                    <input id="currentRole" name="currentRole" value={form.currentRole} onChange={handleChange('currentRole')} type="text" placeholder="Full-Stack Developer" className="field-input" autocomplete="organization-title" spellCheck={false} />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label htmlFor="experienceLevel" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                    <span>Experience Level</span>
                    <select id="experienceLevel" name="experienceLevel" value={form.experienceLevel} onChange={handleChange('experienceLevel')} className="field-input" autocomplete="off">
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead / Staff</option>
                    </select>
                  </label>
                  <label htmlFor="location" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                    <span>Location</span>
                    <input id="location" name="location" value={form.location} onChange={handleChange('location')} type="text" placeholder="San Francisco, CA or Remote" className="field-input" autocomplete="address-level2" />
                  </label>
                </div>

                <label htmlFor="skills" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                  <span>Tech Stack (Comma-separated)</span>
                  <input id="skills" name="skills" value={form.skills} onChange={handleChange('skills')} type="text" placeholder="React, Node.js, TypeScript, Go" className="field-input" autocomplete="off" spellCheck={false} />
                </label>

                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-ink-muted">Collaboration Goals (Select all that apply)</span>
                  <div className="grid gap-2 rounded-lg border border-hairline bg-surface-2 p-4 sm:grid-cols-2">
                    {AVAILABLE_GOALS.map(goal => (
                      <label key={goal} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted select-none">
                        <input
                          type="checkbox"
                          checked={form.lookingFor.includes(goal)}
                          onChange={handleGoalChange(goal)}
                          className="checkbox checkbox-xs border-hairline rounded bg-surface-1 text-accent-primary focus:ring-accent-primary"
                        />
                        {goal}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label htmlFor="githubUrl" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                    <span>GitHub Profile URL</span>
                    <input id="githubUrl" name="githubUrl" value={form.githubUrl} onChange={handleChange('githubUrl')} type="url" placeholder="https://github.com/username" className="field-input" autocomplete="url" spellCheck={false} />
                  </label>
                  <label htmlFor="linkedinUrl" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                    <span>LinkedIn Profile URL</span>
                    <input id="linkedinUrl" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange('linkedinUrl')} type="url" placeholder="https://linkedin.com/in/username" className="field-input" autocomplete="url" spellCheck={false} />
                  </label>
                </div>

                <label htmlFor="projects" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                  <span>Project Interests / Projects (Comma-separated)</span>
                  <input id="projects" name="projects" value={form.projects} onChange={handleChange('projects')} type="text" placeholder="DevTinder, AI Code Assistant" className="field-input" autocomplete="off" spellCheck={false} />
                </label>

                <label htmlFor="bio" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                  <span>Developer Bio</span>
                  <textarea id="bio" name="bio" value={form.bio} onChange={handleChange('bio')} rows={3} placeholder="Tell other builders about yourself, what you are building..." className="field-input min-h-24" autocomplete="off" />
                </label>

                <label className="block space-y-1.5 text-sm font-medium text-ink-muted">
                  <span>Profile Photo / Avatar Image</span>
                  <div className="grid gap-3 sm:grid-cols-[100px_minmax(0,1fr)] items-center">
                    <img src={photoPreview || form.photoUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop'} alt="Profile preview" width={80} height={80} className="h-20 w-20 rounded-lg object-cover border border-hairline ring-2 ring-accent-primary/10" />
                    <div className="space-y-2.5">
                      <input type="file" accept="image/*" onChange={handlePhotoFile} className="file-input file-input-bordered file-input-sm w-full bg-surface-2 border-hairline" />
                      <input id="photoUrl" name="photoUrl" value={form.photoUrl} onChange={handleChange('photoUrl')} placeholder="Or paste image URL" className="field-input text-xs" autocomplete="url" spellCheck={false} />
                    </div>
                  </div>
                </label>
              </>
            ) : null}

            {!isSignup ? (
              <div className="flex flex-col gap-3 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="checkbox checkbox-xs border-hairline rounded bg-surface-1" />
                  Remember me
                </label>
                <span className="text-ink-subtle">Sign in with your email and password.</span>
              </div>
            ) : null}

            {isSignup ? (
              <p className="rounded bg-surface-2 border border-hairline p-3 text-xs text-ink-subtle">
                Requirement: Password must be strong (contain uppercase, lowercase, number, symbol, and at least 8 characters).
              </p>
            ) : null}
            {error ? <p className="rounded bg-red-950/20 border border-red-500/15 p-3 text-sm font-medium text-red-400">{error}</p> : null}
            {message ? <p className="rounded bg-emerald-950/20 border border-emerald-500/15 p-3 text-sm font-medium text-emerald-400">{message}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-accent-primary px-5 py-3 text-sm font-bold text-white shadow-md shadow-accent-primary/10 transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-subtle cursor-pointer"
            >
              {loading ? (isSignup ? 'Creating profile…' : 'Signing in…') : (isSignup ? 'Create Profile' : 'Sign In')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-subtle">
            {isSignup ? 'Already have an account?' : 'New to Dev-Tinder?'}{' '}
            <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-accent-primary hover:text-accent-hover">
              {isSignup ? 'Sign in' : 'Create your developer profile'}
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default Login
