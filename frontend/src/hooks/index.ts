import { useState, useEffect } from 'react'
import { ActivityDataPoint, SecurityEvent } from '@/types'
import { generateActivityData, generateSecurityEvents, getRandomChange } from '@/utils'

/**
 * Hook for managing real-time activity data updates
 */
export const useRealtimeData = () => {
  const [activeUsers, setActiveUsers] = useState(47)
  const [totalSessions, setTotalSessions] = useState(1234)
  const [securityScore, setSecurityScore] = useState(98.5)
  const [systemUptime, setSystemUptime] = useState(99.94)
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>(generateActivityData())
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(generateSecurityEvents())

  useEffect(() => {
    // Update stats every 5 seconds
    const interval = setInterval(() => {
      setActiveUsers((prev) => getRandomChange(prev, 20, 60))
      setTotalSessions((prev) => prev + Math.floor(Math.random() * 5))
      setSecurityScore((prev) => Math.min(100, prev + (Math.random() - 0.5) * 0.1))
    }, 5000)

    // Update activity data every 30 seconds
    const activityInterval = setInterval(() => {
      setActivityData(generateActivityData())
    }, 30000)

    // Add new security events every 15 seconds
    const eventsInterval = setInterval(() => {
      setSecurityEvents((prev) => {
        const newEvent = generateSecurityEvents()[0]
        if (!newEvent) return prev
        return [newEvent, ...prev.slice(0, 9)]
      })
    }, 15000)

    return () => {
      clearInterval(interval)
      clearInterval(activityInterval)
      clearInterval(eventsInterval)
    }
  }, [])

  return {
    activeUsers,
    totalSessions,
    securityScore,
    systemUptime,
    activityData,
    securityEvents,
  }
}

/**
 * Hook for current time display
 */
export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return currentTime
}

/**
 * Hook for managing animation states
 */
export const useAnimationState = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timeout)
  }, [delay])

  return isVisible
}
