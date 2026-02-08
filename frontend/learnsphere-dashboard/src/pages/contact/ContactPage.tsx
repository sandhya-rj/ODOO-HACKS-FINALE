import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Phone,
  Globe,
  Headphones,
  BookOpen,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/* ──────────────────────────────────────────────
   CONTACT HERO
   ────────────────────────────────────────────── */
function ContactHero() {
  return (
    <section className="relative bg-[hsl(225,50%,4%)] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-[120px] animate-glow" />

      <div className="relative max-w-5xl mx-auto px-6 py-24 lg:py-28 text-center">
        <Badge className="mb-5 bg-blue-500/15 text-blue-300 border-blue-400/20 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold rounded-full">
          <MessageSquare className="h-3 w-3 mr-1.5" /> Get in Touch
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
          We'd love to{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            hear from you
          </span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Have questions about LearnSphere? Want to discuss enterprise deployment?
          Our team is here to help.
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CONTACT METHODS
   ────────────────────────────────────────────── */
function ContactMethods() {
  const methods = [
    { icon: Mail, title: "Email Us", detail: "support@learnsphere.ai", desc: "We respond within 24 hours", color: "text-blue-500" },
    { icon: Headphones, title: "Live Support", detail: "Available 9AM - 6PM IST", desc: "Chat with our engineering team", color: "text-violet-500" },
    { icon: MapPin, title: "Location", detail: "Bangalore, India", desc: "National Hackathon HQ", color: "text-emerald-500" },
    { icon: Clock, title: "Response Time", detail: "Under 4 hours", desc: "For Professional & Enterprise", color: "text-amber-500" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {methods.map((method, i) => (
            <ScrollReveal key={method.title} delay={i * 100} direction="up">
              <Card className="h-full border-border/40 rounded-2xl hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-400">
                <CardContent className="p-5 text-center">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center mx-auto mb-3">
                    <method.icon className={`h-5 w-5 ${method.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">{method.title}</h3>
                  <p className="text-sm font-semibold text-primary mb-1">{method.detail}</p>
                  <p className="text-xs text-muted-foreground">{method.desc}</p>
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
   CONTACT FORM
   ────────────────────────────────────────────── */
function ContactForm() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <ScrollReveal direction="left">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-0 px-4 py-1.5 text-xs font-medium rounded-full">
                Send a Message
              </Badge>
              <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">
                Drop us a{" "}
                <span className="text-primary">message</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Whether you're interested in the platform, have technical questions,
                or want to discuss a partnership — we're all ears.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First name" className="rounded-xl h-11 border-border/50 bg-card focus-visible:ring-primary/20" />
                  <Input placeholder="Last name" className="rounded-xl h-11 border-border/50 bg-card focus-visible:ring-primary/20" />
                </div>
                <Input placeholder="Email address" type="email" className="rounded-xl h-11 border-border/50 bg-card focus-visible:ring-primary/20" />
                <Input placeholder="Organization (optional)" className="rounded-xl h-11 border-border/50 bg-card focus-visible:ring-primary/20" />
                <textarea
                  placeholder="Your message..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
                <Button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-5 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Quick Resources</h3>

              {[
                { icon: BookOpen, title: "Documentation", desc: "Full API reference and integration guides", link: "/about" },
                { icon: FileText, title: "Architecture Guide", desc: "System design, tech stack, and data flow", link: "/about" },
                { icon: Globe, title: "Live Demo", desc: "Experience the full platform in action", link: "/demo" },
                { icon: HelpCircle, title: "FAQs", desc: "Answers to common questions", link: "/pricing" },
              ].map((resource, i) => (
                <Link key={resource.title} to={resource.link}>
                  <Card className="border-border/40 rounded-xl hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 group mb-4">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-blue-500/20 transition-all">
                        <resource.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">{resource.title}</h4>
                        <p className="text-xs text-muted-foreground">{resource.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CTA
   ────────────────────────────────────────────── */
function ContactCTA() {
  return (
    <section className="relative py-20 overflow-hidden bg-[hsl(225,50%,4%)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/8 rounded-full blur-[100px] animate-glow" />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal direction="up">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
            Not sure where to start?{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Try the live demo
            </span>
          </h2>
          <p className="text-sm text-white/45 mb-8 max-w-md mx-auto leading-relaxed">
            Experience LearnSphere in action — take a quiz, watch real-time events, and see AI insights generate live.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/demo">
              <Button size="lg" className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-5 text-sm font-semibold shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300">
                Launch Live Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="lg" className="rounded-xl border-white/15 text-white/80 hover:bg-white/[0.06] px-8 py-5 text-sm font-semibold backdrop-blur-sm transition-all duration-300">
                Browse Courses
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CONTACT PAGE EXPORT
   ────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <ContactHero />
      <ContactMethods />
      <ContactForm />
      <ContactCTA />
    </div>
  );
}
