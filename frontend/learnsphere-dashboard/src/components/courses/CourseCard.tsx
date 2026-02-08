import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Star, Users, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "@/data/mockData";
import { getCourseImage } from "@/data/courseImages";

interface CourseCardProps {
  course: Course;
  variant?: "learner" | "instructor";
}

export function CourseCard({ course, variant = "learner" }: CourseCardProps) {
  const lessons = course.lessons || [];
  const completedCount = lessons.filter((l) => l.completed).length;
  const computedProgress = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : course.progress;

  const courseImage = getCourseImage(course.id);

  const getActionButton = () => {
    if (variant === "instructor") {
      return (
        <Link to={`/instructor/course/${course.id}`}>
          <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold">
            Edit Course
          </Button>
        </Link>
      );
    }

    if (computedProgress >= 100) {
      return (
        <Link to={`/course/${course.id}`}>
          <Button variant="outline" size="sm" className="w-full rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 text-xs font-semibold">
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Review Course
          </Button>
        </Link>
      );
    }
    if (computedProgress > 0) {
      return (
        <Link to={`/course/${course.id}`}>
          <Button size="sm" className="w-full rounded-xl text-xs font-semibold">
            <Play className="mr-1.5 h-3.5 w-3.5" /> Continue Learning
          </Button>
        </Link>
      );
    }
    return (
      <Link to={`/course/${course.id}`}>
        <Button size="sm" className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 shadow-sm shadow-primary/15 text-xs font-semibold">
          Start Learning <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </Link>
    );
  };

  return (
    <Card className="group overflow-hidden card-elite h-full flex flex-col">
      <div className="h-44 relative overflow-hidden">
        <img
          src={courseImage}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-3 right-3">
          {course.published ? (
            <Badge className="bg-emerald-500/90 text-white border-0 shadow-sm backdrop-blur-sm text-[10px] font-semibold px-2 py-0.5">
              Published
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-foreground border-0 shadow-sm text-[10px] font-semibold px-2 py-0.5">
              Draft
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-[11px] font-semibold">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
              <Users className="h-3 w-3 text-white/80" />
              <span className="text-white text-[11px] font-medium">{course.enrolledCount?.toLocaleString()}</span>
            </div>
          </div>
          {variant === "learner" && computedProgress > 0 && computedProgress < 100 && (
            <div className="px-2 py-0.5 rounded-full bg-primary/80 backdrop-blur-sm">
              <span className="text-white text-[10px] font-bold">{computedProgress}%</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-[15px] leading-tight mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground/70 font-medium">
          by {course.instructor}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] font-medium bg-accent/70 text-accent-foreground border-0"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessonsCount} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {course.totalDuration}
          </span>
        </div>

        {variant === "learner" && computedProgress > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">
                {completedCount}/{lessons.length} lessons
              </span>
            </div>
            <Progress value={computedProgress} className={`h-1.5 ${computedProgress >= 100 ? '[&>div]:bg-emerald-500' : ''}`} />
          </div>
        )}

        <div className="pt-0.5 mt-auto">{getActionButton()}</div>
      </CardContent>
    </Card>
  );
}
