import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  MoreVertical,
  Edit,
  Share2,
  BookOpen,
  Clock,
  Activity,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockCourses } from "@/data/mockData";
import type { Course } from "@/data/mockData";
import { AlertCard } from "@/components/insights/AlertCard";
import type { Alert, Event } from "@/lib/api";
import { useEvents } from "@/hooks/useEvents";
import { LeaderboardCard } from "@/components/leaderboard/LeaderboardCard";

type ViewMode = "kanban" | "list";

// Demo: hard-coded instructor userId (Michael Chen from seed data)
const DEMO_INSTRUCTOR_ID = "30daa450-de2f-4089-952f-5162926a6b58";

/**
 * Generate real-time insights from actual backend events
 * No mock data — everything computed from live events
 */
function computeInsightsFromEvents(events: Event[]): Alert[] {
  if (!events || events.length === 0) return [];
  
  const insights: Alert[] = [];
  
  // Parse all quiz events and group by learner
  const quizEvents = events.filter(e => e.type === 'QUIZ_SUBMITTED');
  const courseEvents = events.filter(e => e.type === 'COURSE_COMPLETED');
  
  // Per-learner quiz stats
  const learnerStats: Record<string, { name: string; attempts: number; totalScore: number; totalQuestions: number; scores: number[]; courses: Set<string> }> = {};
  
  quizEvents.forEach(event => {
    const metadata = typeof event.metadata === 'string' ? JSON.parse(event.metadata) : event.metadata;
    const learnerId = event.userId;
    const name = metadata.learnerName || `Learner ${learnerId?.substring(0, 6)}`;
    
    if (!learnerStats[learnerId]) {
      learnerStats[learnerId] = { name, attempts: 0, totalScore: 0, totalQuestions: 0, scores: [], courses: new Set() };
    }
    learnerStats[learnerId].attempts++;
    learnerStats[learnerId].totalScore += metadata.score || 0;
    learnerStats[learnerId].totalQuestions += metadata.totalQuestions || 0;
    if (metadata.percentage !== undefined) learnerStats[learnerId].scores.push(metadata.percentage);
    if (event.course?.title) learnerStats[learnerId].courses.add(event.course.title);
  });
  
  // Generate per-learner insights
  Object.entries(learnerStats).forEach(([_id, stats]) => {
    const avgScore = stats.scores.length > 0 ? Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length) : 0;
    const lowScores = stats.scores.filter(s => s <= 50).length;
    const highScores = stats.scores.filter(s => s >= 75).length;
    const courses = Array.from(stats.courses).join(', ') || 'Unknown Course';
    
    // Multiple attempts with low scores = struggling learner
    if (stats.attempts >= 2 && avgScore <= 50) {
      insights.push({
        alertId: `insight-struggle-${_id}`,
        type: 'quiz_performance',
        message: `${stats.name} has made ${stats.attempts} quiz attempts with an average score of ${avgScore}% in ${courses}. Consider reaching out to provide additional support.`,
        severity: 'high',
        source: 'performance_tracker',
        createdAt: new Date().toISOString(),
      });
    } else if (stats.attempts >= 2 && avgScore <= 70) {
      insights.push({
        alertId: `insight-practice-${_id}`,
        type: 'quiz_performance',
        message: `${stats.name} has ${stats.attempts} attempts averaging ${avgScore}% in ${courses}. Improving but may need review material for weaker topics.`,
        severity: 'medium',
        source: 'performance_tracker',
        createdAt: new Date().toISOString(),
      });
    }
    
    // High performer recognition
    if (highScores >= 2) {
      insights.push({
        alertId: `insight-star-${_id}`,
        type: 'progress_milestone',
        message: `${stats.name} scored above 75% on ${highScores} quizzes. Outstanding performance — consider recognizing their achievement.`,
        severity: 'low',
        source: 'performance_tracker',
        createdAt: new Date().toISOString(),
      });
    }
    
    // Score volatility (big swing between attempts)
    if (stats.scores.length >= 2) {
      const min = Math.min(...stats.scores);
      const max = Math.max(...stats.scores);
      if (max - min >= 50) {
        insights.push({
          alertId: `insight-volatile-${_id}`,
          type: 'engagement_drop',
          message: `${stats.name}'s quiz scores vary widely (${min}% to ${max}%) in ${courses}. This may indicate inconsistent study habits or unclear material.`,
          severity: 'medium',
          source: 'performance_tracker',
          createdAt: new Date().toISOString(),
        });
      }
    }
  });
  
  // Course completion insights
  if (courseEvents.length > 0) {
    const completedNames = courseEvents.map(e => {
      const m = typeof e.metadata === 'string' ? JSON.parse(e.metadata) : e.metadata;
      return m.learnerName || 'A learner';
    });
    insights.push({
      alertId: `insight-completion-${courseEvents.length}`,
      type: 'progress_milestone',
      message: `${completedNames.join(', ')} completed ${courseEvents.length === 1 ? 'a course' : `${courseEvents.length} courses`} this session. +100 points awarded per completion.`,
      severity: 'low',
      source: 'progress_tracker',
      createdAt: new Date().toISOString(),
    });
  }
  
  // Overall session summary
  if (quizEvents.length > 0) {
    const allPercentages = quizEvents.map(e => {
      const m = typeof e.metadata === 'string' ? JSON.parse(e.metadata) : e.metadata;
      return m.percentage || 0;
    });
    const sessionAvg = Math.round(allPercentages.reduce((a, b) => a + b, 0) / allPercentages.length);
    
    if (sessionAvg <= 50 && quizEvents.length >= 2) {
      insights.push({
        alertId: `insight-session-avg`,
        type: 'engagement_drop',
        message: `Session average quiz score is ${sessionAvg}% across ${quizEvents.length} submissions. Course material may need review or simplification.`,
        severity: 'high',
        source: 'performance_tracker',
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  return insights;
}

function CourseListItem({ course }: { course: Course }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/40 hover:shadow-md transition-all duration-200">
      <div className="h-12 w-12 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
        <BookOpen className="h-5 w-5 text-primary/70" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {course.title}
          </h3>
          {course.published ? (
            <Badge className="bg-success text-success-foreground text-[10px]">
              Published
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px]">
              Draft
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {course.lessonsCount} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.totalDuration}
          </span>
          <div className="flex gap-1">
            {course.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px]">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to={`/instructor/course/${course.id}`}>
          <Button variant="outline" size="sm" className="rounded-lg">
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function KanbanColumn({
  title,
  courses,
}: {
  title: string;
  courses: Course[];
}) {
  return (
    <div className="flex-1 min-w-[300px]">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {courses.length}
        </Badge>
      </div>
      <div className="space-y-3">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="border-border/40 rounded-xl hover:shadow-md transition-all duration-200"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-semibold text-foreground leading-tight pr-2">
                  {course.title}
                </h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 -mt-1 -mr-1 flex-shrink-0"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/instructor/course/${course.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-1">
                {course.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {course.lessonsCount}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.totalDuration}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {courses.length === 0 && (
          <div className="p-6 border-2 border-dashed border-border/40 rounded-xl text-center text-sm text-muted-foreground">
            No courses
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstructorDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Poll events every 5 seconds with toast alerts for instructor
  const { 
    events, 
    isLoading: eventsLoading, 
    lastFetchTime,
    refresh: refreshEvents 
  } = useEvents({
    userId: DEMO_INSTRUCTOR_ID,
    pollInterval: 5000,
    limit: 10,
    enabled: true,
    enableToasts: true, // Enable toast notifications for new events
    isInstructor: true, // Fetch events for courses managed by this instructor
  });

  // Compute real-time insights from actual backend events (no mock data)
  const computedInsights = useMemo(() => computeInsightsFromEvents(events), [events]);

  const filtered = mockCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const draftCourses = filtered.filter((c) => !c.published);
  const publishedCourses = filtered.filter((c) => c.published);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Course Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage and organize your courses
          </p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Enter the details for your new course including title and relevant tags.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Course Title</Label>
                <Input
                  placeholder="Enter course title..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Tags</Label>
                <Input
                  placeholder="e.g. React, TypeScript"
                  className="mt-1.5"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)} className="rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90">Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Instructor Live Activity & Alerts */}
      {(events.length > 0 || computedInsights.length > 0) && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <h2 className="text-sm font-semibold text-foreground">
                Live Learner Activity
              </h2>
              {eventsLoading && (
                <RefreshCw className="h-3 w-3 text-muted-foreground animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {events.length + computedInsights.length} total
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshEvents}
                disabled={eventsLoading}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Real-time Events from Backend */}
          {events.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  Live Events (auto-updates every 5s)
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
                </p>
              </div>
              {events.map((event) => {
                // Parse metadata if it's a JSON string
                const metadata = typeof event.metadata === 'string' 
                  ? JSON.parse(event.metadata) 
                  : event.metadata;
                
                // Smart performance analysis for quiz events
                const percentage = metadata.percentage;
                const isQuiz = event.type === 'QUIZ_SUBMITTED';
                const isCourse = event.type === 'COURSE_COMPLETED';

                // Determine severity for color-coding
                let severity = 'neutral';
                let severityLabel = '';
                let severityEmoji = '';
                let cardBorder = 'border-border';
                let cardBg = 'bg-card';
                let badgeStyle = '';
                let recommendation = '';

                if (isQuiz && percentage !== undefined) {
                  if (percentage <= 25) {
                    severity = 'critical';
                    severityLabel = 'Struggling Learner';
                    severityEmoji = '';
                    cardBorder = 'border-red-300 dark:border-red-700';
                    cardBg = 'bg-red-50 dark:bg-red-950/20';
                    badgeStyle = 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400';
                    recommendation = 'Consider reaching out to this learner. They may need 1-on-1 support or alternative resources.';
                  } else if (percentage <= 50) {
                    severity = 'warning';
                    severityLabel = 'Below Average';
                    severityEmoji = '';
                    cardBorder = 'border-orange-300 dark:border-orange-700';
                    cardBg = 'bg-orange-50 dark:bg-orange-950/20';
                    badgeStyle = 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-400';
                    recommendation = 'This learner may benefit from additional practice material or a review session.';
                  } else if (percentage <= 75) {
                    severity = 'info';
                    severityLabel = 'Good Progress';
                    severityEmoji = '';
                    cardBorder = 'border-blue-200 dark:border-blue-700';
                    cardBg = 'bg-blue-50 dark:bg-blue-950/20';
                    badgeStyle = 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-400';
                    recommendation = '';
                  } else {
                    severity = 'excellent';
                    severityLabel = 'Strong Performance';
                    severityEmoji = '';
                    cardBorder = 'border-green-300 dark:border-green-700';
                    cardBg = 'bg-green-50 dark:bg-green-950/20';
                    badgeStyle = 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400';
                    recommendation = '';
                  }
                } else if (isCourse) {
                  severity = 'course';
                  severityLabel = 'Course Completed';
                  severityEmoji = '';
                  cardBorder = 'border-green-300 dark:border-green-700';
                  cardBg = 'bg-green-50 dark:bg-green-950/20';
                  badgeStyle = 'bg-green-100 text-green-700 border-green-300';
                }

                // Multiple low attempts indicator
                const attemptNumber = metadata.attemptNumber;
                const isRepeatedStruggle = isQuiz && percentage <= 50 && attemptNumber >= 3;
                
                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-xl border-2 ${cardBorder} ${cardBg} hover:shadow-md transition-all ${isRepeatedStruggle ? 'ring-2 ring-red-400 ring-offset-1' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {/* Performance severity badge */}
                          {isQuiz && percentage !== undefined ? (
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-medium ${badgeStyle}`}
                            >
                              {severityEmoji} {severityLabel}
                            </Badge>
                          ) : (
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-medium ${badgeStyle || (isCourse ? 'bg-green-100 text-green-700 border-green-300' : '')}`}
                            >
                              {isCourse ? '' : ''} {event.type.replace(/_/g, ' ')}
                            </Badge>
                          )}
                          {isRepeatedStruggle && (
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              {attemptNumber} failed attempts
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground font-medium">
                            {metadata.learnerName || `User ${event.userId?.substring(0, 8)}...`}
                          </span>
                          {event.course && (
                            <span className="text-xs text-muted-foreground">
                              • {event.course.title}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground">
                          {metadata.quizTitle || 
                           metadata.lessonTitle || 
                           metadata.courseTitle || 
                           metadata.achievementName || 
                           `Activity: ${event.type}`}
                          {metadata.score !== undefined && metadata.totalQuestions && (
                            <span className={`ml-2 text-xs font-bold ${
                              percentage <= 25 ? 'text-red-600 dark:text-red-400' :
                              percentage <= 50 ? 'text-orange-600 dark:text-orange-400' :
                              percentage <= 75 ? 'text-blue-600 dark:text-blue-400' :
                              'text-green-600 dark:text-green-400'
                            }`}>
                              Score: {metadata.score}/{metadata.totalQuestions} ({percentage}%)
                            </span>
                          )}
                          {metadata.pointsAwarded > 0 && (
                            <span className={`ml-2 text-xs font-medium ${isCourse ? 'text-green-600' : 'text-blue-600'}`}>
                              +{metadata.pointsAwarded} points
                            </span>
                          )}
                        </p>
                        {/* Instructor recommendation for struggling learners */}
                        {recommendation && (
                          <div className={`mt-2 p-2 rounded-lg text-xs ${
                            severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            severity === 'warning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            <Lightbulb className="h-3 w-3 inline mr-1" /><strong>Recommendation:</strong> {recommendation}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(event.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Real-time Computed Insights from Live Events */}
          {computedInsights.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Insights & Alerts
              </p>
              {computedInsights.map((alert) => (
                <AlertCard key={alert.alertId} alert={alert} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
          <Button
            variant={viewMode === "kanban" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Kanban
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          <KanbanColumn title="Draft" courses={draftCourses} />
          <KanbanColumn title="Published" courses={publishedCourses} />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((course) => (
            <CourseListItem key={course.id} course={course} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No courses found.
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Section */}
      <div className="mt-8">
        <LeaderboardCard />
      </div>
    </div>
  );
}
