/**
 * Alert Card Component
 * 
 * Displays insights/alerts with severity-based styling.
 * Follows Odoo design principles: clear, enterprise-grade, accessible.
 */

import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Alert } from '@/lib/api';

interface AlertCardProps {
  alert: Alert;
  className?: string;
  onDismiss?: () => void;
}

const severityConfig = {
  high: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    text: 'text-red-900',
    icon: AlertTriangle,
    iconColor: 'text-red-600',
  },
  medium: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    icon: AlertCircle,
    iconColor: 'text-amber-600',
  },
  low: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    icon: Info,
    iconColor: 'text-blue-600',
  },
} as const;

const typeLabels = {
  LEARNER_STRUGGLE: 'Learner Struggle',
  LESSON_PACING_SLOW: 'Slow Pacing',
  LESSON_PACING_FAST: 'Fast Pacing',
  COURSE_DROPOFF: 'Course Dropoff',
  LESSON_DIFFICULT: 'Difficult Lesson',
} as const;

export function AlertCard({ alert, className }: AlertCardProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;
  
  const timestamp = new Date(alert.createdAt);
  const timeAgo = formatTimeAgo(timestamp);

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 transition-all hover:shadow-md',
        config.border,
        config.bg,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-xl bg-white/50', config.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn('text-sm font-semibold', config.text)}>
              {typeLabels[alert.type] || alert.type}
            </h4>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', config.text, 'bg-white/50')}>
              {alert.severity}
            </span>
          </div>
          
          <p className={cn('text-sm mb-2', config.text, 'opacity-90')}>
            {alert.message}
          </p>
          
          <div className="flex items-center gap-3 text-xs opacity-70">
            <span>{alert.source}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Format timestamp as relative time
 */
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  
  return date.toLocaleDateString();
}
