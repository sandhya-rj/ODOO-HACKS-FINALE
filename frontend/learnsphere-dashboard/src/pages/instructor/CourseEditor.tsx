import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Users,
  Mail,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockCourses } from "@/data/mockData";

const typeIcons = {
  video: Play,
  document: FileText,
  image: ImageIcon,
  quiz: HelpCircle,
};

export default function CourseEditor() {
  const { id } = useParams();
  const course = mockCourses.find((c) => c.id === id);
  const [published, setPublished] = useState(course?.published ?? false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Course not found.</p>
        <Link to="/instructor/courses">
          <Button variant="outline" className="mt-4">
            Back
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/instructor/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Edit Course</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="publish-toggle"
              className="text-sm text-muted-foreground"
            >
              Publish
            </Label>
            <Switch
              id="publish-toggle"
              checked={published}
              onCheckedChange={setPublished}
            />
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Users className="h-4 w-4 mr-1" />
            Attendees
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Mail className="h-4 w-4 mr-1" />
            Contact
          </Button>
        </div>
      </div>

      {/* Course Fields */}
      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Course Title</Label>
              <Input defaultValue={course.title} className="mt-1.5" />
            </div>
            <div>
              <Label>Tags</Label>
              <Input
                defaultValue={course.tags.join(", ")}
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Website</Label>
              <Select defaultValue="main">
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Website</SelectItem>
                  <SelectItem value="academy">Academy Portal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Image</Label>
              <div className="mt-1.5 border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  Drop image or click to upload
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-foreground">
              Lessons ({course.lessons.length})
            </h3>
            <Dialog open={lessonModalOpen} onOpenChange={setLessonModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Lesson</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="lesson-content" className="mt-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="lesson-content" className="flex-1">
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="lesson-desc" className="flex-1">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="lesson-attach" className="flex-1">
                      Attachments
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="lesson-content"
                    className="space-y-4 mt-4"
                  >
                    <div>
                      <Label>Lesson Title</Label>
                      <Input
                        placeholder="Enter lesson title..."
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Lesson Type</Label>
                      <Select defaultValue="video">
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input placeholder="e.g. 45m" className="mt-1.5" />
                    </div>
                  </TabsContent>
                  <TabsContent value="lesson-desc" className="mt-4">
                    <Textarea
                      placeholder="Lesson description..."
                      rows={6}
                    />
                  </TabsContent>
                  <TabsContent
                    value="lesson-attach"
                    className="space-y-4 mt-4"
                  >
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Drop files or click to upload
                      </p>
                    </div>
                    <div>
                      <Label>External Link</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input placeholder="https://..." />
                        <Button variant="outline" size="icon">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setLessonModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setLessonModalOpen(false)}>
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {course.lessons.map((lesson) => {
              const Icon = typeIcons[lesson.type];
              return (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-3 bg-card rounded-lg border border-border"
                >
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.type} · {lesson.duration}
                    </p>
                  </div>
                  <Badge
                    variant={lesson.completed ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {lesson.completed ? "Complete" : "Draft"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="description" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <Label>Course Description</Label>
              <Textarea
                defaultValue={course.description}
                rows={8}
                className="mt-1.5"
                placeholder="Write a detailed course description..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="options" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Allow Self-Enrollment
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Learners can enroll without approval
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Certificate on Completion
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Issue certificate when course is completed
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Forum Discussion
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enable course discussion forum
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                No quiz configured for this course.
              </p>
              <Link to="/instructor/quiz-builder">
                <Button variant="outline">Open Quiz Builder</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
