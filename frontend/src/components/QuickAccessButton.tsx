import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface QuickAccessButtonProps {
  icon: LucideIcon
  label: string
  description?: string
  status: 'online' | 'offline' | 'standby'
  onClick: () => void
}

export const QuickAccessButton = ({
  icon: Icon,
  label,
  description = 'Click to access',
  status,
  onClick,
}: QuickAccessButtonProps) => {
  const statusConfig = {
    online: {
      color: 'bg-green-400',
      text: 'text-green-400',
      label: 'Online',
      pulse: 'status-online',
    },
    standby: {
      color: 'bg-yellow-400',
      text: 'text-yellow-400',
      label: 'Standby',
      pulse: 'status-warning',
    },
    offline: {
      color: 'bg-slate-400',
      text: 'text-slate-400',
      label: 'Offline',
      pulse: '',
    },
  }

  const config = statusConfig[status]

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass rounded-xl p-4 flex items-center space-x-4 w-full group transition-all duration-300"
    >
      <div className="p-3 rounded-lg bg-primary-500/20 border border-primary-500/30 group-hover:bg-primary-500/30 transition-colors">
        <Icon className="w-5 h-5 text-primary-400" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${config.color} status-dot ${config.pulse}`} />
        <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
      </div>
    </motion.button>
  )
}
