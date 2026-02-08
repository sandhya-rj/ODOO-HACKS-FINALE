import { BookOpen, GraduationCap, Home, LayoutGrid, BarChart3, PenTool, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const learnerNav: NavItem[] = [
  { label: "Home", path: "/home", icon: Home },
  { label: "Browse Courses", path: "/courses", icon: LayoutGrid },
  { label: "My Learning", path: "/my-learning", icon: GraduationCap },
];

const instructorNav: NavItem[] = [
  { label: "Course Management", path: "/instructor/courses", icon: BookOpen },
  { label: "Quiz Builder", path: "/instructor/quiz-builder", icon: PenTool },
  { label: "Reports", path: "/instructor/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { role } = useRole();
  const location = useLocation();

  const renderNavItem = (item: NavItem) => {
    const isActive =
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/");
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
        }`}
      >
        <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-border/40 bg-card/50 min-h-[calc(100vh-4rem)] py-5 px-3 flex-shrink-0">
      {/* Learner Section */}
      <div className="mb-6">
        <div className="px-3 mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">
            Learning
          </span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {learnerNav.map(renderNavItem)}
        </nav>
      </div>

      {/* Metallic divider */}
      <div className="mx-3 mb-5 divider-metallic opacity-40" />

      {/* Instructor Section (only when instructor) */}
      {role === "instructor" && (
        <div className="mb-6">
          <div className="px-3 mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">
              Instructor
            </span>
          </div>
          <nav className="flex flex-col gap-0.5">
            {instructorNav.map(renderNavItem)}
          </nav>
        </div>
      )}

      {/* Bottom promo card */}
      <div className="mt-auto">
        <div className="mx-1 p-4 rounded-xl bg-gradient-to-br from-primary/8 via-blue-500/5 to-indigo-500/8 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">AI Insights</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Real-time learning analytics powered by intelligent performance tracking.
          </p>
        </div>
      </div>
    </aside>
  );
}
