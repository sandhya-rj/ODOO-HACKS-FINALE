import { useState, useEffect, useCallback } from 'react';
import { api, type Notification } from '@/lib/api';

const DEFAULT_POLL_INTERVAL = 5000; // 5 seconds

export interface UseNotificationsOptions {
  userId: number;
  pollInterval?: number;
  limit?: number;
  enabled?: boolean;
}

export function useNotifications(options: UseNotificationsOptions) {
  const {
    userId,
    pollInterval = DEFAULT_POLL_INTERVAL,
    limit = 20,
    enabled = true,
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  /**
   * Calculate unread count
   */
  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

  /**
   * Fetch notifications from backend
   */
  const fetchNotifications = useCallback(async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await api.notifications.getNotifications(userId, limit);
      
      if (result.success) {
        setNotifications(result.data);
        setLastFetchTime(Date.now());
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch notifications');
      setError(error);
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit, enabled]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const result = await api.notifications.markAsRead(notificationId);
      
      if (result.success) {
        // Update local state optimistically
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId 
              ? { ...n, status: 'READ' as const }
              : n
          )
        );
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  /**
   * Manual refresh
   */
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Set up polling effect
   */
  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchNotifications();

    // Set up polling interval
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, pollInterval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [fetchNotifications, pollInterval, enabled]);

  /**
   * Get unread notifications
   */
  const getUnreadNotifications = useCallback((): Notification[] => {
    return notifications.filter(n => n.status === 'UNREAD');
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    lastFetchTime,
    refresh,
    markAsRead,
    getUnreadNotifications,
  };
}
