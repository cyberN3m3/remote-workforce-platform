import { ActivityDataPoint, SecurityEvent } from '@/types'

/**
 * Generates mock activity data for the last 24 hours
 * Fixes TS2322: Now provides both 'hour' and 'time' to match ActivityDataPoint interface
 */
export const generateActivityData = (): ActivityDataPoint[] => {
  const now = Date.now()
  return Array.from({ length: 24 }, (_, i) => {
    const timeString = new Date(now - (23 - i) * 3600000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      hour12: false,
    });

    return {
      // Satisfies the interface requiring both properties
      hour: timeString, 
      time: timeString, 
      users: Math.floor(Math.random() * 30) + 15,
      sessions: Math.floor(Math.random() * 45) + 20,
    };
  });
}

/**
 * Generates mock security events
 */
export const generateSecurityEvents = (): SecurityEvent[] => {
  const events = [
    'Login Success',
    'MFA Verified',
    'File Access',
    'Password Changed',
    'Session Timeout',
    'Permission Denied',
    'API Key Rotated',
    'Security Alert',
  ]
  const severities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high']

  return Array.from({ length: 10 }, (_, i) => ({
    id: `evt-${Date.now()}-${i}`,
    event: events[Math.floor(Math.random() * events.length)] ?? 'Unknown Event',
    user: `employee${Math.floor(Math.random() * 20) + 1}@lawfirm.com`,
    timestamp: new Date(Date.now() - Math.random() * 3600000 * 24).toISOString(),
    severity: severities[Math.floor(Math.random() * severities.length)] ?? 'low',
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  }))
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Get severity color classes
 */
export const getSeverityColor = (severity: 'low' | 'medium' | 'high'): string => {
  const colors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return colors[severity]
}

/**
 * Simulate random stat changes for real-time updates
 */
export const getRandomChange = (current: number, min: number, max: number): number => {
  const change = Math.random() > 0.5 ? 1 : -1
  const newValue = current + change
  return Math.max(min, Math.min(max, newValue))
}
