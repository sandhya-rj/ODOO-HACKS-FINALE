import { Users, Clock, CheckCircle2, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockLearnerProgress } from "@/data/mockData";

const stats = [
  { label: "Total Participants", value: "156", icon: Users, color: "text-primary" },
  { label: "Yet to Start", value: "23", icon: Clock, color: "text-warning" },
  { label: "In Progress", value: "89", icon: PlayCircle, color: "text-info" },
  { label: "Completed", value: "44", icon: CheckCircle2, color: "text-success" },
];

export default function ReportsDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Track learner progress across courses
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/40 rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Table */}
      <Card className="border-border/40 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Learner</TableHead>
                <TableHead className="hidden md:table-cell">
                  Enrolled
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Time Spent
                </TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLearnerProgress.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-sm">
                    {row.course}
                  </TableCell>
                  <TableCell className="text-sm">{row.learner}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                    {row.enrolledDate}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                    {row.timeSpent}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={row.completion}
                        className="h-1.5 w-16"
                      />
                      <span className="text-xs text-muted-foreground">
                        {row.completion}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        row.status === "completed"
                          ? "bg-success text-success-foreground text-[10px]"
                          : row.status === "in-progress"
                          ? "bg-info text-info-foreground text-[10px]"
                          : "text-[10px]"
                      }
                    >
                      {row.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
