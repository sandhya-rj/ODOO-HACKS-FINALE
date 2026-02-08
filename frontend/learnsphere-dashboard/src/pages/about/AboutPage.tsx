import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BarChart3,
  Zap,
  Brain,
  Trophy,
  ShieldCheck,
  Target,
  CheckCircle2,
  Users,
  Globe,
  Layers,
  Code2,
  Database,
  Monitor,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { bannerImages, featureImages } from "@/data/courseImages";

/* ──────────────────────────────────────────────
   ABOUT HERO
   ────────────────────────────────────────────── */
function AboutHero() {
  return (
    <section className="relative bg-[hsl(225,50%,4%)] overflow-hidden">
      <div className="absolute inset-0">
        <img src={bannerImages.hero} alt="" className="w-full h-full object-cover opacity-10 animate-pan" />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225,50%,4%)]/95 via-[hsl(230,50%,7%)]/80 to-[hsl(225,50%,4%)]" />
      </div>
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-[120px] animate-glow" />

      <div className="relative max-w-5xl mx-auto px-6 py-24 lg:py-32 text-center">
        <Badge className="mb-5 bg-blue-500/15 text-blue-300 border-blue-400/20 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold rounded-full">
          <Globe className="h-3 w-3 mr-1.5" /> About LearnSphere
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
          Building the future of{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            intelligent education
          </span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          LearnSphere is an AI-powered learning management platform that combines real-time event-driven architecture,
          adaptive quizzing, and gamified progress tracking into one production-grade system.
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   MISSION SECTION
   ────────────────────────────────────────────── */
function MissionSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
                <img src={featureImages.insights} alt="Our Mission" className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-0 px-4 py-1.5 text-xs font-medium rounded-full">
                Our Mission
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-5">
                Education should be{" "}
                <span className="text-primary">intelligent, not static</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Traditional learning platforms treat education as a one-way broadcast. LearnSphere changes that
                by making every interaction count — every quiz submission triggers real-time events, every score
                feeds into AI-powered insights, and every learner gets a personalized experience.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time feedback loops that keep learners engaged",
                  "AI-driven severity analysis for targeted intervention",
                  "Gamification that drives healthy competition",
                  "Instructor dashboards powered by live event streams",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   ARCHITECTURE / TECH STACK
   ────────────────────────────────────────────── */
function ArchitectureSection() {
  const stack = [
    { icon: Monitor, title: "React 18 + TypeScript", desc: "Modern component architecture with type safety, hooks, and real-time state management." },
    { icon: Server, title: "Express.js REST API", desc: "Production-grade backend with modular controllers, middleware, and error handling." },
    { icon: Database, title: "Prisma ORM + SQLite", desc: "Type-safe database layer with migrations, seeding, and relational data modeling." },
    { icon: Zap, title: "Event-Driven Engine", desc: "Real-time event system with 5-second polling, live activity feeds, and automatic notifications." },
    { icon: Brain, title: "AI Insights Engine", desc: "Severity-based performance analysis, personalized recommendations, and pace tracking." },
    { icon: Trophy, title: "Gamification System", desc: "Points, badge tiers, real-time leaderboard rankings, and competitive engagement." },
    { icon: ShieldCheck, title: "Smart Alert System", desc: "Automatic severity-coded instructor alerts when learners need intervention." },
    { icon: Layers, title: "shadcn/ui + Tailwind", desc: "Enterprise design system with accessible components and custom theme tokens." },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />

      <div className="relative max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-0 px-4 py-1.5 text-xs font-medium rounded-full">
              <Code2 className="h-3 w-3 mr-1.5" /> Technical Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Production-grade{" "}
              <span className="text-primary">engineering</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Built with the same technologies and patterns used by funded startups and enterprise platforms.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stack.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 80} direction="up">
              <Card className="h-full border-border/40 rounded-2xl hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-400">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center mb-3">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
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
   TEAM SECTION
   ────────────────────────────────────────────── */
function TeamSection() {
  const team = [
    { name: "Sandhya RJ", role: "Full-Stack Developer & Project Lead", initials: "SR", gradient: "from-blue-500 to-indigo-600" },
    { name: "AI Learning Engine", role: "Automated Insights & Severity Analysis", initials: "AI", gradient: "from-violet-500 to-purple-600" },
    { name: "Event System", role: "Real-time Data Pipeline & Notifications", initials: "ES", gradient: "from-emerald-500 to-green-600" },
    { name: "Gamification Core", role: "Points, Badges & Leaderboard Rankings", initials: "GC", gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 px-4 py-1.5 text-xs font-medium rounded-full">
              <Users className="h-3 w-3 mr-1.5" /> The Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Built for a{" "}
              <span className="text-primary">national hackathon</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              LearnSphere combines human engineering with intelligent systems to deliver a production-grade learning experience.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 100} direction="up">
              <Card className="h-full border-border/40 rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all duration-400 text-center">
                <CardContent className="p-6">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-lg font-extrabold text-white">{member.initials}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.role}</p>
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
   CTA SECTION
   ────────────────────────────────────────────── */
function AboutCTA() {
  return (
    <section className="relative py-24 overflow-hidden bg-[hsl(225,50%,4%)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/8 rounded-full blur-[120px] animate-glow" />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal direction="up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
            Experience it{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              for yourself
            </span>
          </h2>
          <p className="text-base text-white/45 mb-10 max-w-xl mx-auto leading-relaxed">
            Take a course, submit a quiz, and watch real-time events, AI insights, and leaderboard updates come alive.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-6 text-base font-semibold shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300">
                Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
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
   ABOUT PAGE EXPORT
   ────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHero />
      <MissionSection />
      <ArchitectureSection />
      <TeamSection />
      <AboutCTA />
    </div>
  );
}
