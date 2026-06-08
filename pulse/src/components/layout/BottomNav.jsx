import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Activity, BarChart3, Settings
} from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/log', icon: ClipboardList, label: 'Log' },
  { to: '/bmi', icon: Activity, label: 'BMI' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/settings', icon: Settings, label: 'Settings' }
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          className={({ isActive }) => `bn-link ${isActive ? 'bn-active' : ''}`}
        >
          <l.icon size={20} />
          <span>{l.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
