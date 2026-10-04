import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import BodyFatArea from '../components/charts/BodyFatArea'
import MuscleBar from '../components/charts/MuscleBar'
import Modal from '../components/ui/Modal'
import { calcMuscleMass, fmt } from '../utils/calculations'
import { Trash2, Award, Trophy, Star, Zap, Target } from 'lucide-react'

const SORT_OPTIONS = [
  { key: 'date', label: 'Date' },
  { key: 'weight', label: 'Weight' },
  { key: 'bodyFat', label: 'BF%' }
]

const MILESTONES = [
  { id: 'first', icon: Star, label: 'First Entry', check: (e, i) => i === 0 },
  { id: 'bf5', icon: Target, label: '5% BF Lost', check: (e, i, all) => all.length > 1 && (Number(all[0].bodyFat) - Number(all[all.length - 1].bodyFat)) >= 5 },
  { id: 'kg5', icon: Trophy, label: '-5 kg Lost', check: (e, i, all) => all.length > 1 && (Number(all[0].weight) - Number(all[all.length - 1].weight)) >= 5 },
  { id: 'entries10', icon: Zap, label: '10 Entries', check: (e, i, all) => all.length >= 10 },
  { id: 'kg10', icon: Trophy, label: '-10 kg Lost', check: (e, i, all) => all.length > 1 && (Number(all[0].weight) - Number(all[all.length - 1].weight)) >= 10 }
]

export default function Progress() {
  const { entries, deleteEntry } = useApp()
  const [sortKey, setSortKey] = useState('date')
  const [sortAsc, setSortAsc] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const sorted = useMemo(() => {
    const arr = [...entries]
    arr.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey]
      if (sortKey === 'date') { va = new Date(va); vb = new Date(vb) }
      else { va = Number(va || 0); vb = Number(vb || 0) }
      return sortAsc ? va - vb : vb - va
    })
    return arr
  }, [entries, sortKey, sortAsc])

  const chartData = useMemo(() => {
    const rev = [...entries].reverse()
    return rev.map(e => ({
      label: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bf: Number(e.bodyFat),
      mass: calcMuscleMass(Number(e.weight), Number(e.bodyFat))
    }))
  }, [entries])

  const milestones = useMemo(() => {
    return MILESTONES.map(m => ({
      ...m,
      unlocked: entries.length > 0 && m.check(entries[0], 0, entries)
    }))
  }, [entries])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h2>Progress</h2>
      </div>

      {milestones.filter(m => m.unlocked).length > 0 && (
        <div className="milestones-section">
          <h3><Award size={16} /> Milestones</h3>
          <div className="milestones-grid">
            {milestones.filter(m => m.unlocked).map(m => (
              <div key={m.id} className="milestone-badge">
                <m.icon size={20} />
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length > 1 && (
        <div className="charts-grid">
          <div className="card">
            <h3 className="card-title">Body Fat Trend</h3>
            <BodyFatArea data={chartData} />
          </div>
          <div className="card">
            <h3 className="card-title">Muscle Mass</h3>
            <MuscleBar data={chartData} />
          </div>
        </div>
      )}

      <div className="card">
        <div className="history-header">
          <h3 className="card-title">History</h3>
          <div className="sort-controls">
            <span className="sort-label">Sort:</span>
            <select value={sortKey} onChange={e => setSortKey(e.target.value)} className="input input-sm">
              {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
            <button className="btn btn-sm" onClick={() => setSortAsc(v => !v)}>
              {sortAsc ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {sorted.length === 0 && <p className="empty-state">No entries yet. Start logging!</p>}

        {sorted.length > 0 && (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>BF%</th>
                  <th>Muscle</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(e => (
                  <tr key={e.id}>
                    <td>{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td>{fmt(e.weight)} kg</td>
                    <td>{e.bodyFat ? `${fmt(e.bodyFat)}%` : '—'}</td>
                    <td>{e.bodyFat ? `${fmt(calcMuscleMass(Number(e.weight), Number(e.bodyFat)))} kg` : '—'}</td>
                    <td className="td-notes">{e.notes || '—'}</td>
                    <td>
                      <button className="btn btn-icon btn-danger" onClick={() => setConfirmDelete(e)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Entry">
        <p>Delete entry from {confirmDelete && new Date(confirmDelete.date).toLocaleDateString()}?</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => {
            if (confirmDelete) deleteEntry(confirmDelete.id)
            setConfirmDelete(null)
          }}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}
