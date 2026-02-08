import { useState, useEffect, useCallback } from "react";
import { X, Trophy, BookOpen, Star, Bell, AlertTriangle, AlertCircle, TrendingUp, Sparkles, Lightbulb } from "lucide-react";

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  points?: number;
  instructorNotified?: boolean;
  instructorName?: string;
  timestamp: number;
  // Smart performance fields
  severity?: 'critical' | 'warning' | 'info' | 'success' | 'excellent';
  percentage?: number;
  recommendation?: string;
}

// Severity-based icon selection for quiz notifications
function getNotificationIcon(type: string, severity?: string): React.ReactNode {
  if (type === 'QUIZ_SUBMITTED' && severity) {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'info': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'success': return <Star className="h-5 w-5 text-green-500" />;
      case 'excellent': return <Sparkles className="h-5 w-5 text-emerald-500" />;
    }
  }
  const ICON_MAP: Record<string, React.ReactNode> = {
    COURSE_COMPLETED: <BookOpen className="h-5 w-5 text-green-500" />,
    QUIZ_SUBMITTED: <Star className="h-5 w-5 text-yellow-500" />,
    ACHIEVEMENT_EARNED: <Trophy className="h-5 w-5 text-purple-500" />,
    DEFAULT: <Bell className="h-5 w-5 text-blue-500" />,
  };
  return ICON_MAP[type] || ICON_MAP.DEFAULT;
}

// Severity-based background/border colors
function getNotificationStyle(type: string, severity?: string): string {
  if (type === 'QUIZ_SUBMITTED' && severity) {
    switch (severity) {
      case 'critical': return "border-l-red-500 bg-red-50 dark:bg-red-950/30";
      case 'warning': return "border-l-orange-500 bg-orange-50 dark:bg-orange-950/30";
      case 'info': return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/30";
      case 'success': return "border-l-green-500 bg-green-50 dark:bg-green-950/30";
      case 'excellent': return "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
    }
  }
  const BG_MAP: Record<string, string> = {
    COURSE_COMPLETED: "border-l-green-500 bg-green-50 dark:bg-green-950/30",
    QUIZ_SUBMITTED: "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
    ACHIEVEMENT_EARNED: "border-l-purple-500 bg-purple-50 dark:bg-purple-950/30",
    DEFAULT: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/30",
  };
  return BG_MAP[type] || BG_MAP.DEFAULT;
}

// Severity label badge
function getSeverityBadge(severity?: string): React.ReactNode {
  if (!severity) return null;
  const styles: Record<string, string> = {
    critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    success: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    excellent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  };
  const labels: Record<string, string> = {
    critical: "Needs Attention",
    warning: "Below Average",
    info: "Good Progress",
    success: "Strong",
    excellent: "Outstanding",
  };
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${styles[severity] || ''}`}>
      {labels[severity] || severity}
    </span>
  );
}

let idCounter = 0;

export function NotificationPopup() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    const handleNotification = (e: CustomEvent) => {
      const detail = e.detail;
      const newNotif: NotificationItem = {
        id: ++idCounter,
        type: detail.type || "DEFAULT",
        title: detail.title || "Notification",
        message: detail.message || "",
        points: detail.points,
        instructorNotified: detail.instructorNotified,
        instructorName: detail.instructorName,
        timestamp: Date.now(),
        // Smart performance fields
        severity: detail.severity,
        percentage: detail.percentage,
        recommendation: detail.recommendation,
      };

      setNotifications((prev) => [newNotif, ...prev].slice(0, 5));

      // Critical alerts stay longer (12s), others 8s
      const dismissTime = detail.severity === 'critical' || detail.severity === 'warning' ? 12000 : 8000;
      setTimeout(() => {
        removeNotification(newNotif.id);
      }, dismissTime);
    };

    window.addEventListener(
      "learnsphere-notification",
      handleNotification as EventListener
    );
    return () => {
      window.removeEventListener(
        "learnsphere-notification",
        handleNotification as EventListener
      );
    };
  }, [removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-96 max-w-[calc(100vw-2rem)]">
      {notifications.map((notif, index) => (
        <div
          key={notif.id}
          className={`
            border-l-4 rounded-lg shadow-xl p-4 
            backdrop-blur-sm border border-border/50
            animate-in slide-in-from-right-full fade-in duration-300
            ${getNotificationStyle(notif.type, notif.severity)}
          `}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              {getNotificationIcon(notif.type, notif.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-foreground">
                  {notif.title}
                </h4>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {notif.message}
              </p>
              {/* Severity badge + percentage for quiz results */}
              {notif.severity && (
                <div className="flex items-center gap-2 mt-2">
                  {getSeverityBadge(notif.severity)}
                  {notif.percentage !== undefined && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {notif.percentage}%
                    </span>
                  )}
                </div>
              )}
              {/* Actionable recommendation */}
              {notif.recommendation && (
                <div className={`mt-2 p-2 rounded-md text-xs ${
                  notif.severity === 'critical' ? 'bg-red-100/60 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
                  notif.severity === 'warning' ? 'bg-orange-100/60 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' :
                  notif.severity === 'success' || notif.severity === 'excellent' ? 'bg-green-100/60 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                  'bg-blue-100/60 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                }`}>
                  <Lightbulb className="h-3 w-3 inline mr-1" />{notif.recommendation}
                </div>
              )}
              <div className="flex items-center gap-3 mt-2">
                {notif.points !== undefined && notif.points > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                    <Trophy className="h-3 w-3" />+{notif.points} points
                  </span>
                )}
                {notif.instructorNotified && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                    <Bell className="h-3 w-3" />
                    {notif.instructorName || "Instructor"} notified
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Progress bar for auto-dismiss */}
          <div className="mt-3 h-0.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-current opacity-30 rounded-full"
              style={{
                animation: `shrink-width ${notif.severity === 'critical' || notif.severity === 'warning' ? 12 : 8}s linear forwards`,
              }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes shrink-width {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
