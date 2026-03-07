import { motion } from 'framer-motion'
import { DollarSign } from 'lucide-react'
import { formatCurrency } from '@/utils'

interface CostCardProps {
  currentCost: number
  budget: number
}

export const CostCard = ({ currentCost, budget }: CostCardProps) => {
  const savings = budget - currentCost
  const savingsPercentage = ((savings / budget) * 100).toFixed(0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl p-6 noise-overlay animate-pulse-glow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Monthly Cost</h3>
        <DollarSign className="w-5 h-5 text-green-400" />
      </div>
      <div className="text-center">
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          className="text-5xl font-bold font-mono gradient-text mb-2"
        >
          {formatCurrency(currentCost)}
        </motion.p>
        <p className="text-sm text-slate-400">
          Under budget by{' '}
          <span className="text-green-400 font-semibold">{savingsPercentage}%</span>
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Budget</span>
          <span className="font-mono text-slate-300">{formatCurrency(budget)}</span>
        </div>
      </div>
    </motion.div>
  )
}
