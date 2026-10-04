import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  const Icon = icons[type] || Info

  return (
    <div className={`toast ${visible ? 'toast-visible' : ''}`}>
      <Icon size={18} />
      <span>{message}</span>
      <button className="toast-close" onClick={() => { setVisible(false); setTimeout(onClose, 300) }}>
        <X size={16} />
      </button>
    </div>
  )
}
