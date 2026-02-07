import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  Paperclip,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockCourses } from "@/data/mockData";
import { AlertCard } from "@/components/insights/AlertCard";
import type { Alert } from "@/lib/api";

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  timeSpentSeconds: number;
}

const typeIcons = {
  video: Play,
  document: FileText,
  image: ImageIcon,
  quiz: HelpCircle,
};

// Mock lesson-specific alerts
const mockLessonAlerts: Alert[] = [
  {
    alertId: "alert_lesson_001",
    type: "quiz_performance",
    message: "You've attempted this quiz 3 times. Consider reviewing the lesson material before your next attempt.",
    severity: "medium",
    source: "ai_insight_engine",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    alertId: "alert_lesson_002",
    type: "progress_milestone",
    message: "Great progress! You've completed 70% of this course.",
    severity: "low",
    source: "progress_tracker",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
];

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Lesson progress state: tracks completion and time spent for each lesson
  const [lessonProgressMap, setLessonProgressMap] = useState<Record<string, LessonProgress>>({});
  const [lessonStartTime, setLessonStartTime] = useState<number>(Date.now());

  const course = mockCourses.find((c) => c.id === courseId);
  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  // Initialize lesson progress state from mockCourses data on mount
  useEffect(() => {
    const initialProgress: Record<string, LessonProgress> = {};
    course.lessons.forEach((lesson) => {
      initialProgress[lesson.id] = {
        lessonId: lesson.id,
        completed: lesson.completed,
        timeSpentSeconds: 0,
      };
    });
    setLessonProgressMap(initialProgress);
  }, [courseId]);

  // Reset lesson start time when lesson changes
  useEffect(() => {
    setLessonStartTime(Date.now());
  }, [lessonId]);

  const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const lesson = course.lessons[lessonIndex];
  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  // Calculate completion count from progress state
  const completedCount = Object.values(lessonProgressMap).filter((p) => p.completed).length;
  const progressPercent = Math.round(
    (completedCount / course.lessons.length) * 100
  );

  const prevLesson =
    lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < course.lessons.length - 1
      ? course.lessons[lessonIndex + 1]
      : null;

  const ContentIcon = typeIcons[lesson.type];

  // Mark current lesson as completed and navigate to next lesson
  const handleNextLesson = () => {
    if (!nextLesson) return;

    // Calculate time spent on current lesson
    const timeSpentSeconds = Math.floor((Date.now() - lessonStartTime) / 1000);

    // Update lesson progress state
    setLessonProgressMap((prev) => ({
      ...prev,
      [lesson.id]: {
        lessonId: lesson.id,
        completed: true,
        timeSpentSeconds,
      },
    }));

    // TODO: POST /lesson/complete
    // Send completion data to backend:
    // {
    //   lessonId: lesson.id,
    //   courseId: courseId,
    //   timeSpentSeconds: timeSpentSeconds,
    //   completedAt: new Date().toISOString()
    // }

    // Navigate to next lesson
    navigate(`/lesson/${courseId}/${nextLesson.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 flex-shrink-0">
        <Link
          to={`/course/${courseId}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">Back to Course</span>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {lesson.title}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-muted-foreground"
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                {lesson.type} · {lesson.duration}
              </Badge>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {lesson.title}
              </h1>

              {/* Content Viewer Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border mb-6">
                <div className="text-center">
                  <ContentIcon className="h-16 w-16 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}{" "}
                    viewer placeholder
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                Lesson content and description will appear here. This is a
                placeholder for the actual lesson material.
              </p>

              {/* Lesson-specific Alerts */}
              {mockLessonAlerts.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Insights & Alerts</h3>
                  {mockLessonAlerts.map((alert) => (
                    <AlertCard key={alert.alertId} alert={alert} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="h-16 border-t border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
            <Button
              variant="outline"
              disabled={!prevLesson}
              onClick={() =>
                prevLesson &&
                navigate(`/lesson/${courseId}/${prevLesson.id}`)
              }
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              disabled={!nextLesson}
              onClick={handleNextLesson}
            >
              Next Lesson
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 border-l border-border bg-card flex-col overflow-hidden hidden md:flex flex-shrink-0">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm mb-2">
                {course.title}
              </h3>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {completedCount} of {course.lessons.length} completed
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {course.lessons.map((l) => {
                  const isActive = l.id === lessonId;
                  const lessonProgress = lessonProgressMap[l.id];
                  const isCompleted = lessonProgress?.completed || false;
                  
                  return (
                    <Link
                      key={l.id}
                      to={`/lesson/${courseId}/${l.id}`}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{l.title}</span>
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                Attachments
              </p>
              <p className="text-xs text-muted-foreground">
                No attachments for this lesson.
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
