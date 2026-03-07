import { motion } from 'framer-motion'

interface MetricProps {
  label: string
  value: number
  color: string
}

const Metric = ({ label, value, color }: MetricProps) => {
  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      green: 'from-green-400 to-green-500',
      cyan: 'from-primary-400 to-primary-500',
      yellow: 'from-yellow-400 to-yellow-500',
      blue: 'from-blue-400 to-blue-500',
    }
    return colors[color] || colors.cyan
  }

  const getTextColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'text-green-400',
      cyan: 'text-primary-400',
      yellow: 'text-yellow-400',
      blue: 'text-blue-400',
    }
    return colors[color] || colors.cyan
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">{label}</span>
        <span className={`text-sm font-semibold font-mono ${getTextColor(color)}`}>
          {value}%
        </span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`bg-gradient-to-r ${getColorClass(color)} h-2 rounded-full`}
        />
      </div>
    </div>
  )
}

export const SystemStatus = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 noise-overlay"
    >
      <h2 className="text-xl font-bold text-white mb-6">System Status</h2>
      <div className="space-y-4">
        <Metric label="API Response Time" value={15} color="green" />
        <Metric label="CPU Usage" value={23} color="cyan" />
        <Metric label="Memory Usage" value={67} color="yellow" />
        <Metric label="Database Load" value={34} color="blue" />
      </div>
    </motion.div>
  )
}
