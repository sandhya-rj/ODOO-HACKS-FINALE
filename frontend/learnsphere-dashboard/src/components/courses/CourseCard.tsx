import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "@/data/mockData";

interface CourseCardProps {
  course: Course;
  variant?: "learner" | "instructor";
}

export function CourseCard({ course, variant = "learner" }: CourseCardProps) {
  const getActionButton = () => {
    if (variant === "instructor") {
      return (
        <Link to={`/instructor/course/${course.id}`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      );
    }

    if (course.progress === 100) {
      return (
        <Link to={`/course/${course.id}`}>
          <Button variant="outline" size="sm">
            Review
          </Button>
        </Link>
      );
    }
    if (course.progress > 0) {
      return (
        <Link to={`/course/${course.id}`}>
          <Button size="sm">Continue</Button>
        </Link>
      );
    }
    return (
      <Link to={`/course/${course.id}`}>
        <Button size="sm">Start</Button>
      </Link>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-border">
      <div className="h-40 bg-muted flex items-center justify-center relative">
        <BookOpen className="h-12 w-12 text-muted-foreground/30" />
        {course.published ? (
          <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
            Published
          </Badge>
        ) : (
          <Badge variant="secondary" className="absolute top-3 right-3">
            Draft
          </Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {course.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] font-medium"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessonsCount} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.totalDuration}
          </span>
        </div>

        {variant === "learner" && course.progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {course.progress}%
              </span>
            </div>
            <Progress value={course.progress} className="h-1.5" />
          </div>
        )}

        <div className="pt-1">{getActionButton()}</div>
      </CardContent>
    </Card>
  );
}
