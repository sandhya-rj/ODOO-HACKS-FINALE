import { useEffect, useState } from "react";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  Brain,
  Target,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const API_BASE = "http://localhost:5000";
const DEMO_USER_UUID = "cac7caff-6f69-483f-a39d-50abbf8f54ac";

// Course ID mapping
const courseIdToBackend: Record<string, string> = {
  "1": "course-javascript-fundamentals",
  "2": "course-react-essentials",
  "3": "course-javascript-fundamentals",
  "4": "course-react-essentials",
  "5": "course-javascript-fundamentals",
  "6": "course-react-essentials",
};

// Course-specific topic names
const courseTopicMap: Record<string, string> = {
  "1": "JavaScript Fundamentals",
  "2": "React Essentials",
  "3": "Business Strategy",
  "4": "UX Design",
  "5": "Machine Learning",
  "6": "Data Science with Python",
};

interface LearnerInsight {
  id: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  type: "pace" | "performance" | "streak" | "recommendation" | "milestone";
  severity: "positive" | "neutral" | "warning" | "critical";
}

interface PaceData {
  avgTimeBetweenAttempts: number; // seconds
  paceLabel: string; // "Fast", "Steady", "Slow"
  paceColor: string;
  paceIcon: React.ReactNode;
  quizAttempts: number;
  avgScore: number;
  bestScore: number;
  worstScore: number;
  scoreTrajectory: "improving" | "declining" | "stable";
  consistencyScore: number; // 0-100
  engagementLevel: string; // "Highly Engaged", "Active", "Casual", "At Risk"
  insights: LearnerInsight[];
  coursesCompleted: number;
  totalPointsThisSession: number;
  scoreHistory: number[];
}

/**
 * Compute learning pace from real events.
 */
