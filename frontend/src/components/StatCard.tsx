import { motion } from 'framer-motion'
import { StatCardProps } from '@/types'

export const StatCard = ({
  label,
  value,
  suffix = '',
  change,
  trend,
  icon: Icon,
  color = 'cyan',
}: StatCardProps) => {
  const colorClasses = {
    cyan: 'from-primary-500/20 to-primary-600/10 border-primary-500/30 text-primary-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 noise-overlay relative group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} border`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`text-sm font-semibold font-mono ${
              trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend === 'up' ? '↑' : '↓'} {change}
          </motion.span>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-2">{label}</h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold font-mono gradient-text"
      >
        {value}
        {suffix}
      </motion.p>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-600/10 transition-all duration-300 pointer-events-none" />
    </motion.div>
  )
}
