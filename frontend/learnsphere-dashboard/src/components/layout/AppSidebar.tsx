import { BookOpen, GraduationCap, LayoutGrid, BarChart3, PenTool } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const learnerNav: NavItem[] = [
  { label: "Browse Courses", path: "/courses", icon: LayoutGrid },
  { label: "My Learning", path: "/my-learning", icon: GraduationCap },
];

const instructorNav: NavItem[] = [
  { label: "Browse Courses", path: "/courses", icon: LayoutGrid },
  { label: "My Learning", path: "/my-learning", icon: GraduationCap },
  { label: "Course Management", path: "/instructor/courses", icon: BookOpen },
  { label: "Quiz Builder", path: "/instructor/quiz-builder", icon: PenTool },
  { label: "Reports", path: "/instructor/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { role } = useRole();
  const location = useLocation();
  const navItems = role === "instructor" ? instructorNav : learnerNav;

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card min-h-[calc(100vh-4rem)] py-4 px-3 flex-shrink-0">
      <div className="px-3 mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {role === "instructor" ? "Instructor Panel" : "Navigation"}
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