function computePaceData(
  events: any[],
  courseId: string,
  courseName: string
): PaceData {
  const backendCourseId = courseIdToBackend[courseId] || courseId;

  // Filter quiz events for this user
  const allMyQuizEvents = events
    .filter(
      (e: any) =>
        e.type === "QUIZ_COMPLETED" && e.userId === DEMO_USER_UUID
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const courseQuizEvents = allMyQuizEvents.filter(
    (e: any) => e.metadata?.courseId === backendCourseId
  );

  const courseCompletedEvents = events.filter(
    (e: any) =>
      e.type === "COURSE_COMPLETED" && e.userId === DEMO_USER_UUID
  );

  const scores = courseQuizEvents.map(
    (e: any) => e.metadata?.percentage ?? 0
  );
  const allScores = allMyQuizEvents.map(
    (e: any) => e.metadata?.percentage ?? 0
  );
  const totalPoints = allMyQuizEvents.reduce(
    (sum: number, e: any) => sum + (e.metadata?.pointsAwarded ?? 0),
    0
  );

  // Pace calculation — time between quiz attempts
  let avgTimeBetweenAttempts = 0;
  if (courseQuizEvents.length >= 2) {
    const times = courseQuizEvents.map((e: any) =>
      new Date(e.createdAt).getTime()
    );
    const diffs: number[] = [];
    for (let i = 1; i < times.length; i++) {
      diffs.push((times[i] - times[i - 1]) / 1000);
    }
    avgTimeBetweenAttempts = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  }

  // Pace labeling
  let paceLabel = "Getting Started";
  let paceColor = "text-blue-500";
  let paceIcon = <Clock className="h-5 w-5 text-blue-500" />;
  if (courseQuizEvents.length >= 2) {
    if (avgTimeBetweenAttempts < 120) {
      paceLabel = "Speed Learner";
      paceColor = "text-emerald-500";
      paceIcon = <Zap className="h-5 w-5 text-emerald-500" />;
    } else if (avgTimeBetweenAttempts < 600) {
      paceLabel = "Steady Pace";
      paceColor = "text-blue-500";
      paceIcon = <TrendingUp className="h-5 w-5 text-blue-500" />;
    } else {
      paceLabel = "Taking It Slow";
      paceColor = "text-amber-500";
      paceIcon = <Clock className="h-5 w-5 text-amber-500" />;
    }
  }

  // Score trajectory
  let scoreTrajectory: "improving" | "declining" | "stable" = "stable";
  if (scores.length >= 2) {
    const recentHalf = scores.slice(Math.floor(scores.length / 2));
    const olderHalf = scores.slice(0, Math.floor(scores.length / 2));
    const recentAvg =
      recentHalf.reduce((a: number, b: number) => a + b, 0) /
      recentHalf.length;
    const olderAvg =
      olderHalf.reduce((a: number, b: number) => a + b, 0) /
      olderHalf.length;
    if (recentAvg - olderAvg > 10) scoreTrajectory = "improving";
    else if (olderAvg - recentAvg > 10) scoreTrajectory = "declining";
  }

  // Consistency score (lower std deviation = more consistent)
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : 0;
  const variance =
    scores.length > 0
      ? scores.reduce(
          (sum: number, s: number) => sum + Math.pow(s - avgScore, 2),
          0
        ) / scores.length
      : 0;
  const stdDev = Math.sqrt(variance);
  const consistencyScore = Math.max(0, Math.round(100 - stdDev * 2));

  // Engagement level
  let engagementLevel = "Getting Started";
  if (allMyQuizEvents.length >= 5) engagementLevel = "Highly Engaged";
  else if (allMyQuizEvents.length >= 3) engagementLevel = "Active Learner";
  else if (allMyQuizEvents.length >= 1) engagementLevel = "Warming Up";

  // Generate insights
  const insights: LearnerInsight[] = [];

  // Pace insight
  if (courseQuizEvents.length >= 2) {
    const minutes = Math.round(avgTimeBetweenAttempts / 60);
    insights.push({
      id: "pace-speed",
      icon: paceIcon,
      title: "Learning Pace",
      message:
        avgTimeBetweenAttempts < 120
          ? `You're blazing through ${courseName}! Avg ${minutes < 1 ? "< 1" : minutes} min between attempts. Your quick iteration shows strong engagement.`
          : avgTimeBetweenAttempts < 600
            ? `Solid pace on ${courseName} — averaging ${minutes} min between quiz attempts. You're reviewing material thoughtfully.`
            : `Taking ${minutes} min between attempts on ${courseName}. Consider shorter, focused study sessions for better retention.`,
      type: "pace",
      severity: avgTimeBetweenAttempts < 300 ? "positive" : "neutral",
    });
  }

  // Performance trajectory
  if (scores.length >= 2) {
    insights.push({
      id: "trajectory",
      icon:
        scoreTrajectory === "improving" ? (
          <ArrowUpRight className="h-5 w-5 text-emerald-500" />
        ) : scoreTrajectory === "declining" ? (
          <ArrowDownRight className="h-5 w-5 text-red-500" />
        ) : (
          <BarChart3 className="h-5 w-5 text-blue-500" />
        ),
      title: "Score Trajectory",
      message:
        scoreTrajectory === "improving"
          ? `Your scores are trending upward! You went from ${scores[0]}% to ${scores[scores.length - 1]}%. The extra practice is paying off.`
          : scoreTrajectory === "declining"
            ? `Scores dipping — latest ${scores[scores.length - 1]}% vs earlier ${scores[0]}%. Try reviewing the core concepts before your next attempt.`
            : `Consistent performance at ~${avgScore}%. To level up, focus on the topics you're getting wrong.`,
      type: "performance",
      severity:
        scoreTrajectory === "improving"
          ? "positive"
          : scoreTrajectory === "declining"
            ? "warning"
            : "neutral",
    });
  }

  // Struggle detection
  if (scores.length >= 2 && avgScore < 50) {
    insights.push({
      id: "struggle",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      title: "Needs Attention",
      message: `Your avg score is ${avgScore}% across ${scores.length} attempts. We recommend re-reading the lesson material, especially the sections on key concepts. Don't give up — mastery takes time!`,
      type: "recommendation",
      severity: "critical",
    });
  }

  // Mastery detection
  if (scores.length > 0 && avgScore >= 85) {
    insights.push({
      id: "mastery",
      icon: <Sparkles className="h-5 w-5 text-emerald-500" />,
      title: "Near Mastery!",
      message: `Outstanding! ${avgScore}% average on ${courseName}. You're demonstrating strong command of this material. Consider trying a harder course!`,
      type: "milestone",
      severity: "positive",
    });
  }

  // Consistency insight
  if (scores.length >= 3) {
    insights.push({
      id: "consistency",
      icon: <Target className="h-5 w-5 text-purple-500" />,
      title: "Consistency Score",
      message:
        consistencyScore >= 80
          ? `${consistencyScore}% consistent — you perform reliably. This is a key indicator of genuine understanding, not just luck.`
          : consistencyScore >= 50
            ? `${consistencyScore}% consistency — your scores fluctuate. Try to identify which specific topics cause dips.`
            : `${consistencyScore}% consistency — your scores vary a lot (${Math.min(...scores)}% to ${Math.max(...scores)}%). Break the material into smaller chunks and master each one.`,
      type: "performance",
      severity:
        consistencyScore >= 80
          ? "positive"
          : consistencyScore >= 50
            ? "neutral"
            : "warning",
    });
  }

  // Engagement/streak
  if (allMyQuizEvents.length >= 3) {
    insights.push({
      id: "engagement",
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      title: "Engagement",
      message: `${allMyQuizEvents.length} quiz attempts this session across all courses! ${allMyQuizEvents.length >= 5 ? "You're on fire — keep this momentum!" : "Good start — try more quizzes to strengthen retention."}`,
      type: "streak",
      severity: allMyQuizEvents.length >= 5 ? "positive" : "neutral",
    });
  }

  // First attempt on course
  if (courseQuizEvents.length === 1) {
    insights.push({
      id: "first-attempt",
      icon: <Brain className="h-5 w-5 text-indigo-500" />,
      title: "First Attempt Analysis",
      message:
        scores[0] >= 75
          ? `Great first try — ${scores[0]}%! You grasp the basics well. Retry to aim for 100% mastery.`
          : scores[0] >= 50
            ? `${scores[0]}% on your first shot at ${courseName}. Solid foundation — review weak areas and retry to boost your score.`
            : `${scores[0]}% on first attempt. That's normal for a first try! Go back to the lessons and focus on the tricky parts, then retry.`,
      type: "recommendation",
      severity: scores[0] >= 75 ? "positive" : scores[0] >= 50 ? "neutral" : "warning",
    });
  }

  return {
    avgTimeBetweenAttempts,
    paceLabel,
    paceColor,
    paceIcon,
    quizAttempts: courseQuizEvents.length,
    avgScore,
    bestScore: scores.length > 0 ? Math.max(...scores) : 0,
    worstScore: scores.length > 0 ? Math.min(...scores) : 0,
    scoreTrajectory,
    consistencyScore,
    engagementLevel,
    insights,
    coursesCompleted: courseCompletedEvents.length,
    totalPointsThisSession: totalPoints,
    scoreHistory: scores,
  };
}

// Severity colors
const severityStyles: Record<string, { bg: string; border: string; text: string }> = {
  positive: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  neutral: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
  },
  critical: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
  },
};

