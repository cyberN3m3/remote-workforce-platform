import { motion } from 'framer-motion'
import {
  Users,
  Shield,
  Zap,
  Monitor,
  Key,
  Clock,
  BarChart3,
  Lock,
} from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { QuickAccessButton } from '@/components/QuickAccessButton'
import { SecurityEventRow } from '@/components/SecurityEventRow'
import { ActivityChart } from '@/components/ActivityChart'
import { SystemStatus } from '@/components/SystemStatus'
import { CostCard } from '@/components/CostCard'
import { useRealtimeData, useCurrentTime } from '@/hooks'
import { formatPercentage } from '@/utils'

function App() {
  const {
    activeUsers,
    
    securityScore,
    systemUptime,
    activityData,
    securityEvents,
  } = useRealtimeData()

  const currentTime = useCurrentTime()

  const handleQuickAccess = (service: string) => {
    alert(`Opening ${service}... (This would redirect to the actual service)`)
  }

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/50"
          >
            <Lock className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold gradient-text tracking-tight">SecureHire</h1>
            <p className="text-slate-400 text-sm">Remote Workforce Management Platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm text-slate-400">System Time</p>
            <p className="text-lg font-semibold font-mono text-primary-400">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg border-2 border-primary-400/50 cursor-pointer"
          >
            A
          </motion.div>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <StatCard
          icon={Users}
          label="Active Users"
          value={activeUsers}
          change="12%"
          trend="up"
          color="cyan"
        />
        <StatCard
          icon={Shield}
          label="Security Score"
          value={formatPercentage(securityScore, 1)}
          change="2.3%"
          trend="up"
          color="green"
        />
        <StatCard
          icon={Zap}
          label="System Uptime"
          value={formatPercentage(systemUptime, 2)}
          change="0.06%"
          trend="up"
          color="purple"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Chart */}
          <ActivityChart data={activityData} />

          {/* Security Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-6 noise-overlay"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Security Events</h2>
              <button className="text-primary-400 text-sm font-semibold hover:text-primary-300 transition-colors">
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {securityEvents.slice(0, 5).map((event, index) => (
                <SecurityEventRow key={event.id} event={event} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Quick Access and Status */}
        <div className="space-y-6">
          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6 noise-overlay"
          >
            <h2 className="text-xl font-bold text-white mb-6">Quick Access</h2>
            <div className="space-y-3">
              <QuickAccessButton
                icon={Monitor}
                label="Remote Desktop"
                description="Apache Guacamole"
                status="online"
                onClick={() => handleQuickAccess('Remote Desktop')}
              />
              <QuickAccessButton
                icon={Key}
                label="Password Vault"
                description="Bitwarden"
                status="online"
                onClick={() => handleQuickAccess('Password Vault')}
              />
              <QuickAccessButton
                icon={Clock}
                label="Time Tracker"
                description="Session monitoring"
                status="online"
                onClick={() => handleQuickAccess('Time Tracker')}
              />
              <QuickAccessButton
                icon={BarChart3}
                label="Monitoring"
                description="Prometheus + Grafana"
                status="online"
                onClick={() => handleQuickAccess('Monitoring')}
              />
            </div>
          </motion.div>

          {/* System Status */}
          <SystemStatus />

          {/* Monthly Cost */}
          <CostCard currentCost={1.3} budget={2.0} />
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center text-slate-500 text-sm"
      >
        <p className="font-mono">
          SecureHire Platform v1.0 | Deployed via Terraform |{' '}
          <span className="text-primary-400">{formatPercentage(systemUptime, 2)} Uptime</span>
        </p>
      </motion.footer>
    </div>
  )
}

export default App
