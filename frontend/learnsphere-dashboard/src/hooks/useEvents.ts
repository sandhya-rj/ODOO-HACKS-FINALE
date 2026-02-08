import { useState, useEffect, useCallback, useRef } from 'react';
import { api, type Event } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_POLL_INTERVAL = 5000; // 5 seconds

export interface UseEventsOptions {
  userId: number | string;
  pollInterval?: number;
  limit?: number;
  enabled?: boolean;
  enableToasts?: boolean;
  isInstructor?: boolean; // NEW: fetch events for courses managed by instructor
}

export function useEvents(options: UseEventsOptions) {
  const {
    userId,
    pollInterval = DEFAULT_POLL_INTERVAL,
    limit = 20,
    enabled = true,
    enableToasts = false,
    isInstructor = false, // NEW
  } = options;

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const { toast } = useToast();
  
  // Track previous event IDs to detect new events
  const previousEventIdsRef = useRef<Set<string>>(new Set());
  const isInitialFetchRef = useRef(true);

  /**
   * Get human-readable message from event
   */
  const getEventMessage = (event: Event): string => {
    // Parse metadata if it's a JSON string
    const metadata = typeof event.metadata === 'string' 
      ? JSON.parse(event.metadata) 
      : event.metadata;
    
    switch (event.type) {
      case 'LESSON_COMPLETED':
        return `User ${event.userId.substring(0, 8)}... completed a lesson${metadata.lessonTitle ? `: ${metadata.lessonTitle}` : ''}`;
      case 'QUIZ_SUBMITTED':
        return `User ${event.userId.substring(0, 8)}... submitted a quiz${metadata.quizTitle ? `: ${metadata.quizTitle}` : ''}${metadata.score ? ` (Score: ${metadata.score}/${metadata.totalQuestions})` : ''}`;
      case 'COURSE_ENROLLED':
        return `User ${event.userId.substring(0, 8)}... enrolled in a course${metadata.courseTitle ? `: ${metadata.courseTitle}` : ''}`;
      case 'ACHIEVEMENT_EARNED':
        return `User ${event.userId.substring(0, 8)}... earned an achievement${metadata.achievementName ? `: ${metadata.achievementName}` : ''}`;
      case 'PROGRESS_MILESTONE':
        return `User ${event.userId.substring(0, 8)}... reached a milestone${metadata.milestone ? `: ${metadata.milestone}` : ''}`;
      case 'COURSE_COMPLETED':
        return `User ${event.userId.substring(0, 8)}... completed a course${metadata.courseTitle ? `: ${metadata.courseTitle}` : ''}`;
      default:
        return `New activity from User ${event.userId.substring(0, 8)}...`;
    }
  };

  /**
   * Fetch events from backend
   */
  const fetchEvents = useCallback(async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use instructor endpoint if isInstructor is true
      const result = isInstructor 
        ? await api.events.getInstructorEvents(String(userId), limit)
        : await api.events.getEvents(Number(userId), limit);
      
      if (result.success && Array.isArray(result.data)) {
        const currentEventIds = new Set(result.data.map(e => e?.id).filter(Boolean));
        
        // Detect NEW events (not in previous fetch)
        if (!isInitialFetchRef.current && enableToasts) {
          const newEvents = result.data.filter(
            event => event && event.id && !previousEventIdsRef.current.has(event.id)
          );
          
          // Show toast for each new event
          newEvents.forEach(event => {
            toast({
              title: "New Learner Activity",
              description: getEventMessage(event),
              variant: "default",
            });
          });
        }
        
        // Update state
        setEvents(result.data);
        previousEventIdsRef.current = currentEventIds;
        setLastFetchTime(Date.now());
        
        // Mark initial fetch as complete
        if (isInitialFetchRef.current) {
          isInitialFetchRef.current = false;
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch events');
      setError(error);
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit, enabled, enableToasts, isInstructor, toast]);

  /**
   * Manual refresh
   */
  const refresh = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  /**
   * Set up polling effect
   */
  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchEvents();

    // Set up polling interval
    const intervalId = setInterval(() => {
      fetchEvents();
    }, pollInterval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [fetchEvents, pollInterval, enabled]);

  /**
   * Get events by type
   */
  const getEventsByType = useCallback(
    (eventType: Event['type']): Event[] => {
      return events.filter(e => e.type === eventType);
    },
    [events]
  );

  /**
   * Get recent events (last N events)
   */
  const getRecentEvents = useCallback(
    (count: number): Event[] => {
      return events.slice(0, count);
    },
    [events]
  );

  return {
    events,
    isLoading,
    error,
    lastFetchTime,
    refresh,
    getEventsByType,
    getRecentEvents,
  };
}
