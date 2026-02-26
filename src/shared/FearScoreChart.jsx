/*import Plot from 'react-plotly.js'

export default function FearScoreChart({ data }) {
  return (
    <Plot
      data={[{ x: data.map(d=>d.t), y: data.map(d=>d.score), mode: 'lines+markers', name: 'Fear Score' }]}
      layout={{
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { l: 40, r: 10, t: 10, b: 35 },
        xaxis: { title: 'Time (s)', gridcolor: '#243447' },
        yaxis: { title: 'Score (0-1)', gridcolor: '#243447', range: [0,1] },
        font: { color: '#e5e7eb' },
      }}
      style={{ width: '100%', height: 320 }}
      config={{ displayModeBar: false }}
    />
  )
}
  */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

export default function FearScoreChart({ data }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="t"
            stroke="#94a3b8"
            label={{ value: "Time (s)", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            stroke="#94a3b8"
            domain={[0, 10]}
            label={{ value: "Fear Score", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", borderRadius: "0.5rem", border: "none" }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4, fill: "#10b981" }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}