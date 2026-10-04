import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Activity, BarChart3, Settings, Menu, X
} from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/log', icon: ClipboardList, label: 'Log Entry' },
  { to: '/bmi', icon: Activity, label: 'BMI' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/settings', icon: Settings, label: 'Settings' }
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(v => !v)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo">PULSE</span>
          <span className="sidebar-tagline">Track. Measure. Evolve.</span>
        </div>

        <nav className="sidebar-nav">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <l.icon size={18} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}
    </>
  )
}
