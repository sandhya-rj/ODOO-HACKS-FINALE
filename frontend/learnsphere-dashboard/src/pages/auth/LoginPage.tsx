import { useState } from "react";
import { GraduationCap, BookOpen, ArrowRight, BarChart3, Trophy, Brain, Zap } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { useRole } from "@/contexts/RoleContext";
import { bannerImages, featureImages } from "@/data/courseImages";

export default function LoginPage() {
  const { setRole, setAuthenticated } = useRole();
  const [selectedRole, setSelectedRole] = useState<"learner" | "instructor" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSignIn = () => {
    if (!selectedRole) return;
    setIsAnimating(true);
    setTimeout(() => {
      setRole(selectedRole);
      setAuthenticated(true);
    }, 600);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-20">
      {/* Premium deep navy gradient background with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#070b16] via-[#0b1225] to-[#08101e]" />
      
      {/* Radial depth overlays - center focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.06),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(56,100,220,0.05),transparent_45%)]" />
      
      {/* Subtle noise/grain texture */}
      <div className="absolute inset-0 opacity-[0.025]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")` 
      }} />
      
      {/* Soft ambient orbs - no distracting movement */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[100px]" />

      {/* Refined dot-grid pattern */}
      <div className="absolute inset-0 opacity-[0.012]" style={{ 
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 0.5px, transparent 0.5px)", 
        backgroundSize: "28px 28px" 
      }} />

      <div className={`relative z-10 w-full max-w-xl mx-4 transition-all duration-700 ease-out ${isAnimating ? "scale-95 opacity-0 translate-y-4" : "scale-100 opacity-100 translate-y-0"}`}>
        {/* HERO BRAND MARK */}
        <div className="text-center mb-14 space-y-8">
          {/* Logo with premium halo */}
          <div className="relative inline-block animate-fade-in">
            <div className="absolute inset-0 -m-4 bg-gradient-to-br from-blue-400/40 via-indigo-400/30 to-blue-500/25 rounded-full blur-2xl" />
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-blue-300/[0.12] to-indigo-400/[0.10] rounded-3xl backdrop-blur-sm" />
              <img 
                src={logoImg} 
                alt="LearnSphere" 
                className="h-24 w-24 object-contain relative z-10 drop-shadow-[0_8px_24px_rgba(59,130,246,0.6)]" 
                style={{ filter: 'brightness(1.4) contrast(1.2) drop-shadow(0 0 12px rgba(96, 165, 250, 0.4))' }}
              />
            </div>
          </div>

          {/* Hero headline */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.05s" }}>
            <h1 className="text-5xl sm:text-6xl font-black tracking-[-0.02em] leading-[1.1]">
              <span className="bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(255,255,255,0.15)]">
                Learn
              </span>
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(99,102,241,0.35)]">
                Sphere
              </span>
            </h1>
            <p className="text-[15px] text-white/50 font-medium tracking-wide max-w-md mx-auto">
              Intelligent learning. Real-time insights.
            </p>
          </div>
        </div>

        {/* VALUE PROPOSITION PILLS */}
        <div className="flex items-center justify-center gap-3 mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {[
            { icon: Brain, label: "Smart Insights" },
            { icon: Trophy, label: "Leaderboards" },
            { icon: BarChart3, label: "Analytics" },
          ].map(({ icon: Icon, label }) => (
            <div 
              key={label} 
              className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] text-white/60 text-xs font-semibold hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-white/75 transition-all duration-300 cursor-default hover:-translate-y-0.5"
            >
              <Icon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              {label}
            </div>
          ))}
        </div>

        {/* PREMIUM LOGIN HERO CARD */}
        <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_1px_rgba(255,255,255,0.1)_inset] animate-slide-up relative overflow-hidden" style={{ animationDelay: "0.15s" }}>
          {/* Subtle reflective surface effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent rounded-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-white/45 text-sm mb-8 font-medium">Choose how you'd like to sign in</p>

            {/* PRODUCT CHOICE ROLE CARDS */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setSelectedRole("learner")}
                className={`group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRole === "learner"
                    ? "border-primary/60 bg-gradient-to-br from-primary/[0.14] to-primary/[0.08] shadow-lg shadow-primary/20"
                    : "border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  selectedRole === "learner"
                    ? "bg-gradient-to-br from-primary to-blue-600 shadow-xl shadow-primary/40"
                    : "bg-white/[0.08] group-hover:bg-white/[0.12] group-hover:scale-105"
                }`}>
                  <GraduationCap className={`h-7 w-7 transition-transform duration-300 ${
                    selectedRole === "learner" ? "text-white" : "text-white/60 group-hover:text-white/80"
                  }`} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold mb-1 transition-colors ${
                    selectedRole === "learner" ? "text-white" : "text-white/70 group-hover:text-white/90"
                  }`}>
                    Learner
                  </p>
                  <p className="text-xs text-white/30 font-medium">Browse & learn</p>
                </div>
                {selectedRole === "learner" && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/50 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setSelectedRole("instructor")}
                className={`group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRole === "instructor"
                    ? "border-blue-400/60 bg-gradient-to-br from-blue-500/[0.14] to-indigo-600/[0.08] shadow-lg shadow-blue-500/20"
                    : "border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10"
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  selectedRole === "instructor"
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/40"
                    : "bg-white/[0.08] group-hover:bg-white/[0.12] group-hover:scale-105"
                }`}>
                  <BookOpen className={`h-7 w-7 transition-transform duration-300 ${
                    selectedRole === "instructor" ? "text-white" : "text-white/60 group-hover:text-white/80"
                  }`} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold mb-1 transition-colors ${
                    selectedRole === "instructor" ? "text-white" : "text-white/70 group-hover:text-white/90"
                  }`}>
                    Instructor
                  </p>
                  <p className="text-xs text-white/30 font-medium">Manage & track</p>
                </div>
                {selectedRole === "instructor" && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse" />
                )}
              </button>
            </div>

            {/* Demo credentials hint */}
            {selectedRole && (
              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] animate-fade-in">
                <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold mb-2 letterspacing-widest">Demo Account</p>
                <p className="text-sm text-white/60 font-medium">
                  {selectedRole === "learner" ? "Sandhya RJ — Learner" : "Michael Chen — Instructor"}
                </p>
              </div>
            )}

            {/* PREMIUM CTA BUTTON */}
            <button
              onClick={handleSignIn}
              disabled={!selectedRole}
              className={`group relative w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl text-[15px] font-bold tracking-wide transition-all duration-300 overflow-hidden ${
                selectedRole
                  ? "bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] border border-blue-400/20"
                  : "bg-white/[0.04] text-white/20 cursor-not-allowed border border-white/[0.04]"
              }`}
            >
              {/* Glossy reflection overlay */}
              {selectedRole && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-80 pointer-events-none" />
              )}
              <span className="relative z-10">Sign In</span>
              <ArrowRight className="h-4.5 w-4.5 relative z-10 transition-transform group-hover:translate-x-0.5" />
            </button>

            <p className="text-center text-xs text-white/20 mt-5 font-medium tracking-wide">
              Demo environment — no password required
            </p>
          </div>
        </div>

        {/* PREMIUM FOOTNOTE */}
        <p className="text-center text-xs text-white/15 mt-8 font-medium tracking-wide animate-fade-in leading-relaxed max-w-md mx-auto" style={{ animationDelay: "0.25s" }}>
          Built with real-time analytics & intelligent learning insights
        </p>
      </div>
    </div>
  );
}
