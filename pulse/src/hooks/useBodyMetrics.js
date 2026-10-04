import { useCallback } from 'react'
import useLocalStorage from './useLocalStorage'

export default function useBodyMetrics() {
  const [entries, setEntries] = useLocalStorage('pulse_entries', [])

  const addEntry = useCallback((entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toISOString()
    }
    setEntries(prev => [newEntry, ...prev].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    ))
    return newEntry
  }, [setEntries])

  const deleteEntry = useCallback((id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [setEntries])

  const updateEntry = useCallback((id, updates) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [setEntries])

  const getLatest = useCallback(() => {
    if (!entries.length) return null
    return entries.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  }, [entries])

  const getEntriesByDateRange = useCallback((startDate, endDate) => {
    return entries.filter(e => {
      const d = new Date(e.date)
      return d >= startDate && d <= endDate
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [entries])

  return {
    entries,
    addEntry,
    deleteEntry,
    updateEntry,
    getLatest,
    getEntriesByDateRange
  }
}
