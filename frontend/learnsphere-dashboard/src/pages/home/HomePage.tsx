import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BarChart3,
  Zap,
  Brain,
  Trophy,
  ShieldCheck,
  TrendingUp,
  Bell,
  Target,
  Search,
  Play,
  CheckCircle2,
  GraduationCap,
  Quote,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CourseCard } from "@/components/courses/CourseCard";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { mockCourses } from "@/data/mockData";
import {
  bannerImages,
  featureImages,
  getCourseImage,
} from "@/data/courseImages";

/* ──────────────────────────────────────────────
   HERO SECTION — Premium, calm, focused
   ────────────────────────────────────────────── */
function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const categories = ["Machine Learning", "React", "UX Design", "Cloud", "Data Science", "Business"];

  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-gradient-to-br from-[hsl(225,50%,3%)] via-[hsl(230,50%,5%)] to-[hsl(225,50%,4%)]">
      {/* Subtle background with vignette */}
      <div className="absolute inset-0">
        <img
          src={bannerImages.hero}
          alt=""
          className="w-full h-full object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225,50%,3%)]/95 via-[hsl(230,50%,6%)]/85 to-[hsl(225,50%,4%)]/95" />
        {/* Center vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Minimal dot grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 0.5px, transparent 0.5px)", backgroundSize: "32px 32px" }}
      />

      {/* Single subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/[0.08] rounded-full blur-[140px]" />

      <div className={`relative z-10 w-full max-w-6xl mx-auto px-6 py-16 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-20 items-center">
          {/* LEFT CONTENT ZONE */}
          <div>
            {/* Subtle top badges */}
            <div className="flex items-center gap-2.5 mb-8">
              <Badge className="bg-blue-500/[0.08] text-blue-300/80 border-blue-400/[0.12] backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium rounded-full">
                <Cpu className="h-2.5 w-2.5 mr-1" /> AI-Powered
              </Badge>
              <Badge className="bg-emerald-500/[0.08] text-emerald-300/80 border-emerald-400/[0.12] backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium rounded-full">
                <Zap className="h-2.5 w-2.5 mr-1" /> Real-time
              </Badge>
            </div>

            {/* Refined headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-white leading-[1.1] tracking-[-0.02em] mb-6">
              The Intelligent <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Learning Platform</span> for Modern Teams
            </h1>

            {/* Calm supporting copy */}
            <p className="text-[15px] sm:text-base text-white/50 max-w-lg mb-10 leading-[1.7]">
              Adaptive quizzes, real-time analytics, AI-driven insights, and gamified leaderboards — everything you need to teach and learn smarter.
            </p>

            {/* Focused CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-12">
              <Link to="/courses">
                <Button 
                  size="lg" 
                  className="relative rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-6 text-sm font-bold shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-500/35 hover:scale-[1.02] transition-all duration-300 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center">
                    Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </Link>
              <Link to="/demo">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="rounded-xl border border-white/[0.12] text-white/80 hover:bg-white/[0.06] hover:border-white/20 hover:text-white px-8 py-6 text-sm font-semibold backdrop-blur-sm transition-all duration-300"
                >
                  <Play className="mr-2 h-3.5 w-3.5" /> Watch Demo
                </Button>
              </Link>
            </div>

            {/* De-emphasized search */}
            <div className="relative max-w-md mb-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
              <Link to="/courses" className="block">
                <div className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/35 flex items-center text-[13px] hover:bg-white/[0.06] hover:border-white/[0.08] transition-all cursor-pointer">
                  Search Machine Learning, React, UX Design...
                </div>
              </Link>
            </div>

            {/* Minimal category tags */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat} to="/courses">
                  <span className="inline-block px-2.5 py-1 text-[10px] font-medium text-white/40 bg-white/[0.03] border border-white/[0.04] rounded-md hover:bg-white/[0.05] hover:text-white/60 transition-all cursor-pointer">
                    {cat}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT STAT PANEL — Unified & Cohesive */}
          <div className="hidden lg:block relative">
            <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-xl p-7 shadow-2xl shadow-black/20">
              {/* Unified stat grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { value: "6+", label: "Expert-Led Courses", icon: BookOpen },
                  { value: "50+", label: "Quiz Questions", icon: Brain },
                  { value: "5s", label: "Real-time Latency", icon: Zap },
                  { value: "AI", label: "Powered Insights", icon: BarChart3 },
                ].map((stat) => (
                  <div key={stat.label} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300">
                    <stat.icon className="h-4.5 w-4.5 text-blue-300/70 mb-3.5" strokeWidth={2} />
                    <p className="text-2xl font-black text-white mb-0.5 tracking-tight">{stat.value}</p>
                    <p className="text-[11px] text-white/35 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Subtle live indicator */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-400/[0.08]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                </span>
                <span className="text-[10px] text-emerald-300/70 font-medium tracking-wide">Event engine running — live data updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal tech bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-t from-background/90 via-background/60 to-transparent pt-10 pb-5">
          <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
            {[
              "Event-Driven Architecture",
              "Prisma ORM",
              "React 18 + TypeScript",
              "Express.js API",
              "AI Learning Engine",
            ].map((tech) => (
              <span key={tech} className="text-[10px] text-muted-foreground/40 font-medium tracking-wider uppercase">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SCROLLING COURSE IMAGE STRIP
   ────────────────────────────────────────────── */
function ImageMarquee() {
  const images = mockCourses
    .filter((c) => c.published)
    .map((c) => ({ title: c.title, src: getCourseImage(c.id) }));
  const doubled = [...images, ...images];

  return (
    <section className="py-10 bg-background overflow-hidden border-b border-border/20">
      <div className="relative">
        <div className="flex gap-4 animate-marquee">
          {doubled.map((img, i) => (
            <div key={i} className="flex-shrink-0 w-56 h-32 rounded-xl overflow-hidden relative group">
              <img src={img.src} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-white/80">{img.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   VALUE PROPOSITION STRIP
   ────────────────────────────────────────────── */
function ValueStrip() {
  const values = [
    { icon: Brain, title: "AI-Powered Feedback", desc: "Instant severity-based analysis after every quiz" },
    { icon: Zap, title: "Real-time Everything", desc: "Events, leaderboards, and notifications update live" },
    { icon: Trophy, title: "Gamified Learning", desc: "Points, badges, and ranks keep learners engaged" },
    { icon: ShieldCheck, title: "Instructor Intelligence", desc: "Smart alerts and analytics for every student" },
  ];

  return (
    <section className="py-16 bg-background border-b border-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 100} direction="up">
              <div className="flex items-start gap-4 group">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-blue-500/20 transition-all duration-300">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   COURSE SHOWCASE
   ────────────────────────────────────────────── */
function CourseShowcase() {
  const publishedCourses = mockCourses.filter((c) => c.published).slice(0, 6);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
                Popular Right Now
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                Expert-led courses with intelligent progress tracking, real-time quizzes, and AI-powered feedback.
              </p>
            </div>
            <Link to="/courses">
              <Button variant="outline" className="rounded-xl border-border/60 text-sm font-semibold hover:bg-accent/50 transition-all whitespace-nowrap">
                Browse All <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedCourses.map((course, i) => (
            <ScrollReveal key={course.id} delay={i * 80} direction="up">
              <CourseCard course={course} variant="learner" />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   PLATFORM FEATURES — Clean SaaS Grid
   ────────────────────────────────────────────── */
const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning Insights",
    description: "Automatic performance analysis with severity-based feedback and personalized recommendations after every quiz.",
  },
  {
    icon: Zap,
    title: "Real-time Event Engine",
    description: "Live updates for quiz submissions, course completions, and milestones — instructors and learners stay perfectly in sync.",
  },
  {
    icon: Trophy,
    title: "Gamified Leaderboard System",
    description: "Points, badges, and ranks update in real-time to drive engagement while tracking participation metrics.",
  },
  {
    icon: Bell,
    title: "Smart Instructor Notifications",
    description: "Severity-coded alerts when learners struggle, enabling timely intervention to ensure no student falls behind.",
  },
];

function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
              Platform Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
              Everything instructors and learners <span className="text-primary">actually need</span>
            </h2>
            <p className="text-muted-foreground text-[15px] max-w-xl mx-auto leading-relaxed">
              A vertically-integrated learning platform — from intelligent quizzing to real-time monitoring.
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <ScrollReveal key={feature.title} delay={idx * 80} direction="up">
              <div className="group relative bg-card border border-border/40 rounded-2xl p-8 hover:border-border/60 hover:shadow-lg hover:shadow-primary/[0.03] transition-all duration-300">
                {/* Icon */}
                <div className="mb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors duration-300">
                    <feature.icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2.5 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   TESTIMONIALS — Udemy-style quote cards
   ────────────────────────────────────────────── */
const testimonials = [
  {
    quote: "LearnSphere was rated the most comprehensive AI-powered learning platform in our 2026 Internal EdTech evaluation. The real-time feedback loop is unmatched.",
    org: "TechCorp Research",
    orgDetail: "12,400 engineers trained",
    name: "Sarah Chen",
    title: "VP of Engineering, TechCorp",
    avatar: "SC",
    cta: "View AI & ML courses",
    link: "/courses",
  },
  {
    quote: "LearnSphere was truly a game-changer for our team. The real-time leaderboard and AI-driven insights transformed how we approach upskilling across departments.",
    name: "James Rodriguez",
    title: "CTO, DataFlow Inc.",
    avatar: "JR",
    cta: "View Data Science courses",
    link: "/courses",
  },
  {
    quote: "The platform gives instructors the ability to monitor every learner in real-time. I learned exactly where students struggle and can intervene before they fall behind.",
    name: "Dr. Priya Sharma",
    title: "Senior Instructor, CloudAcademy",
    avatar: "PS",
    cta: "View Instructor tools",
    link: "/instructor/courses",
  },
  {
    quote: "With LearnSphere, our L&D team was able to combine adaptive quizzing, real-time analytics, and gamification to drive genuine engagement across 500+ employees.",
    name: "Michael Torres",
    title: "Head of L&D, Nexus Global",
    avatar: "MT",
    cta: "Read full story",
    link: "/about",
  },
];

function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-12">
            Join others transforming their teams through learning
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 100} direction="up">
              <Card className="group h-full border-border/40 rounded-2xl hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <Quote className="h-8 w-8 text-primary/20 mb-4 flex-shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed flex-1 mb-6">{t.quote}</p>

                  {t.org && (
                    <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border/30">
                      <p className="text-xs font-bold text-foreground">{t.org}</p>
                      <p className="text-[10px] text-muted-foreground">{t.orgDetail}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{t.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.title}</p>
                    </div>
                  </div>

                  <Link to={t.link} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link">
                    {t.cta}
                    <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400} direction="up">
          <div className="mt-8">
            <Link to="/about" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
              View all stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   ROLE-BASED EXPERIENCE SECTION
   ────────────────────────────────────────────── */
function RolesSection() {
  const roles = [
    {
      title: "For Learners",
      subtitle: "Learn, compete, and grow",
      description: "Browse curated courses, take adaptive quizzes, track your rank on the live leaderboard, and receive AI-powered feedback after every assessment.",
      items: ["Curated course catalog with progress tracking", "Adaptive quiz engine with instant feedback", "Real-time leaderboard with badge tiers", "Personalized AI insights per assessment"],
      image: featureImages.progress,
      cta: "Start Learning",
      link: "/courses",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "For Instructors",
      subtitle: "Monitor, manage, and intervene",
      description: "Real-time activity feeds, smart severity-coded alerts, Kanban-style course management, and advanced analytics — all in one dashboard.",
      items: ["Live event feed — every quiz and completion", "Smart alert system with severity detection", "Course management with drag-and-drop", "Performance analytics and reporting"],
      image: bannerImages.instructor,
      cta: "Instructor Dashboard",
      link: "/instructor/courses",
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 px-4 py-1.5 text-xs font-medium rounded-full">
              Role-Based Experience
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              One platform,{" "}
              <span className="text-primary">every stakeholder</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Whether you're a learner or an instructor, LearnSphere adapts to your workflow with purpose-built interfaces.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role, i) => (
            <ScrollReveal key={role.title} delay={i * 150} direction="up">
              <Card className="group border-border/40 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full">
                <div className="h-52 relative overflow-hidden">
                  <img src={role.image} alt={role.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <p className="text-[11px] text-primary font-semibold uppercase tracking-wider mb-1">{role.subtitle}</p>
                    <h3 className="text-xl font-bold text-foreground">{role.title}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{role.description}</p>
                  <ul className="space-y-2.5 mb-6">
                    {role.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to={role.link}>
                    <Button className={`w-full rounded-xl bg-gradient-to-r ${role.gradient} text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/10`}>
                      {role.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   LEARNING INTELLIGENCE SECTION
   ────────────────────────────────────────────── */
function IntelligenceSection() {
  const capabilities = [
    { icon: Target, title: "Performance Tracking", desc: "Every quiz scored and analyzed — severity levels from critical to excellent." },
    { icon: TrendingUp, title: "Learning Pace Analysis", desc: "Track time-per-lesson, completion velocity, and identify struggling learners." },
    { icon: Brain, title: "Smart Recommendations", desc: "AI generates personalized advice based on quiz patterns and progress." },
    { icon: ShieldCheck, title: "Instructor Alerts", desc: "Automatic severity-coded alerts when learners need intervention." },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-background" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <ScrollReveal direction="left">
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-primary/5 group-hover:shadow-primary/10 transition-all duration-500">
                <img src={bannerImages.insights} alt="Learning Intelligence Engine" className="w-full h-auto object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card border border-border/40 rounded-xl shadow-lg px-4 py-3 flex items-center gap-2 animate-float-slow">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Live Insights</p>
                  <p className="text-[10px] text-muted-foreground">Updates every 5s</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <div>
              <Badge className="mb-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-0 px-4 py-1.5 text-xs font-medium rounded-full">
                Learning Intelligence Engine
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
                Intelligence that{" "}
                <span className="text-primary">drives outcomes</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Our learning insights engine processes every interaction — quiz submissions,
                lesson completions, time spent — and transforms raw data into actionable
                intelligence for both learners and instructors.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capabilities.map((cap, i) => (
                  <ScrollReveal key={cap.title} delay={200 + i * 80} direction="up">
                    <div className="p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300">
                      <cap.icon className="h-5 w-5 text-primary mb-2" />
                      <h4 className="text-sm font-semibold text-foreground mb-1">{cap.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   TRUST / METRICS SECTION
   ────────────────────────────────────────────── */
function TrustSection() {
  const metrics = [
    { value: "6+", label: "Expert-Led Courses", icon: BookOpen },
    { value: "50+", label: "Quiz Questions", icon: Brain },
    { value: "5s", label: "Event Latency", icon: Zap },
    { value: "100%", label: "Real-time Tracking", icon: BarChart3 },
    { value: "AI", label: "Powered Insights", icon: Target },
    { value: "Live", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />

      <div className="relative max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
              Built for{" "}
              <span className="text-primary">production-grade</span> education
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Enterprise architecture. Real data flows. Production-ready intelligence.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, i) => (
            <ScrollReveal key={metric.label} delay={i * 80} direction="up">
              <div className="text-center p-5 rounded-2xl border border-border/40 bg-card/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-400">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center mx-auto mb-3">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-extrabold text-foreground mb-0.5">{metric.value}</p>
                <p className="text-[11px] text-muted-foreground">{metric.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FINAL CTA SECTION
   ────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-[hsl(225,50%,4%)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/8 rounded-full blur-[120px] animate-glow" />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal direction="up">
          <Badge className="mb-6 bg-white/10 text-white/70 border-white/10 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold rounded-full">
            <GraduationCap className="h-3 w-3 mr-1.5" /> Start Learning Today
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
            Ready to experience{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              intelligent learning?
            </span>
          </h2>
          <p className="text-base text-white/45 mb-10 max-w-xl mx-auto leading-relaxed">
            Join LearnSphere — AI-driven feedback, real-time analytics, gamified progress, and instructor intelligence. All in one platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-6 text-base font-semibold shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="rounded-xl border-white/15 text-white/80 hover:bg-white/[0.06] px-10 py-6 text-base font-semibold backdrop-blur-sm transition-all duration-300">
                View Live Demo
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   HOME PAGE EXPORT
   ────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ImageMarquee />
      <ValueStrip />
      <CourseShowcase />
      <FeaturesSection />
      <TestimonialsSection />
      <IntelligenceSection />
      <RolesSection />
      <TrustSection />
      <CTASection />
    </div>
  );
}