interface LearnerInsightsPanelProps {
  courseId: string;
  courseName: string;
  /** If set, shows a compact version */
  compact?: boolean;
  /** Override: force a refetch */
  refreshKey?: number;
}

export function LearnerInsightsPanel({
  courseId,
  courseName,
  compact = false,
  refreshKey = 0,
}: LearnerInsightsPanelProps) {
  const [paceData, setPaceData] = useState<PaceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events?limit=100`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data.success) return;

        const pace = computePaceData(
          data.data || [],
          courseId,
          courseName
        );
        setPaceData(pace);
      } catch {
        // Silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [courseId, courseName, refreshKey]);

  if (loading || !paceData) return null;
  if (paceData.quizAttempts === 0 && paceData.coursesCompleted === 0)
    return null;

  if (compact) {
    return (
      <div className="space-y-2">
        {paceData.insights.slice(0, 3).map((insight) => {
          const style = severityStyles[insight.severity];
          return (
            <div
              key={insight.id}
              className={`p-3 rounded-lg border ${style.bg} ${style.border}`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0">{insight.icon}</div>
                <div>
                  <p className={`text-xs font-semibold ${style.text}`}>
                    {insight.title}
                  </p>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">
              Your Learning Insights
            </h3>
          </div>
          <Badge variant="outline" className="text-[10px]">
            Real-time
          </Badge>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-accent rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-foreground">
              {paceData.quizAttempts}
            </p>
            <p className="text-[10px] text-muted-foreground">Attempts</p>
          </div>
          <div className="bg-accent rounded-lg p-2.5 text-center">
            <p className={`text-lg font-bold ${
              paceData.avgScore >= 75 ? "text-emerald-600" :
              paceData.avgScore >= 50 ? "text-blue-600" :
              "text-red-600"
            }`}>
              {paceData.avgScore}%
            </p>
            <p className="text-[10px] text-muted-foreground">Avg Score</p>
          </div>
          <div className="bg-accent rounded-lg p-2.5 text-center">
            <div className={`text-lg font-bold ${paceData.paceColor}`}>
              {paceData.paceLabel.split(" ")[0]}
            </div>
            <p className="text-[10px] text-muted-foreground">Pace</p>
          </div>
          <div className="bg-accent rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-foreground">
              {paceData.totalPointsThisSession}
            </p>
            <p className="text-[10px] text-muted-foreground">Points</p>
          </div>
        </div>

        {/* Score History Mini Chart */}
        {paceData.scoreHistory.length >= 2 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                Score History
              </p>
              <div className="flex items-center gap-1">
                {paceData.scoreTrajectory === "improving" && (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-[10px]">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    Improving
                  </Badge>
                )}
                {paceData.scoreTrajectory === "declining" && (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-[10px]">
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    Declining
                  </Badge>
                )}
                {paceData.scoreTrajectory === "stable" && (
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-[10px]">
                    Stable
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-end gap-1 h-10">
              {paceData.scoreHistory.map((score, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all"
                  style={{ height: `${Math.max(score, 5)}%` }}
                  title={`Attempt ${i + 1}: ${score}%`}
                >
                  <div
                    className={`w-full h-full rounded-t ${
                      score >= 75
                        ? "bg-emerald-400"
                        : score >= 50
                          ? "bg-blue-400"
                          : score >= 25
                            ? "bg-amber-400"
                            : "bg-red-400"
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Attempt 1</span>
              <span>Attempt {paceData.scoreHistory.length}</span>
            </div>
          </div>
        )}

        {/* Consistency Score */}
        {paceData.quizAttempts >= 3 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" />
                Consistency
              </span>
              <span className="font-medium">
                {paceData.consistencyScore}%
              </span>
            </div>
            <Progress
              value={paceData.consistencyScore}
              className={`h-1.5 ${
                paceData.consistencyScore >= 80
                  ? "[&>div]:bg-emerald-500"
                  : paceData.consistencyScore >= 50
                    ? "[&>div]:bg-blue-500"
                    : "[&>div]:bg-amber-500"
              }`}
            />
          </div>
        )}

        {/* Engagement Badge */}
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-xs text-muted-foreground">
            Engagement:
          </span>
          <Badge
            variant="outline"
            className="text-[10px]"
          >
            {paceData.engagementLevel}
          </Badge>
        </div>

        {/* Dynamic Insights */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Personalized Insights
          </p>
          {paceData.insights.map((insight) => {
            const style = severityStyles[insight.severity];
            return (
              <div
                key={insight.id}
                className={`p-3 rounded-lg border ${style.bg} ${style.border}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">{insight.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${style.text}`}>
                      {insight.title}
                    </p>
                    <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
