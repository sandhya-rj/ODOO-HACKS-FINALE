import { Bell, ChevronDown, LogOut, User, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const learnerLinks = [
  { label: "Courses", path: "/courses" },
  { label: "My Learning", path: "/my-learning" },
];

const instructorLinks = [
  { label: "Courses", path: "/courses" },
  { label: "My Learning", path: "/my-learning" },
  { label: "Instructor", path: "/instructor/courses" },
  { label: "Reports", path: "/instructor/reports" },
];

export function TopNavbar() {
  const { role, setRole } = useRole();
  const location = useLocation();
  const links = role === "instructor" ? instructorLinks : learnerLinks;

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-card flex items-center px-6">
      <Link to="/courses" className="flex items-center gap-2.5 mr-8">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">LS</span>
        </div>
        <span className="text-lg font-bold text-foreground hidden sm:block">
          LearnSphere
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === link.path ||
              location.pathname.startsWith(link.path + "/")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setRole(role === "learner" ? "instructor" : "learner")
              }
            >
              <Users className="mr-2 h-4 w-4" />
              Switch to {role === "learner" ? "Instructor" : "Learner"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
