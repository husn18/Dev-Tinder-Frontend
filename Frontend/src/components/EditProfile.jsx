import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constant'
import { addUser } from '../utils/userSlice'

const fallbackPhoto = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop'

const AVAILABLE_GOALS = [
  'Coding Partner',
  'Co-Founder',
  'Hackathon Teammate',
  'Mentor',
  'Mentee',
  'Project Collaborator',
]

const createFormData = (user) => ({
  firstname: user?.firstname || '',
  lastname: user?.lastname || '',
  phone: user?.phone || '',
  gender: user?.gender || '',
  skills: Array.isArray(user?.skills) ? user.skills.join(', ') : user?.skills || '',
  age: user?.age || '',
  location: user?.location || '',
  bio: user?.bio || '',
  photoUrl: user?.photoUrl || '',
  currentRole: user?.currentRole || '',
  experienceLevel: user?.experienceLevel || 'Mid',
  lookingFor: Array.isArray(user?.lookingFor) ? user.lookingFor : [],
  projects: Array.isArray(user?.projects) ? user.projects.join(', ') : user?.projects || '',
  githubUrl: user?.githubUrl || '',
  linkedinUrl: user?.linkedinUrl || '',
})

const EditProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  const [formData, setFormData] = useState(() => createFormData(user))
  const [photoPreview, setPhotoPreview] = useState(user?.photoUrl || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (name === 'photoUrl') {
      setPhotoPreview(value)
    }
  }

  const handleGoalChange = goal => event => {
    const isChecked = event.target.checked
    setFormData(prev => {
      const lookingFor = isChecked
        ? [...prev.lookingFor, goal]
        : prev.lookingFor.filter(g => g !== goal)
      return { ...prev, lookingFor }
    })
  }

  const handlePhotoFile = event => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setPhotoPreview(dataUrl)
      setFormData(prev => ({
        ...prev,
        photoUrl: dataUrl,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const payload = {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      age: formData.age ? Number(formData.age) : undefined,
      location: formData.location.trim(),
      bio: formData.bio.trim(),
      photoUrl: formData.photoUrl.trim(),
      currentRole: formData.currentRole.trim(),
      experienceLevel: formData.experienceLevel,
      lookingFor: formData.lookingFor,
      skills: formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean),
      projects: formData.projects
        .split(',')
        .map(proj => proj.trim())
        .filter(Boolean),
      githubUrl: formData.githubUrl.trim(),
      linkedinUrl: formData.linkedinUrl.trim(),
    }

    // Clean up empty fields
    Object.keys(payload).forEach(key => {
      if (
        payload[key] === undefined ||
        payload[key] === '' ||
        (Array.isArray(payload[key]) && payload[key].length === 0)
      ) {
        delete payload[key]
      }
    })

    try {
      const response = await axios.patch(`${API_BASE_URL}/updateProfile`, payload, {
        withCredentials: true,
      })
      
      const updatedUser = response.data && typeof response.data === 'object'
        ? response.data
        : { ...user, ...payload }
      
      dispatch(addUser(updatedUser))
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setMessage('Profile updated successfully.')
      setTimeout(() => {
        navigate('/profile')
      }, 800)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="app-shell flex items-center justify-center px-4 py-10">
        <div className="linear-panel-1 p-8 text-center max-w-sm bg-surface-1">
          <p className="text-lg font-semibold text-ink">No profile available.</p>
          <p className="mt-2 text-sm text-ink-subtle">Please sign in again to edit your profile.</p>
          <Link to="/login" className="mt-4 inline-block rounded bg-accent-primary px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        
        {/* Left Side: Live Preview Sidebar */}
        <aside className="linear-panel-1 p-6 self-start bg-surface-1">
          <img
            src={photoPreview || user.photoUrl || fallbackPhoto}
            alt={`${user.firstname || 'User'} avatar preview`}
            width={310}
            height={224}
            className="h-56 w-full rounded-lg object-cover border border-hairline ring-2 ring-accent-primary/10"
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary eyebrow">Live Preview</p>
          <h1 className="mt-2 text-2xl font-bold text-ink">{formData.firstname || 'Your'} {formData.lastname || 'Name'}</h1>
          <p className="text-xs text-accent-primary mt-1 font-semibold">{formData.currentRole || 'Developer'} &bull; {formData.experienceLevel}</p>
          <p className="mt-3 text-sm leading-6 text-ink-muted line-clamp-4">{formData.bio || 'Add a clear bio so other developers know what you are building.'}</p>

          <div className="mt-5 border-t border-hairline pt-4">
            <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">Goals Preview</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {formData.lookingFor.length > 0 ? (
                formData.lookingFor.map(goal => (
                  <span key={goal} className="rounded bg-accent-primary/10 border border-accent-primary/20 px-2 py-0.5 text-xs text-accent-primary">
                    {goal}
                  </span>
                ))
              ) : (
                <span className="text-xs text-ink-subtle italic">No goals selected</span>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-hairline pt-4">
            <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">Skills Preview</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {formData.skills.split(',').map(skill => skill.trim()).filter(Boolean).slice(0, 5).map(skill => (
                <span key={skill} className="rounded bg-surface-2 border border-hairline px-2 py-0.5 text-xs text-ink-muted font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <Link to="/profile" className="mt-8 block w-full rounded-md border border-hairline bg-surface-2 px-4 py-3 text-center text-sm font-semibold text-ink transition hover:bg-surface-3 hover:text-white focus-visible:ring-2 focus-visible:ring-accent-primary">
            Back to Profile
          </Link>
        </aside>

        {/* Right Side: Form Inputs */}
        <section className="linear-panel-1 p-6 sm:p-8 bg-surface-1">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-hairline pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary eyebrow">Settings</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">Update your developer profile</h2>
            </div>
            <p className="rounded-md bg-surface-2 border border-hairline px-3 py-1.5 text-xs text-ink-subtle">{user.email}</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label htmlFor="firstname" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>First name *</span>
                <input id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} required className="field-input" autocomplete="given-name" spellCheck={false} />
              </label>
              <label htmlFor="lastname" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>Last name</span>
                <input id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} className="field-input" autocomplete="family-name" spellCheck={false} />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label htmlFor="phone" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>Phone *</span>
                <input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" className="field-input" autocomplete="tel" />
              </label>
              <label htmlFor="location" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>Location</span>
                <input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country or Remote" className="field-input" autocomplete="address-level2" />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label htmlFor="gender" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>Gender</span>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="field-input" autocomplete="off">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label htmlFor="age" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>Age</span>
                <input id="age" name="age" value={formData.age} onChange={handleChange} type="number" min="18" className="field-input" autocomplete="off" />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label htmlFor="currentRole" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>Current Role / Title</span>
                <input id="currentRole" name="currentRole" value={formData.currentRole} onChange={handleChange} placeholder="Senior Frontend Dev" className="field-input" autocomplete="organization-title" spellCheck={false} />
              </label>
              <label htmlFor="experienceLevel" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>Experience Level</span>
                <select id="experienceLevel" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="field-input" autocomplete="off">
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead / Staff</option>
                </select>
              </label>
            </div>

            <label htmlFor="skills" className="block space-y-1.5 text-sm font-medium text-ink-muted">
              <span>Tech Stack (Comma-separated)</span>
              <input id="skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node, MongoDB" className="field-input" autocomplete="off" spellCheck={false} />
            </label>

            <div className="space-y-1.5">
              <span className="text-sm font-medium text-ink-muted">Collaboration Goals</span>
              <div className="grid gap-2 rounded-lg border border-hairline bg-surface-2 p-4 sm:grid-cols-2">
                {AVAILABLE_GOALS.map(goal => (
                  <label key={goal} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted select-none">
                    <input
                      type="checkbox"
                      checked={formData.lookingFor.includes(goal)}
                      onChange={handleGoalChange(goal)}
                      className="checkbox checkbox-xs border-hairline rounded bg-surface-1 text-accent-primary focus:ring-accent-primary"
                    />
                    {goal}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label htmlFor="githubUrl" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>GitHub Profile URL</span>
                <input id="githubUrl" name="githubUrl" value={formData.githubUrl} onChange={handleChange} type="url" placeholder="https://github.com/username" className="field-input" autocomplete="url" spellCheck={false} />
              </label>
              <label htmlFor="linkedinUrl" className="block space-y-1.5 text-sm font-medium text-ink-muted">
                <span>LinkedIn Profile URL</span>
                <input id="linkedinUrl" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} type="url" placeholder="https://linkedin.com/in/username" className="field-input" autocomplete="url" spellCheck={false} />
              </label>
            </div>

            <label htmlFor="projects" className="block space-y-1.5 text-sm font-medium text-ink-muted">
              <span>Project Interests / Side Projects (Comma-separated)</span>
              <input id="projects" name="projects" value={formData.projects} onChange={handleChange} placeholder="Project Alpha, AI Extension" className="field-input" autocomplete="off" spellCheck={false} />
            </label>

            <label htmlFor="bio" className="block space-y-1.5 text-sm font-medium text-ink-muted">
              <span>Developer Bio</span>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="What are you building or looking for?" className="field-input min-h-24" autocomplete="off" />
            </label>

            <label className="block space-y-1.5 text-sm font-medium text-ink-muted">
              <span>Profile Photo / Avatar Image</span>
              <div className="grid gap-3 sm:grid-cols-[100px_minmax(0,1fr)] items-center">
                <img src={photoPreview || user.photoUrl || fallbackPhoto} alt="Profile preview" width={80} height={80} className="h-20 w-20 rounded-lg object-cover border border-hairline ring-2 ring-accent-primary/10" />
                <div className="space-y-2.5">
                  <input type="file" accept="image/*" onChange={handlePhotoFile} className="file-input file-input-bordered file-input-sm w-full bg-surface-2 border-hairline" />
                  <input name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="Or paste image URL" className="field-input text-xs" autocomplete="url" spellCheck={false} />
                </div>
              </div>
            </label>

            {error ? <p className="rounded bg-red-950/20 border border-red-500/15 p-3 text-sm font-medium text-red-400">{error}</p> : null}
            {message ? <p className="rounded bg-emerald-950/20 border border-emerald-500/15 p-3 text-sm font-medium text-emerald-400">{message}</p> : null}

            <div className="grid gap-3 sm:grid-cols-2 pt-3 border-t border-hairline">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-accent-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-subtle shadow-md shadow-accent-primary/10 focus-visible:ring-2 focus-visible:ring-accent-primary cursor-pointer"
              >
                {loading ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="rounded-md border border-hairline bg-surface-2 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface-3 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

export default EditProfile
