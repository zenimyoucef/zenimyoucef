import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

export default function TrendLine({ data, lines }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data yet</div>

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
        <XAxis dataKey="label" stroke="#6B7280" fontSize={12} />
        <YAxis
          yAxisId="left"
          stroke="#E8302A"
          fontSize={12}
          label={{ value: 'Body Fat %', angle: -90, position: 'insideLeft', style: { fill: '#E8302A', fontSize: 11 } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#22C55E"
          fontSize={12}
          label={{ value: 'Muscle Mass (kg)', angle: 90, position: 'insideRight', style: { fill: '#22C55E', fontSize: 11 } }}
        />
        <Tooltip
          contentStyle={{
            background: '#1A1A1E',
            border: '1px solid #2A2A2E',
            borderRadius: 8,
            color: '#F0F0F0'
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey={lines[0]?.dataKey || 'bf'}
          stroke={lines[0]?.color || '#E8302A'}
          strokeWidth={2}
          dot={{ fill: lines[0]?.color || '#E8302A', r: 4 }}
          activeDot={{ r: 6 }}
          name={lines[0]?.name || 'Body Fat %'}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey={lines[1]?.dataKey || 'muscle'}
          stroke={lines[1]?.color || '#22C55E'}
          strokeWidth={2}
          dot={{ fill: lines[1]?.color || '#22C55E', r: 4 }}
          activeDot={{ r: 6 }}
          name={lines[1]?.name || 'Muscle Mass'}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
