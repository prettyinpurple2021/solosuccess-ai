"use client"

export interface NotificationPermissionState {
  supported: boolean
  permission: NotificationPermission
  subscription: PushSubscription | null
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
}

export interface ScheduledNotification {
  id: string
  payload: NotificationPayload
  scheduledTime: Date
  type: 'task_reminder' | 'goal_deadline' | 'workload_alert' | 'productivity_tip'
  taskId?: string
  goalId?: string
}

export class WebPushNotificationManager {
  private static instance: WebPushNotificationManager
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map()
  
  // VAPID keys for web push (replace with your own)
  private readonly VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HvcCXvbdliMKvaV4MV8A3wfUFHVN1oNPROl56W4gNqVIwOqhH7nJ1EIIvg'
  
  static getInstance(): WebPushNotificationManager {
    if (!WebPushNotificationManager.instance) {
      WebPushNotificationManager.instance = new WebPushNotificationManager()
    }
    return WebPushNotificationManager.instance
  }

  /**
   * Check if web push notifications are supported
   */
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    )
  }

  /**
   * Get current notification permission state
   */
  async getPermissionState(): Promise<NotificationPermissionState> {
    if (!this.isSupported()) {
      return {
        supported: false,
        permission: 'denied',
        subscription: null
      }
    }

    const registration = await this.getServiceWorkerRegistration()
    const subscription = registration ? await registration.pushManager.getSubscription() : null

    return {
      supported: true,
      permission: Notification.permission,
      subscription
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Web Push notifications are not supported')
    }

    const permission = await Notification.requestPermission()
    
    // Store permission preference
    localStorage.setItem('solosuccess_notification_permission', permission)
    
    return permission
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription> {
    const permission = await this.requestPermission()
    
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted')
    }

    const registration = await this.getServiceWorkerRegistration()
    if (!registration) {
      throw new Error('Service worker not registered')
    }

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription()
    
    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(this.VAPID_PUBLIC_KEY) as any
      })
    }

    // Store subscription info
    localStorage.setItem('solosuccess_push_subscription', JSON.stringify(subscription))
    
    // Send subscription to server
    await this.sendSubscriptionToServer(subscription)
    
    return subscription
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    const registration = await this.getServiceWorkerRegistration()
    if (!registration) return false

    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) return false

    const success = await subscription.unsubscribe()
    
    if (success) {
      // Remove from localStorage
      localStorage.removeItem('solosuccess_push_subscription')
      
      // Notify server
      await this.removeSubscriptionFromServer(subscription)
    }
    
    return success
  }

  /**
   * Show local notification
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      console.warn('Cannot show notification: permission not granted')
      return
    }

    const registration = await this.getServiceWorkerRegistration()
    if (!registration) {
      // Fallback to browser notification
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/images/logo.png',
        badge: payload.badge || '/images/logo.png',
        data: payload.data,
        tag: payload.tag,
        requireInteraction: payload.requireInteraction,
        silent: payload.silent
      } as any)
    } else {
      // Use service worker notification
      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/images/logo.png',
        badge: payload.badge || '/images/logo.png',
        data: payload.data,
        actions: payload.actions || [],
        tag: payload.tag,
        requireInteraction: payload.requireInteraction,
        silent: payload.silent
      } as any)
    }
  }

  /**
   * Schedule a notification for later
   */
  scheduleNotification(notification: ScheduledNotification): void {
    const timeUntilNotification = notification.scheduledTime.getTime() - Date.now()
    
    if (timeUntilNotification <= 0) {
      // Show immediately
      this.showNotification(notification.payload)
      return
    }

    // Clear existing scheduled notification with same ID
    this.cancelScheduledNotification(notification.id)
    
    // Schedule new notification
    const timeout = setTimeout(() => {
      this.showNotification(notification.payload)
      this.scheduledNotifications.delete(notification.id)
    }, timeUntilNotification)
    
    this.scheduledNotifications.set(notification.id, timeout)
    
    // Store in localStorage for persistence
    const scheduled = this.getScheduledNotifications()
    scheduled.push(notification)
    localStorage.setItem('solosuccess_scheduled_notifications', JSON.stringify(scheduled))
  }

  /**
   * Cancel a scheduled notification
   */
  cancelScheduledNotification(id: string): void {
    const timeout = this.scheduledNotifications.get(id)
    if (timeout) {
      clearTimeout(timeout)
      this.scheduledNotifications.delete(id)
    }
    
    // Remove from localStorage
    const scheduled = this.getScheduledNotifications().filter(n => n.id !== id)
    localStorage.setItem('solosuccess_scheduled_notifications', JSON.stringify(scheduled))
  }

  /**
   * Get all scheduled notifications
   */
  getScheduledNotifications(): ScheduledNotification[] {
    const stored = localStorage.getItem('solosuccess_scheduled_notifications')
    if (!stored) return []
    
    try {
      return JSON.parse(stored).map((n: any) => ({
        ...n,
        scheduledTime: new Date(n.scheduledTime)
      }))
    } catch (error) {
      console.error('Error parsing scheduled notifications:', error)
      return []
    }
  }

  /**
   * Restore scheduled notifications after page load
   */
  restoreScheduledNotifications(): void {
    const notifications = this.getScheduledNotifications()
    const now = new Date()
    
    notifications.forEach(notification => {
      if (notification.scheduledTime > now) {
        this.scheduleNotification(notification)
      }
    })
  }

  /**
   * Create smart task reminder notification
   */
  scheduleTaskReminder(taskId: string, taskTitle: string, dueDate: Date, priority: string): void {
    const reminderTime = new Date(dueDate.getTime() - (60 * 60 * 1000)) // 1 hour before
    
    if (reminderTime <= new Date()) return // Don't schedule past reminders
    
    const urgencyEmoji = priority === 'urgent' ? '🚨' : priority === 'high' ? '⚡' : '📋'
    
    this.scheduleNotification({
      id: `task_reminder_${taskId}`,
      type: 'task_reminder',
      taskId,
      scheduledTime: reminderTime,
      payload: {
        title: `${urgencyEmoji} Task Due Soon`,
        body: `"${taskTitle}" is due in 1 hour`,
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        tag: `task_${taskId}`,
        requireInteraction: priority === 'urgent',
        vibrate: priority === 'urgent' ? [300, 100, 300, 100, 300] : [200, 100, 200],
        actions: [
          {
            action: 'complete_task',
            title: 'Mark Complete',
            icon: '/images/logo.png'
          },
          {
            action: 'view_task',
            title: 'View Task',
            icon: '/images/logo.png'
          }
        ],
        data: {
          type: 'task_reminder',
          taskId,
          url: `/dashboard/slaylist?task=${taskId}`
        }
      }
    })
  }

  /**
   * Create workload alert notification
   */
  scheduleWorkloadAlert(workloadScore: number, recommendations: string[]): void {
    if (workloadScore < 80) return // Only alert for high workload
    
    const alertTime = new Date(Date.now() + (30 * 60 * 1000)) // 30 minutes from now
    
    this.scheduleNotification({
      id: `workload_alert_${Date.now()}`,
      type: 'workload_alert',
      scheduledTime: alertTime,
      payload: {
        title: '🚨 High Workload Detected',
        body: `Your workload score is ${workloadScore}/100. ${recommendations[0] || 'Consider taking a break.'}`,
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        tag: 'workload_alert',
        requireInteraction: true,
        vibrate: [300, 100, 300],
        actions: [
          {
            action: 'view_dashboard',
            title: 'View Dashboard',
            icon: '/images/logo.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/images/logo.png'
          }
        ],
        data: {
          type: 'workload_alert',
          url: '/dashboard',
          workloadScore,
          recommendations
        }
      }
    })
  }

  /**
   * Private helper methods
   */
  private async getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null
    
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      return registration || null
    } catch (error) {
      console.error('Error getting service worker registration:', error)
      return null
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          subscription: subscription.toJSON()
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to send subscription to server')
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error)
    }
  }

  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          subscription: subscription.toJSON()
        })
      })
    } catch (error) {
      console.error('Error removing subscription from server:', error)
    }
  }

  private urlB64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    
    return outputArray
  }
}

// Export singleton instance
export const webPushManager = WebPushNotificationManager.getInstance()