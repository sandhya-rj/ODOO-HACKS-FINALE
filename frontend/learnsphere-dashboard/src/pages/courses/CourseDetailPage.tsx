import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Search,
  CheckCircle2,
  Play,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { mockCourses } from "@/data/mockData";
import { getCourseImage } from "@/data/courseImages";
import { useProgress } from "@/hooks/useProgress";
import { useToast } from "@/hooks/use-toast";
import { LearnerInsightsPanel } from "@/components/insights/LearnerInsightsPanel";

const typeIcons = {
  video: Play,
  document: FileText,
  image: ImageIcon,
  quiz: HelpCircle,
};

// Demo: hard-coded userId (Sandhya RJ)
const DEMO_USER_ID = "cac7caff-6f69-483f-a39d-50abbf8f54ac";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [lessonSearch, setLessonSearch] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");
  const { toast } = useToast();

  // Track completion per-frontend-course (not shared backend IDs)
  useEffect(() => {
    const completedCourses = JSON.parse(sessionStorage.getItem('completedCourses') || '{}');
    if (completedCourses[id || '']) {
      setEnrollmentStatus("COMPLETED");
    }
  }, [id]);

  // Progress hook for real backend data (still functional)
  const { 
    fetchCourseProgress, 
    getProgress, 
    isLessonCompleted, 
    isLoading: progressLoading 
  } = useProgress(DEMO_USER_ID);

  // Use mock course data for rich UI
  const course = mockCourses.find((c) => c.id === id);

  // Fetch real progress from backend on mount (background integration)
  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      fetchCourseProgress(parseInt(id, 10));
    }
  }, [id, fetchCourseProgress]);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Course not found.</p>
        <Link to="/courses">
          <Button variant="outline" className="mt-4">
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  // Get real progress data (fallback to mock if not loaded yet)
  const realProgress = id && !isNaN(Number(id)) ? getProgress(parseInt(id, 10)) : undefined;
  const courseLessons = course.lessons || [];
  const completedLessons = courseLessons.filter((l) => l.completed).length;
  // Use backend progress if meaningful (> 0), otherwise fall back to mock data
  const progressPercent = (realProgress?.progressPercentage && realProgress.progressPercentage > 0)
    ? realProgress.progressPercentage
    : (completedLessons > 0 ? Math.round((completedLessons / courseLessons.length) * 100) : (course.progress ?? 0));
  // Show "Complete this course" button when either backend OR mock data says all lessons done
  const allLessonsCompleted = 
    (realProgress && (realProgress.completedLessons || 0) >= (realProgress.totalLessons || 1)) ||
    (completedLessons > 0 && completedLessons >= courseLessons.length);
  const isCourseCompleted = enrollmentStatus === "COMPLETED";
  
  const filteredLessons = courseLessons.filter((l) =>
    l.title.toLowerCase().includes(lessonSearch.toLowerCase())
  );

  const handleCompleteCourse = async () => {
    try {
      console.log('Completing course:', course.title);

      // Map frontend course ID to backend course ID
      const courseIdMap: Record<string, string> = {
        '1': 'course-javascript-fundamentals',
        '2': 'course-react-essentials',
        '3': 'course-javascript-fundamentals',
        '4': 'course-react-essentials',
        '5': 'course-javascript-fundamentals',
        '6': 'course-react-essentials',
        'course-javascript-fundamentals': 'course-javascript-fundamentals',
        'course-react-essentials': 'course-react-essentials',
      };

      const backendCourseId = courseIdMap[id || ''] || 'course-javascript-fundamentals';

      const response = await fetch('http://localhost:5000/courses/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          courseId: backendCourseId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Course completed:', data);

      // Handle already-completed case
      if (data.alreadyCompleted) {
        setEnrollmentStatus("COMPLETED");
        const completedCourses = JSON.parse(sessionStorage.getItem('completedCourses') || '{}');
        completedCourses[id || ''] = true;
        sessionStorage.setItem('completedCourses', JSON.stringify(completedCourses));
        toast({
          title: "Already Completed",
          description: `You've already completed "${course.title}". No duplicate points awarded.`,
        });
        return;
      }

      // Update UI state — per-course, not shared
      setEnrollmentStatus("COMPLETED");
      const completedCourses = JSON.parse(sessionStorage.getItem('completedCourses') || '{}');
      completedCourses[id || ''] = true;
      sessionStorage.setItem('completedCourses', JSON.stringify(completedCourses));

      const points = data.data?.pointsAwarded || 100;
      const instructorName = data.data?.instructorName || 'your instructor';

      // Show beautiful in-app toast notification
      toast({
        title: "Course Completed!",
        description: `You've completed "${course.title}"! +${points} points awarded. ${instructorName} has been notified.`,
      });

      // Dispatch real-time notification event for the app-wide notification system
      window.dispatchEvent(new CustomEvent('learnsphere-notification', {
        detail: {
          type: 'COURSE_COMPLETED',
          title: 'Course Completed!',
          message: `Congratulations! You completed "${course.title}"`,
          points: points,
          instructorNotified: true,
          instructorName: instructorName,
        }
      }));

      // Trigger leaderboard refresh
      window.dispatchEvent(new CustomEvent('leaderboard-refresh'));

    } catch (error) {
      console.error('Failed to complete course:', error);
      toast({
        title: "Error",
        description: "Failed to complete course. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <div className="bg-card rounded-2xl border border-border/40 overflow-hidden mb-6">
        {/* Course image banner */}
        <div className="h-48 relative overflow-hidden">
          <img
            src={getCourseImage(course.id)}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          {/* Overlay badges */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-semibold">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">
              <Users className="h-3.5 w-3.5 text-white/80" />
              <span className="text-white text-xs font-medium">{course.enrolledCount?.toLocaleString()} enrolled</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-accent/70 border-0">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {course.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {course.description}
          </p>
          <p className="text-xs text-muted-foreground/70 font-medium">
            by {course.instructor}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.lessonsCount} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.totalDuration}
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {completedLessons} of {courseLessons.length} completed
                {progressLoading && (
                  <RefreshCw className="inline-block ml-1 h-3 w-3 animate-spin" />
                )}
              </span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Link to={`/quiz/${course.id}`}>
              <Button variant="outline" size="sm" className="rounded-xl">
                <HelpCircle className="h-4 w-4 mr-1" />
                Take Quiz
              </Button>
            </Link>
            {!isCourseCompleted && (
              <Button 
                onClick={handleCompleteCourse}
                size="sm"
                className="rounded-xl bg-success hover:bg-success/90 text-white"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Complete this course
              </Button>
            )}
            {isCourseCompleted && (
              <Badge className="bg-success/10 text-success border-success/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Course Completed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Learner Insights Panel — shows after quiz or course activity */}
      <div className="mb-6">
        <LearnerInsightsPanel
          courseId={id || '1'}
          courseName={course.title}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                className="pl-10 rounded-xl border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson, idx) => {
                if (!lesson || !lesson.id) {
                  return (
                    <div key={`invalid-lesson-${idx}`} className="p-4 text-sm text-muted-foreground">
                      Invalid lesson data
                    </div>
                  );
                }

                const Icon = typeIcons[lesson.type] || BookOpen;
                const isLocked = isCourseCompleted;
                
                // Check real completion status from backend (fallback to mock)
                const isCompleted = id && !isNaN(Number(id)) && !isNaN(Number(lesson.id))
                  ? isLessonCompleted(parseInt(id, 10), parseInt(lesson.id, 10))
                  : lesson.completed || false;

                return (
                  <Link
                    key={lesson.id}
                    to={isLocked ? "#" : `/lesson/${course?.id}/${lesson.id}`}
                    onClick={(e) => isLocked && e.preventDefault()}
                    className={`flex items-center gap-4 p-4 bg-card rounded-xl border border-border/40 transition-all ${
                      isLocked 
                        ? "opacity-60 cursor-not-allowed" 
                        : "hover:border-primary/20 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-border flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {lesson.title || 'Untitled Lesson'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.duration || 'Duration not specified'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      <Icon className="h-3 w-3 mr-1" />
                      {lesson.type || 'lesson'}
                    </Badge>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {lessonSearch ? 'No lessons match your search.' : 'No lessons available.'}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="text-center py-12 text-muted-foreground">
            <p>No reviews yet. Be the first to review this course.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
