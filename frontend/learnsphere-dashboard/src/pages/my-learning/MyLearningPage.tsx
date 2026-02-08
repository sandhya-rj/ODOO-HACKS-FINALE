import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Award,
  Star,
  TrendingUp,
  RefreshCw,
  GraduationCap,
  ArrowRight,
  BookOpen,
  Zap,
  Brain,
  Trophy,
  BarChart3,
  Target,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";
import { LeaderboardCard } from "@/components/leaderboard/LeaderboardCard";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { mockCourses } from "@/data/mockData";
import { bannerImages } from "@/data/courseImages";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const enrolledCourses = mockCourses.filter((c) => c.published);

// Demo user ID (Sandhya RJ)
const CURRENT_USER_ID = 'cac7caff-6f69-483f-a39d-50abbf8f54ac';

export default function MyLearningPage() {
  const [search, setSearch] = useState("");
  const filtered = enrolledCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch real-time leaderboard data
  const { leaderboard, getBadgeLevel, isLoading } = useLeaderboard({ pollInterval: 5000 });
  
  // Find current user's data from leaderboard
  const currentUserData = leaderboard.find(u => u.userId === CURRENT_USER_ID);
  const totalPoints = currentUserData?.totalPoints || 0;
  const badgeLevel = getBadgeLevel(totalPoints);

  // Listen for quiz completion to trigger refresh
  useEffect(() => {
    const handleRefresh = () => {
      console.log('Profile data refreshing after quiz...');
    };
    window.addEventListener('leaderboard-refresh', handleRefresh);
    return () => window.removeEventListener('leaderboard-refresh', handleRefresh);
  }, []);

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative bg-[hsl(225,50%,4%)] overflow-hidden">
        <div className="absolute inset-0">
          <img src={bannerImages.profile} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225,50%,4%)]/95 via-[hsl(230,50%,7%)]/80 to-[hsl(225,50%,4%)]" />
        </div>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left — profile info */}
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/25 to-indigo-500/25 flex items-center justify-center ring-4 ring-white/[0.06] shadow-xl flex-shrink-0">
                <span className="text-3xl font-extrabold text-white">SR</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Learning</h1>
                  {currentUserData?.rank && currentUserData.rank <= 5 && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/20 text-[10px] font-bold rounded-full">
                      Rank #{currentUserData.rank}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/45">Welcome back, Sandhya. Keep pushing forward.</p>
              </div>
            </div>

            {/* Right — quick stats */}
            <div className="flex items-center gap-5">
              {[
                { value: totalPoints.toLocaleString(), label: "Points", icon: Star, color: "text-amber-400", loading: isLoading },
                { value: badgeLevel, label: "Badge", icon: Award, color: "text-violet-400" },
                { value: `${enrolledCourses.length}`, label: "Courses", icon: BookOpen, color: "text-blue-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <s.icon className={`h-4.5 w-4.5 ${s.color}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-white">{s.value}</p>
                      {s.loading && <RefreshCw className="h-2.5 w-2.5 animate-spin text-white/30" />}
                    </div>
                    <p className="text-[10px] text-white/35">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MY COURSES ── */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">Your Enrolled Courses</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{enrolledCourses.length} courses in your library</p>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl border-border/50 bg-card focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <ScrollReveal key={course.id} direction="up" delay={i * 80}>
                <CourseCard course={course} variant="learner" />
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <GraduationCap className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-medium text-foreground">No courses found.</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </section>

      {/* ── LEADERBOARD SECTION ── */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />
        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <Badge className="mb-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 px-3 py-1 text-[11px] font-semibold rounded-full">
                <Trophy className="h-3 w-3 mr-1" /> Live Rankings
              </Badge>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Leaderboard</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Real-time rankings updated every 5 seconds</p>
            </div>
          </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.15}>
          <LeaderboardCard />
          </ScrollReveal>
        </div>
      </section>

      {/* ── PLATFORM VALUE SECTION ── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              Your learning, <span className="text-primary">supercharged</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              LearnSphere tracks every interaction and transforms it into intelligence.
            </p>
          </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Brain, title: "AI Feedback", desc: "Personalized analysis after every quiz with severity scoring." },
              { icon: Zap, title: "Real-time Events", desc: "Every action triggers live events — instant progress updates." },
              { icon: Trophy, title: "Gamification", desc: "Earn points, unlock badges, and climb the leaderboard." },
              { icon: Target, title: "Smart Tracking", desc: "Lesson-by-lesson progress with pace analysis." },
            ].map((item, i) => (
              <ScrollReveal key={item.title} direction="up" delay={i * 80}>
              <div className="p-5 rounded-2xl border border-border/40 bg-card/50 hover:bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 overflow-hidden bg-[hsl(225,50%,4%)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/8 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal direction="up">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
            Keep the momentum —{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              explore more courses
            </span>
          </h2>
          <p className="text-sm text-white/45 mb-8 max-w-md mx-auto leading-relaxed">
            Discover new skills, take more quizzes, and watch your rank climb in real-time.
          </p>
          </ScrollReveal>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/courses">
              <Button size="lg" className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-5 text-sm font-semibold shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300">
                Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="rounded-xl border-white/15 text-white/80 hover:bg-white/[0.06] px-8 py-5 text-sm font-semibold backdrop-blur-sm transition-all duration-300">
                Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
