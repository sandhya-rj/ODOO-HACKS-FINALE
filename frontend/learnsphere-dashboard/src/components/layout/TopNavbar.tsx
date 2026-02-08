import { Bell, ChevronDown, LogOut, User, Users, Clock, Moon, Sun, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from "@/assets/logo.png";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";

const learnerLinks = [
  { label: "Home", path: "/home" },
  { label: "Courses", path: "/courses" },
  { label: "My Learning", path: "/my-learning" },
  { label: "Pricing", path: "/pricing" },
  { label: "About", path: "/about" },
];

const instructorLinks = [
  { label: "Home", path: "/home" },
  { label: "Courses", path: "/courses" },
  { label: "My Learning", path: "/my-learning" },
  { label: "Instructor", path: "/instructor/courses" },
  { label: "Pricing", path: "/pricing" },
  { label: "About", path: "/about" },
];

// Demo: hard-coded instructor ID (Michael Chen UUID from seed)
const DEMO_INSTRUCTOR_ID = "30daa450-de2f-4089-952f-5162926a6b58";

export function TopNavbar() {
  const { role, setRole, logout } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const links = role === "instructor" ? instructorLinks : learnerLinks;
  const [isDark, setIsDark] = useState(false);

  // Dark mode toggle
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Notifications for instructors only
  const { 
    notifications, 
    unreadCount, 
    markAsRead 
  } = useNotifications({
    userId: DEMO_INSTRUCTOR_ID,
    pollInterval: 5000,
    enabled: role === 'instructor',
  });

  const handleNotificationClick = (notificationId: number) => {
    markAsRead(notificationId);
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/40 bg-gradient-to-r from-card/98 via-card/95 to-card/98 backdrop-blur-2xl flex items-center px-6 shadow-lg shadow-black/[0.05] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-blue-500/[0.02] before:to-transparent before:pointer-events-none">
      {/* Logo */}
      <Link to="/home" className="flex items-center gap-3 mr-8 group relative">
        <div className="relative">
          <div className="absolute inset-0 -m-1 bg-gradient-to-br from-blue-400/30 to-indigo-500/25 rounded-xl blur-lg group-hover:blur-xl transition-all" />
          <div className="absolute inset-0 bg-white/[0.08] rounded-xl" />
          <img 
            src={logoImg} 
            alt="LearnSphere" 
            className="h-12 w-12 object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)] group-hover:drop-shadow-[0_4px_12px_rgba(59,130,246,0.6)] transition-all" 
            style={{ filter: 'brightness(1.3) contrast(1.15)' }}
          />
        </div>
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
          Learn<span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">Sphere</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-0.5 flex-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + "/");
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-1 ml-auto">
        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notification Bell - Instructor Only */}
        {role === 'instructor' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground h-9 w-9 rounded-lg"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] flex items-center justify-center rounded-full bg-destructive text-white text-[9px] font-bold ring-2 ring-card">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl border-border/50 bg-card/98 backdrop-blur-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary border-0">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <ScrollArea className="max-h-[400px]">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  <div className="py-1">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border/20 last:border-0 ${
                          notification.status === 'UNREAD' ? 'bg-primary/[0.03]' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {notification.status === 'UNREAD' && (
                            <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-relaxed ${
                              notification.status === 'UNREAD' 
                                ? 'font-medium text-foreground' 
                                : 'text-muted-foreground'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground/70">
                              <Clock className="h-3 w-3" />
                              {new Date(notification.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Metallic divider */}
        <div className="h-6 w-px bg-border/50 mx-1.5 hidden sm:block" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-9 rounded-lg hover:bg-accent/70">
              <Avatar className="h-7 w-7 ring-1 ring-border/50">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary text-[11px] font-bold">
                  {role === "learner" ? "SR" : "MC"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {role === "learner" ? "Sandhya" : "Michael"}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border-border/50 bg-card/98 backdrop-blur-xl">
            <div className="px-3 py-2.5 border-b border-border/50">
              <p className="text-sm font-semibold">{role === "learner" ? "Sandhya RJ" : "Michael Chen"}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
            <DropdownMenuItem className="py-2.5 cursor-pointer rounded-lg mx-1 my-0.5">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-2.5 cursor-pointer rounded-lg mx-1 my-0.5"
              onClick={() =>
                setRole(role === "learner" ? "instructor" : "learner")
              }
            >
              <Users className="mr-2 h-4 w-4" />
              Switch to {role === "learner" ? "Instructor" : "Learner"}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="text-destructive py-2.5 cursor-pointer rounded-lg mx-1 my-0.5" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
