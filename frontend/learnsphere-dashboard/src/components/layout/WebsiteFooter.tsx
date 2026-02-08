import { BookOpen, BarChart3, Users, Zap, Brain, Trophy, ShieldCheck, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Browse Courses", to: "/courses" },
      { label: "My Learning", to: "/my-learning" },
      { label: "Live Leaderboard", to: "/my-learning" },
      { label: "Quiz Engine", to: "/courses" },
      { label: "Live Demo", to: "/demo" },
    ],
  },
  {
    title: "Instructors",
    links: [
      { label: "Dashboard", to: "/instructor/courses" },
      { label: "Course Editor", to: "/instructor/courses" },
      { label: "Quiz Builder", to: "/instructor/quiz-builder" },
      { label: "Analytics & Reports", to: "/instructor/reports" },
      { label: "Smart Alerts", to: "/instructor/courses" },
    ],
  },
  {
    title: "Technology",
    links: [
      { label: "Real-time Event Engine", to: "#" },
      { label: "Learning Insights AI", to: "#" },
      { label: "Smart Alert System", to: "#" },
      { label: "Gamification Engine", to: "#" },
      { label: "Analytics Pipeline", to: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Pricing", to: "/pricing" },
      { label: "Contact", to: "/contact" },
      { label: "System Status", to: "/demo/system" },
    ],
  },
];

export function WebsiteFooter() {
  return (
    <footer className="relative bg-[hsl(225,50%,4%)] text-white overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 -m-1 bg-gradient-to-br from-blue-400/35 to-indigo-500/30 rounded-xl blur-xl" />
                <div className="absolute inset-0 bg-white/[0.10] rounded-xl" />
                <img 
                  src={logoImg} 
                  alt="LearnSphere" 
                  className="h-14 w-14 object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(59,130,246,0.5)]" 
                  style={{ filter: 'brightness(1.35) contrast(1.2)' }}
                />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
                Learn<span className="bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Sphere</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-6">
              Intelligent learning management powered by real-time event-driven architecture.
              AI-driven insights, gamified progress, and production-grade analytics.
            </p>
            {/* Tech icon row */}
            <div className="flex items-center gap-3 mb-6">
              {[
                { icon: BookOpen, label: "Courses" },
                { icon: Brain, label: "AI Insights" },
                { icon: Zap, label: "Real-time" },
                { icon: Trophy, label: "Gamification" },
                { icon: BarChart3, label: "Analytics" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                  title={label}
                >
                  <Icon className="h-3.5 w-3.5 text-white/35" />
                </div>
              ))}
            </div>
            {/* Live status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              <span className="text-[10px] text-emerald-300/70 font-medium">Platform running</span>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] font-semibold text-white/25 uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/45 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tech stack strip */}
        <div className="mb-6 py-4 px-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              "React 18",
              "TypeScript",
              "Express.js",
              "Prisma ORM",
              "SQLite",
              "Tailwind CSS",
              "shadcn/ui",
              "Real-time Events",
              "AI Engine",
            ].map((tech) => (
              <span key={tech} className="text-[10px] text-white/25 font-medium tracking-wider uppercase">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} LearnSphere. Built for the national hackathon.
          </p>
          <div className="flex items-center gap-5 text-[11px] text-white/25">
            <span>Event-Driven Architecture</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>AI-Powered Insights</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Production Grade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
