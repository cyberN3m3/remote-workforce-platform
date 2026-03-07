import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ActivityDataPoint } from '@/types'

interface ActivityChartProps {
  data: ActivityDataPoint[]
}

export const ActivityChart = ({ data }: ActivityChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 noise-overlay"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">User Activity (24h)</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded-lg text-sm font-semibold bg-primary-500/20 text-primary-400 border border-primary-500/30">
            Live
          </button>
          <button className="px-3 py-1 rounded-lg text-sm text-slate-400 hover:bg-slate-700/50 transition-colors">
            7d
          </button>
          <button className="px-3 py-1 rounded-lg text-sm text-slate-400 hover:bg-slate-700/50 transition-colors">
            30d
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
          <YAxis stroke="#64748b" style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#06b6d4"
            fillOpacity={1}
            fill="url(#colorUsers)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="sessions"
            stroke="#0891b2"
            fillOpacity={1}
            fill="url(#colorSessions)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center space-x-8 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary-400"></div>
          <span className="text-sm text-slate-400 font-mono">Active Users</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary-600"></div>
          <span className="text-sm text-slate-400 font-mono">Total Sessions</span>
        </div>
      </div>
    </motion.div>
  )
}
