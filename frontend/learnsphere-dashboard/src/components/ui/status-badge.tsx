/**
 * Status Badge Component
 * 
 * Visual indicator for system states (course status, enrollment status, etc.)
 * Follows Odoo design pattern: clear, color-coded, accessible.
 */

import { cn } from '@/lib/utils';
import { CourseStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: CourseStatus | 'completed' | 'in-progress' | 'not-started';
  className?: string;
  size?: 'sm' | 'md';
}

const statusConfig = {
  PUBLISHED: {
    label: 'Published',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  DRAFT: {
    label: 'Draft',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  ARCHIVED: {
    label: 'Archived',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  'not-started': {
    label: 'Not Started',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
} as const;

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </span>
  );
}
