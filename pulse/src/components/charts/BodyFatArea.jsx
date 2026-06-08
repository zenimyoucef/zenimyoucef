import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export default function BodyFatArea({ data }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data yet</div>

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="bfGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E8302A" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#E8302A" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="bf"
          stroke="#E8302A"
          fill="url(#bfGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
