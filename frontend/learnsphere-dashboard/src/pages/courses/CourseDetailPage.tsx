import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { mockCourses } from "@/data/mockData";

const typeIcons = {
  video: Play,
  document: FileText,
  image: ImageIcon,
  quiz: HelpCircle,
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const [lessonSearch, setLessonSearch] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");
  const course = mockCourses.find((c) => c.id === id);

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

  const completedLessons = course.lessons.filter((l) => l.completed).length;
  const allLessonsCompleted = completedLessons === course.lessons.length;
  const isCourseCompleted = enrollmentStatus === "COMPLETED";
  
  const filteredLessons = course.lessons.filter((l) =>
    l.title.toLowerCase().includes(lessonSearch.toLowerCase())
  );

  const handleCompleteCourse = () => {
    // Update enrollment status to completed
    setEnrollmentStatus("COMPLETED");

    // TODO: POST /course/complete
    // Send course completion data to backend:
    // {
    //   courseId: id,
    //   completedAt: new Date().toISOString(),
    //   finalScore: calculateFinalScore(),
    //   certificateRequested: true
    // }
    // Backend will:
    // - Update CourseEnrollment status to COMPLETED
    // - Award completion badge/points
    // - Generate certificate if applicable
    // - Trigger completion insights
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 h-40 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {course.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {course.description}
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
                  {completedLessons} of {course.lessons.length} completed
                </span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
            <div className="pt-1">
              <Link to={`/quiz/${course.id}`}>
                <Button variant="outline" size="sm">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Take Quiz
                </Button>
              </Link>
            </div>
            {allLessonsCompleted && !isCourseCompleted && (
              <div className="pt-2">
                <Button 
                  onClick={handleCompleteCourse}
                  size="sm"
                  className="bg-success hover:bg-success/90 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Complete this course
                </Button>
              </div>
            )}
            {isCourseCompleted && (
              <div className="pt-2">
                <Badge className="bg-success/10 text-success border-success/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Course Completed
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredLessons.map((lesson, idx) => {
              const Icon = typeIcons[lesson.type];
              const isLocked = isCourseCompleted;
              
              return (
                <Link
                  key={lesson.id}
                  to={isLocked ? "#" : `/lesson/${course.id}/${lesson.id}`}
                  onClick={(e) => isLocked && e.preventDefault()}
                  className={`flex items-center gap-4 p-4 bg-card rounded-lg border border-border transition-all ${
                    isLocked 
                      ? "opacity-60 cursor-not-allowed" 
                      : "hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-border flex-shrink-0">
                    {lesson.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.duration}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    <Icon className="h-3 w-3 mr-1" />
                    {lesson.type}
                  </Badge>
                </Link>
              );
            })}
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
