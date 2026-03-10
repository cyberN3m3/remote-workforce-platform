import { ReactNode } from "react"

export interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'employee' | 'paralegal'
  lastLogin: string
  status: 'online' | 'offline' | 'away'
}

export interface ActivityDataPoint {
  hour: ReactNode
  time: string
  users: number
  sessions: number
}

export interface SecurityEvent {
  id: string
  event: string
  user: string
  timestamp: string
  severity: 'low' | 'medium' | 'high'
  ipAddress: string
  metadata?: Record<string, unknown>
}

export interface SystemMetric {
  label: string
  value: number
  unit: string
  trend?: 'up' | 'down'
  change?: string
}

export interface QuickAccessItem {
  id: string
  label: string
  description: string
  status: 'online' | 'offline' | 'standby'
  url: string
  icon: string
}

export interface StatCardProps {
  label: string
  value: number | string
  suffix?: string
  change?: string
  trend?: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  color?: 'cyan' | 'green' | 'purple' | 'yellow' | 'red'
}
