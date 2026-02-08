import { useState, useEffect, useCallback } from 'react';
import { api, type LeaderboardEntry } from '@/lib/api';

// Demo fallback data for when API is unavailable
const DEMO_LEADERBOARD = [
  { userId: 'demo1', name: 'Alice Johnson', email: 'alice@demo.com', totalPoints: 125, completedCourses: 4, rank: 1 },
  { userId: 'demo2', name: 'Bob Chen', email: 'bob@demo.com', totalPoints: 98, completedCourses: 3, rank: 2 },
  { userId: 'demo3', name: 'Carol Smith', email: 'carol@demo.com', totalPoints: 87, completedCourses: 2, rank: 3 },
  { userId: 'demo4', name: 'David Wilson', email: 'david@demo.com', totalPoints: 65, completedCourses: 3, rank: 4 },
  { userId: 'demo5', name: 'Emma Davis', email: 'emma@demo.com', totalPoints: 42, completedCourses: 1, rank: 5 },
];

const DEFAULT_POLL_INTERVAL = 5000; // 5 seconds - faster updates for real-time feel
const MAX_RETRY_ATTEMPTS = 3; // Stop polling after 3 consecutive failures

export interface UseLeaderboardOptions {
  pollInterval?: number;
  enabled?: boolean;
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const {
    pollInterval = DEFAULT_POLL_INTERVAL,
    enabled = true,
  } = options;

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [failureCount, setFailureCount] = useState<number>(0);
  const [pollingDisabled, setPollingDisabled] = useState<boolean>(false);

  /**
   * Fetch leaderboard from backend
   */
  const fetchLeaderboard = useCallback(async () => {
    if (!enabled || pollingDisabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await api.leaderboard.getTopLearners();
      
      if (result.success && Array.isArray(result.data)) {
        setLeaderboard(result.data);
        setLastFetchTime(Date.now());
        setFailureCount(0); // Reset failure count on success
      } else {
        console.warn('Invalid leaderboard response format, using demo data');
        setLeaderboard(DEMO_LEADERBOARD);
      }
    } catch (err) {
      const newFailureCount = failureCount + 1;
      setFailureCount(newFailureCount);
      
      // Stop polling after MAX_RETRY_ATTEMPTS to prevent spam
      if (newFailureCount >= MAX_RETRY_ATTEMPTS) {
        setPollingDisabled(true);
        console.warn(`Leaderboard API failed ${MAX_RETRY_ATTEMPTS} times, disabling polling. Using demo data.`);
      } else {
        // Handle 404 or any API failure gracefully
        if (err instanceof Error && err.message.includes('404')) {
          console.warn(`Leaderboard API not available (404), attempt ${newFailureCount}/${MAX_RETRY_ATTEMPTS}`);
        } else {
          console.warn(`Failed to fetch leaderboard, attempt ${newFailureCount}/${MAX_RETRY_ATTEMPTS}:`, err);
        }
      }
      
      setLeaderboard(DEMO_LEADERBOARD);
      setError(null); // Don't show error state, just use fallback
    } finally {
      setIsLoading(false);
    }
  }, [enabled, pollingDisabled, failureCount]);

  /**
   * Set up polling interval
   */
  useEffect(() => {
    if (!enabled || pollingDisabled) return;

    // Initial fetch
    fetchLeaderboard();

    // Set up polling only if not disabled
    const interval = setInterval(() => {
      if (!pollingDisabled) {
        fetchLeaderboard();
      }
    }, pollInterval);

    // Listen for manual refresh triggers (e.g., after quiz submission)
    const handleRefreshTrigger = () => {
      console.log('Leaderboard refresh triggered by quiz submission');
      fetchLeaderboard();
    };

    // Listen for custom event
    window.addEventListener('leaderboard-refresh', handleRefreshTrigger);

    return () => {
      clearInterval(interval);
      window.removeEventListener('leaderboard-refresh', handleRefreshTrigger);
    };
  }, [enabled, pollingDisabled, pollInterval, fetchLeaderboard]);

  /**
   * Helper to get badge level from points
   */
  const getBadgeLevel = (points: number): string => {
    if (points >= 120) return 'Master';
    if (points >= 100) return 'Expert';
    if (points >= 80) return 'Specialist';
    if (points >= 60) return 'Achiever';
    if (points >= 40) return 'Explorer';
    if (points >= 20) return 'Newbie';
    return 'Beginner';
  };

  /**
   * Helper to get badge color
   */
  const getBadgeColor = (points: number): string => {
    if (points >= 120) return 'text-purple-600';
    if (points >= 100) return 'text-yellow-600';
    if (points >= 80) return 'text-orange-600';
    if (points >= 60) return 'text-blue-600';
    if (points >= 40) return 'text-green-600';
    if (points >= 20) return 'text-gray-600';
    return 'text-gray-400';
  };

  return {
    leaderboard,
    isLoading,
    error,
    lastFetchTime,
    fetchLeaderboard,
    getBadgeLevel,
    getBadgeColor,
  };
}
