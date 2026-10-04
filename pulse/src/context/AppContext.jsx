import { createContext, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import useBodyMetrics from '../hooks/useBodyMetrics'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [profile, setProfile] = useLocalStorage('pulse_profile', {
    name: 'Athlete',
    age: '',
    sex: 'male',
    heightCm: 175,
    goalWeight: '',
    goalBodyFat: ''
  })

  const [unitPref, setUnitPref] = useLocalStorage('pulse_unit', 'metric')

  const bodyMetrics = useBodyMetrics()

  const value = useMemo(() => ({
    profile,
    setProfile,
    unitPref,
    setUnitPref,
    ...bodyMetrics
  }), [profile, unitPref, bodyMetrics])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
