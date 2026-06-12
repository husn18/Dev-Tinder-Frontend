import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import userReducer from './userSlice'
import feedReducer from './feedSlice'
import connectionReducer from './connectionSlice'

const loadPersistedUser = () => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const persistedUser = loadPersistedUser()

axios.defaults.withCredentials = true

export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
  },
  preloadedState: {
    user: {
      user: persistedUser,
      isAuthenticated: !!persistedUser,
      authChecked: false,
    },
  },
})

export default store
