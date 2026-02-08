import { Trophy, Crown, Medal, User as UserIcon, RefreshCw } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LeaderboardCardProps {
  className?: string;
}

export function LeaderboardCard({ className = '' }: LeaderboardCardProps) {
  const { leaderboard, isLoading, getBadgeLevel, getBadgeColor } = useLeaderboard();

  // Demo user ID (Sandhya RJ)
  const CURRENT_USER_ID = 'cac7caff-6f69-483f-a39d-50abbf8f54ac';

  /**
   * Get rank icon based on position
   */
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
  };

  /**
   * Get avatar initials from name
   */
  const getInitials = (name: string): string => {
    if (!name || typeof name !== 'string') {
      return 'U';
    }
    
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0][0];
      const second = parts[1][0];
      if (first && second) {
        return `${first}${second}`.toUpperCase();
      }
    }
    
    return name.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <Card className={`p-6 border-border/40 rounded-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold">Top Learners</h3>
        </div>
        {isLoading && (
          <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboard.length === 0 && !isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No learners yet. Start completing lessons to appear here!
          </p>
        ) : (
          leaderboard.map((learner) => {
            const badgeLevel = getBadgeLevel(learner.totalPoints);
            const badgeColor = getBadgeColor(learner.totalPoints);

            return (
              <div
                key={learner.userId}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/40 hover:shadow-md transition-all duration-200"
              >
                {/* Rank Icon */}
                <div className="flex-shrink-0 w-8 flex items-center justify-center">
                  {getRankIcon(learner.rank)}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/15 to-blue-500/10 flex items-center justify-center ring-2 ring-primary/10">
                    <span className="text-xs font-semibold text-primary">
                      {getInitials(learner.name)}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {learner.name}
                    {learner.userId === CURRENT_USER_ID && (
                      <span className="text-primary font-bold"> [ME]</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-xs ${badgeColor}`}>
                      {badgeLevel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {learner.completedCourses} {learner.completedCourses === 1 ? 'course' : 'courses'}
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-primary">{learner.totalPoints}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Note */}
      {leaderboard.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Auto-updates every 5 seconds
        </p>
      )}
    </Card>
  );
}
