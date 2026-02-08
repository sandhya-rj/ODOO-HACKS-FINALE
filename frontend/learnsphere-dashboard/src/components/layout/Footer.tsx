import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-white/[0.08] rounded-lg" />
              <img 
                src={logoImg} 
                alt="LearnSphere" 
                className="h-7 w-7 object-contain relative z-10" 
                style={{ filter: 'brightness(1.3) contrast(1.1)' }}
              />
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">
              Learn<span className="text-primary">Sphere</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/courses" className="hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link to="/my-learning" className="hover:text-foreground transition-colors">
              My Learning
            </Link>
            <span className="text-border">|</span>
            <span>Real-time analytics & intelligent insights</span>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} LearnSphere
          </p>
        </div>

        {/* Metallic divider */}
        <div className="divider-metallic opacity-30 mt-6 mb-4" />

        <p className="text-center text-[11px] text-muted-foreground/40">
          Built for the national hackathon — Powered by real-time event-driven architecture
        </p>
      </div>
    </footer>
  );
}
