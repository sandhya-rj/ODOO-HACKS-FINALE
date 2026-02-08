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
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockCourses } from "@/data/mockData";
import { LearnerInsightsPanel } from "@/components/insights/LearnerInsightsPanel";
import { useProgress } from "@/hooks/useProgress";
import { useToast } from "@/hooks/use-toast";
import { getLessonImage } from '@/data/courseImages';

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

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  
  // Demo: hard-coded userId (in production, get from auth context)
  const DEMO_USER_ID = 1;
  const DEMO_USER_UUID = "cac7caff-6f69-483f-a39d-50abbf8f54ac"; // Sandhya RJ
  
  // Progress hook for backend integration
  const { isLoading: isCompletingLesson } = useProgress(DEMO_USER_ID);
  
  // Course completion state
  const [isCompletingCourse, setIsCompletingCourse] = useState(false);
  
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
  const handleNextLesson = async () => {
    if (!nextLesson || isCompletingLesson) return;

    // Calculate time spent on current lesson
    const timeSpentSeconds = Math.floor((Date.now() - lessonStartTime) / 1000);

    // Update local lesson progress state immediately for UI responsiveness
    setLessonProgressMap((prev) => ({
      ...prev,
      [lesson.id]: {
        lessonId: lesson.id,
        completed: true,
        timeSpentSeconds,
      },
    }));

    // Navigate to next lesson — lesson progress is tracked locally for the demo
    navigate(`/lesson/${courseId}/${nextLesson.id}`);
  };

  const isLastLesson = lessonIndex === course.lessons.length - 1;

  // Handle course completion from the last lesson
  const handleCompleteCourse = async () => {
    if (isCompletingCourse) return;
    setIsCompletingCourse(true);

    // Mark last lesson as completed locally
    setLessonProgressMap((prev) => ({
      ...prev,
      [lesson.id]: {
        lessonId: lesson.id,
        completed: true,
        timeSpentSeconds: Math.floor((Date.now() - lessonStartTime) / 1000),
      },
    }));

    // Map frontend course ID to backend course ID
    const courseIdMap: Record<string, string> = {
      '1': 'course-javascript-fundamentals',
      '2': 'course-react-essentials',
      '3': 'course-javascript-fundamentals',
      '4': 'course-react-essentials',
      '5': 'course-javascript-fundamentals',
      '6': 'course-react-essentials',
    };

    const backendCourseId = courseIdMap[courseId || ''] || 'course-javascript-fundamentals';

    try {
      const response = await fetch('http://localhost:5000/courses/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: DEMO_USER_UUID,
          courseId: backendCourseId,
        }),
      });

      const data = await response.json();

      if (data.success && !data.alreadyCompleted) {
        // Track completion per frontend course ID
        const completedCourses = JSON.parse(sessionStorage.getItem('completedCourses') || '{}');
        completedCourses[courseId || ''] = true;
        sessionStorage.setItem('completedCourses', JSON.stringify(completedCourses));

        // Trigger leaderboard refresh
        window.dispatchEvent(new CustomEvent('leaderboard-refresh'));

        toast({
          title: 'Course Completed!',
          description: `${course.title} — +${data.data?.pointsAwarded || 100} points awarded!`,
        });

        window.dispatchEvent(new CustomEvent('learnsphere-notification', {
          detail: {
            type: 'COURSE_COMPLETED',
            title: 'Course Completed!',
            message: `You completed "${course.title}"`,
            points: data.data?.pointsAwarded || 100,
            instructorNotified: true,
            instructorName: data.data?.instructorName || 'Michael Chen',
          }
        }));
      } else if (data.alreadyCompleted) {
        toast({
          title: 'Already Completed',
          description: 'You\'ve already completed this course.',
        });
      }
    } catch (error) {
      console.error('Failed to complete course:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit course completion. Try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCompletingCourse(false);
    }

    // Navigate back to course detail
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-border/40 bg-card/80 backdrop-blur-md flex items-center px-4 gap-4 flex-shrink-0">
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
              <div className="aspect-video bg-muted/50 rounded-2xl flex items-center justify-center border border-border/40 mb-6 overflow-hidden">
                <img 
                  src={getLessonImage(lesson.id, 'video')}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="text-center hidden">
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

              {/* Learning Insights — real-time, per-course */}
              <div className="mt-6">
                <LearnerInsightsPanel
                  courseId={courseId || '1'}
                  courseName={course.title}
                  compact
                />
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="h-16 border-t border-border/40 bg-card/80 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0">
            <Button
              variant="outline"
              disabled={!prevLesson}
              onClick={() =>
                prevLesson &&
                navigate(`/lesson/${courseId}/${prevLesson.id}`)
              }
              className="rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {isLastLesson ? (
              <Button
                onClick={handleCompleteCourse}
                disabled={isCompletingCourse}
                className="bg-success hover:bg-success/90 text-white rounded-xl"
              >
                {isCompletingCourse ? "Completing..." : (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Complete Course
                  </>
                )}
              </Button>
            ) : (
              <Button
                disabled={!nextLesson || isCompletingLesson}
                onClick={handleNextLesson}
                className="rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
              >
                {isCompletingLesson ? "Completing..." : "Next Lesson"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 border-l border-border/40 bg-card flex-col overflow-hidden hidden md:flex flex-shrink-0">
            <div className="p-4 border-b border-border/40">
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
                <Progress value={progressPercent} className="h-1.5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-blue-500" />
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
            <div className="p-4 border-t border-border/40">
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
