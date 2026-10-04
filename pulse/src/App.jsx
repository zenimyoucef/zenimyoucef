import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import BottomNav from './components/layout/BottomNav'
import Dashboard from './pages/Dashboard'
import LogEntry from './pages/LogEntry'
import BMICalc from './pages/BMICalc'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import './App.css'

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <div className="app-layout">
          <Sidebar />
          <TopBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/log" element={<LogEntry />} />
              <Route path="/bmi" element={<BMICalc />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </AppProvider>
    </HashRouter>
  )
}
