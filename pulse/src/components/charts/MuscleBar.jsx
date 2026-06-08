import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export default function MuscleBar({ data }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data yet</div>

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
        <XAxis dataKey="label" stroke="#6B7280" fontSize={12} />
        <YAxis stroke="#6B7280" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: '#1A1A1E',
            border: '1px solid #2A2A2E',
            borderRadius: 8,
            color: '#F0F0F0'
          }}
        />
        <Bar dataKey="mass" fill="#22C55E" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
