import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Filter,
  ArrowRight,
  BarChart3,
  Zap,
  Brain,
  Trophy,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";
import { mockCourses } from "@/data/mockData";
import { bannerImages } from "@/data/courseImages";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const courses = mockCourses;
  const allTags = Array.from(new Set(courses.flatMap((c) => c.tags)));
  const publishedCourses = courses.filter((c) => c.published);

  const filtered = publishedCourses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || c.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const totalLessons = publishedCourses.reduce((acc, c) => acc + (c.lessonsCount || 0), 0);

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative bg-[hsl(225,50%,4%)] overflow-hidden">
        <div className="absolute inset-0">
          <img src={bannerImages.hero} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225,50%,4%)]/95 via-[hsl(230,50%,7%)]/80 to-[hsl(225,50%,4%)]" />
        </div>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-blue-500/15 text-blue-300 border-blue-400/20 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold rounded-full">
              <BookOpen className="h-3 w-3 mr-1" /> Course Marketplace
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.10] tracking-tight mb-4">
              Discover courses that{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                accelerate your career
              </span>
            </h1>
            <p className="text-base text-white/50 max-w-xl mb-8 leading-relaxed">
              {publishedCourses.length} expert-led courses with intelligent progress tracking,
              real-time quizzes, and AI-powered feedback.
            </p>

            {/* Search inside hero */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/30" />
              <Input
                placeholder="Search courses by title, topic, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 h-12 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder:text-white/35 focus-visible:ring-blue-500/30 focus-visible:border-white/20 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Hero stats */}
          <div className="flex flex-wrap items-center gap-6 mt-10">
            {[
              { value: `${publishedCourses.length}`, label: "Courses", icon: BookOpen },
              { value: `${totalLessons}+`, label: "Lessons", icon: Layers },
              { value: "AI", label: "Insights", icon: Brain },
              { value: "Live", label: "Tracking", icon: Zap },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-white/35">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTERS ── */}
      <section className="bg-background border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs text-muted-foreground font-medium flex-shrink-0 mr-1">
              <Filter className="h-3.5 w-3.5 inline mr-1" />Filter:
            </span>
            <Badge
              variant={selectedTag === null ? "default" : "secondary"}
              className={`cursor-pointer transition-all rounded-lg flex-shrink-0 ${selectedTag === null ? "shadow-sm" : "hover:bg-accent/70"}`}
              onClick={() => setSelectedTag(null)}
            >
              All Courses
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className={`cursor-pointer transition-all rounded-lg flex-shrink-0 ${selectedTag === tag ? "shadow-sm" : "hover:bg-accent/70"}`}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSE GRID ── */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                {selectedTag ? `${selectedTag} Courses` : "All Courses"}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {filtered.length} course{filtered.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <ScrollReveal key={course.id} direction="up" delay={i * 80}>
                <CourseCard course={course} variant="learner" />
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No courses found</h3>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <Button variant="outline" className="rounded-xl" onClick={() => { setSearch(""); setSelectedTag(null); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── WHAT YOU GET SECTION ── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />
        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              Every course includes
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Not just content — a complete intelligent learning experience.
            </p>
          </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Brain, title: "AI-Powered Feedback", desc: "Get severity-based analysis and personalized recommendations after every quiz." },
              { icon: Zap, title: "Real-time Progress", desc: "Track lesson completions and milestone events as they happen — live updates." },
              { icon: Trophy, title: "Leaderboard Ranking", desc: "Earn points from quizzes, climb the ranks, and unlock badge tiers." },
              { icon: BarChart3, title: "Instructor Analytics", desc: "Instructors monitor your pace and intervene with smart alerts when needed." },
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/8 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal direction="up">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
            Can't decide?{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Try the live demo
            </span>
          </h2>
          <p className="text-sm text-white/45 mb-8 max-w-md mx-auto leading-relaxed">
            Experience the full platform — take a quiz, see real-time events, and watch AI insights generate live.
          </p>
          </ScrollReveal>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/demo">
              <Button size="lg" className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-5 text-sm font-semibold shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300">
                Launch Live Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/my-learning">
              <Button variant="outline" size="lg" className="rounded-xl border-white/15 text-white/80 hover:bg-white/[0.06] px-8 py-5 text-sm font-semibold backdrop-blur-sm transition-all duration-300">
                My Learning Hub
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
