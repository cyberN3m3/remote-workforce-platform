import { useState } from 'react'
import {
  Activity,
  Shield,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Server,
  Database,
  Zap,
  Terminal,
  Lock,
} from 'lucide-react'

import { useRealtimeData, useCurrentTime } from '@/hooks'


function App() {
  const {
    activeUsers,

    securityScore,
    systemUptime,
    activityData,
    securityEvents,
  } = useRealtimeData()

  const currentTime = useCurrentTime()
  const [selectedTab, setSelectedTab] = useState<'overview' | 'security' | 'activity'>('overview')

  // Calculate metrics
const healthyScore = Math.round(securityScore * 1)
const uptime = Math.round(systemUptime * 1)
  const totalEvents = securityEvents.length
  const criticalEvents = securityEvents.filter(e => e.severity === 'high').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white dark:text-slate-900" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
                  SecureHire
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Workforce Platform</p>
              </div>
            </div>

            {/* System Status */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-slate-600 dark:text-slate-400">All systems operational</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">
            Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor your remote workforce infrastructure
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
          <nav className="flex space-x-8">
            {(['overview', 'security', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === tab
                    ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Users */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Active Users
              </span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white">
                {activeUsers}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                +12%
              </span>
            </div>
            <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              vs last week
            </div>
          </div>

          {/* Security Score */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Security Score
              </span>
              <Shield className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white">
                {healthyScore}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/100</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${healthyScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Uptime */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                System Uptime
              </span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white">
                {uptime.toFixed(2)}%
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Last 30 days
            </div>
          </div>

          {/* Critical Events */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Critical Events
              </span>
              <AlertCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white">
                {criticalEvents}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                / {totalEvents}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Requires attention
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Activity Overview
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Last 24 hours
                  </p>
                </div>
                <button className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  View details →
                </button>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="h-64 flex items-end space-x-2">
                {activityData.map((point, i) => {
                  const height = (point.users / Math.max(...activityData.map(p => p.users))) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group">
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                        <div
                          className="w-full bg-slate-900 dark:bg-slate-100 rounded-t transition-all"
                          style={{ height: `${height * 2.4}px` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                        {point.hour}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Security Events */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Recent Events
                </h3>
                <button className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  View all →
                </button>
              </div>
              
              <div className="space-y-3">
                {securityEvents.slice(0, 6).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {event.severity === 'high' ? (
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                      ) : event.severity === 'medium' ? (
                        <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                      ) : (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {event.event}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {event.user}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono ml-4 flex-shrink-0">
                      {new Date(event.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                System Health
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'API Gateway', status: 'operational', icon: Server },
                  { name: 'Database', status: 'operational', icon: Database },
                  { name: 'Auth Service', status: 'operational', icon: Lock },
                  { name: 'Workers', status: 'operational', icon: Zap },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <service.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {service.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {service.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">
                  <Terminal className="w-4 h-4 inline mr-2 text-slate-400" />
                  Open Terminal
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">
                  <Activity className="w-4 h-4 inline mr-2 text-slate-400" />
                  View Logs
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">
                  <Shield className="w-4 h-4 inline mr-2 text-slate-400" />
                  Security Settings
                </button>
              </div>
            </div>

            {/* Cost Tracker */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Monthly Cost
              </h3>
              <div className="mb-4">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                    $1.30
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">/ $2.00</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  65% of budget used
                </p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-slate-900 dark:bg-white h-2 rounded-full transition-all"
                  style={{ width: '65%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            <p>SecureHire Platform v1.0 • Deployed with Terraform • {uptime.toFixed(2)}% Uptime</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
