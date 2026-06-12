import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { API_BASE_URL } from './utils/constant'
import Body from './components/Body'
import Profile from './components/Profile'
import Login from './components/Login'
import Feed from './components/Feed'
import EditProfile from './components/EditProfile'
import Connection from './components/Connection'
import Request from './components/Request'
import Landing from './components/Landing'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import { addUser, removeUser } from './utils/userSlice'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector(state => state.user)
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4 text-ink">
        <div className="rounded-lg border border-hairline bg-surface-1 px-6 py-5 text-sm shadow-2xl shadow-black/30">
          Checking session…
        </div>
      </div>
    )
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const HomeRoute = () => {
  const { isAuthenticated } = useSelector(state => state.user)
  return isAuthenticated ? <Feed /> : <Landing />
}

const AppRoutes = () => {
  const dispatch = useDispatch()
  const authChecked = useSelector(state => state.user.authChecked)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          withCredentials: true,
        })
        const user = response.data
        dispatch(addUser(user))
        localStorage.setItem('user', JSON.stringify(user))
      } catch {
        dispatch(removeUser())
        localStorage.removeItem('user')
      }
    }

    if (!authChecked) {
      validateSession()
    }
  }, [authChecked, dispatch])

  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Body />}>
          <Route index element={<HomeRoute />} />
          <Route path='profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='profile/edit' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path='connections' element={<ProtectedRoute><Connection /></ProtectedRoute>} />
          <Route path='requests' element={<ProtectedRoute><Request /></ProtectedRoute>} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Login />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const App = () => {
  return (
    <Provider store={appStore}>
      <AppRoutes />
    </Provider>
  )
}

export default App;
