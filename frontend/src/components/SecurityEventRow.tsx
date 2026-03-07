import { motion } from 'framer-motion'
import { SecurityEvent } from '@/types'
import { getSeverityColor } from '@/utils'

interface SecurityEventRowProps {
  event: SecurityEvent
  index: number
}

export const SecurityEventRow = ({ event, index }: SecurityEventRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-lg p-4 flex items-center justify-between hover:border-primary-400/40 transition-colors"
    >
      <div className="flex-1">
        <p className="font-semibold text-white mb-1">{event.event}</p>
        <p className="text-sm text-slate-400 font-mono">{event.user}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
            event.severity
          )}`}
        >
          {event.severity.toUpperCase()}
        </span>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-mono">{event.ipAddress}</p>
          <p className="text-xs text-slate-500">
            {new Date(event.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
