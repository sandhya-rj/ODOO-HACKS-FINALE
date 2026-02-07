import { useState } from "react";
import { Search, Award, Star, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/courses/CourseCard";
import { mockCourses } from "@/data/mockData";

const enrolledCourses = mockCourses.filter((c) => c.published);

export default function MyLearningPage() {
  const [search, setSearch] = useState("");
  const filtered = enrolledCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPoints = 2450;
  const badgeLevel = "Intermediate";

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Learning</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">JD</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">John Doe</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Lifelong Learner
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-foreground">Points</span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {totalPoints.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Badge</span>
                </div>
                <Badge variant="secondary">{badgeLevel}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-foreground">Courses</span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {enrolledCourses.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} variant="learner" />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No courses found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
