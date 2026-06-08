import { useState, useCallback, createContext, useContext } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((icon, message) => {
    setToast({ icon, message })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={`toast ${toast ? 'show' : ''}`}>
        <span id="toastMsg">{toast?.icon} {toast?.message}</span>
      </div>
    </ToastContext.Provider>
  )
}
