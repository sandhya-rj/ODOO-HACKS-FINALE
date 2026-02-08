import { BookOpen, GraduationCap, LayoutGrid, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const learnerNav: NavItem[] = [
  { label: "Courses", path: "/courses", icon: LayoutGrid },
  { label: "My Learning", path: "/my-learning", icon: GraduationCap },
];

const instructorNav: NavItem[] = [
  { label: "Courses", path: "/courses", icon: LayoutGrid },
  { label: "Learning", path: "/my-learning", icon: GraduationCap },
  { label: "Manage", path: "/instructor/courses", icon: BookOpen },
  { label: "Reports", path: "/instructor/reports", icon: BarChart3 },
];

export function MobileNav() {
  const { role } = useRole();
  const location = useLocation();
  const navItems = role === "instructor" ? instructorNav : learnerNav;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/40 flex items-center justify-around h-16 px-2 shadow-lg shadow-black/[0.03]">
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + "/");
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
