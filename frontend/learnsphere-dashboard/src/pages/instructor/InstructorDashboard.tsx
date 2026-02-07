import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
import type { Alert } from "@/lib/api";

type ViewMode = "kanban" | "list";

// Mock instructor alerts
const mockInstructorAlerts: Alert[] = [
  {
    alertId: "alert_inst_001",
    type: "quiz_performance",
    message: "15 students are struggling with Quiz 3 in 'Advanced TypeScript'. Average score: 45%.",
    severity: "high",
    source: "ai_insight_engine",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    alertId: "alert_inst_002",
    type: "engagement_drop",
    message: "Course engagement has dropped by 25% in the last week for 'React Fundamentals'.",
    severity: "medium",
    source: "engagement_monitor",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
  },
  {
    alertId: "alert_inst_003",
    type: "progress_milestone",
    message: "80% of students have completed Module 2 in 'JavaScript Basics'. Great progress!",
    severity: "low",
    source: "progress_tracker",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

function CourseListItem({ course }: { course: Course }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow">
      <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
        <BookOpen className="h-5 w-5 text-muted-foreground/50" />
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
          <Button variant="outline" size="sm">
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
            className="hover:shadow-sm transition-shadow"
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
          <div className="p-6 border-2 border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
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

  const filtered = mockCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const draftCourses = filtered.filter((c) => !c.published);
  const publishedCourses = filtered.filter((c) => c.published);

  return (
    <div className="max-w-6xl mx-auto">
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
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
                >
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Instructor Alerts */}
      {mockInstructorAlerts.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recent Insights & Alerts</h2>
            <Badge variant="secondary" className="text-xs">
              {mockInstructorAlerts.length}
            </Badge>
          </div>
          {mockInstructorAlerts.map((alert) => (
            <AlertCard key={alert.alertId} alert={alert} />
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
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
    </div>
  );
}
