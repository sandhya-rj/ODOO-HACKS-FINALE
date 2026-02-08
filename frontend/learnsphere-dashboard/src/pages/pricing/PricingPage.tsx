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
  Crown,
  Building2,
  Rocket,
  Star,
  Infinity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/* ──────────────────────────────────────────────
   PRICING HERO
   ────────────────────────────────────────────── */
function PricingHero() {
  return (
    <section className="relative bg-[hsl(225,50%,4%)] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-[120px] animate-glow" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] animate-glow" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-5xl mx-auto px-6 py-24 lg:py-28 text-center">
        <Badge className="mb-5 bg-blue-500/15 text-blue-300 border-blue-400/20 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold rounded-full">
          <Crown className="h-3 w-3 mr-1.5" /> Pricing Plans
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
          Invest in{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            smarter learning
          </span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your team. Every plan includes AI-powered insights,
          real-time event tracking, and our gamified learning engine.
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   PRICING CARDS
   ────────────────────────────────────────────── */
const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for individual learners exploring the platform.",
    icon: Rocket,
    gradient: "from-emerald-500 to-green-600",
    features: [
      "Access to all published courses",
      "Real-time quiz engine",
      "Live leaderboard ranking",
      "Basic progress tracking",
      "Community support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For teams that want full AI insights and instructor tools.",
    icon: Star,
    gradient: "from-blue-500 to-indigo-600",
    features: [
      "Everything in Starter",
      "AI-powered feedback & insights",
      "Instructor dashboard access",
      "Smart severity-coded alerts",
      "Advanced analytics & reports",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Full platform deployment with custom integrations.",
    icon: Building2,
    gradient: "from-violet-500 to-purple-600",
    features: [
      "Everything in Professional",
      "Custom course creation tools",
      "SSO & advanced authentication",
      "Dedicated event pipeline",
      "White-label branding",
      "24/7 dedicated support",
      "Custom AI model training",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

function PricingCards() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 120} direction="up">
              <Card className={`h-full rounded-2xl transition-all duration-500 flex flex-col relative ${
                plan.popular
                  ? "border-primary/30 shadow-2xl shadow-primary/10 scale-[1.02]"
                  : "border-border/40 hover:shadow-xl hover:shadow-primary/5"
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-4 py-1 text-[11px] font-bold rounded-full shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-7 flex flex-col flex-1">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <plan.icon className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-5">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to="/courses">
                    <Button className={`w-full rounded-xl text-sm font-semibold ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30"
                        : "bg-card border border-border/60 text-foreground hover:bg-accent/70"
                    } transition-all duration-300`}>
                      {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
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
   FEATURE COMPARISON
   ────────────────────────────────────────────── */
function FeatureComparison() {
  const features = [
    { name: "Course Access", starter: "All Published", pro: "All Published", enterprise: "All + Custom" },
    { name: "Quiz Engine", starter: true, pro: true, enterprise: true },
    { name: "Real-time Leaderboard", starter: true, pro: true, enterprise: true },
    { name: "AI-Powered Insights", starter: false, pro: true, enterprise: true },
    { name: "Instructor Dashboard", starter: false, pro: true, enterprise: true },
    { name: "Smart Alerts", starter: false, pro: true, enterprise: true },
    { name: "Advanced Analytics", starter: false, pro: true, enterprise: true },
    { name: "Custom Branding", starter: false, pro: false, enterprise: true },
    { name: "SSO Integration", starter: false, pro: false, enterprise: true },
    { name: "Dedicated Support", starter: false, pro: false, enterprise: true },
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === "string") return <span className="text-xs text-foreground font-medium">{value}</span>;
    return value ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
    ) : (
      <div className="h-4 w-0.5 bg-border/60 mx-auto rounded-full" />
    );
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />
      <div className="relative max-w-5xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              Compare{" "}
              <span className="text-primary">all features</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/50">
            <div className="grid grid-cols-4 gap-0">
              {/* Header */}
              <div className="p-4 border-b border-r border-border/30 bg-muted/30">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Feature</span>
              </div>
              {["Starter", "Professional", "Enterprise"].map((plan) => (
                <div key={plan} className="p-4 border-b border-r border-border/30 bg-muted/30 text-center last:border-r-0">
                  <span className="text-xs font-bold text-foreground">{plan}</span>
                </div>
              ))}

              {/* Rows */}
              {features.map((feature, idx) => (
                <>
                  <div key={`name-${idx}`} className={`p-4 border-r border-border/30 ${idx % 2 === 1 ? "bg-muted/10" : ""} flex items-center`}>
                    <span className="text-sm text-foreground">{feature.name}</span>
                  </div>
                  <div key={`starter-${idx}`} className={`p-4 border-r border-border/30 ${idx % 2 === 1 ? "bg-muted/10" : ""} flex items-center justify-center`}>
                    {renderCell(feature.starter)}
                  </div>
                  <div key={`pro-${idx}`} className={`p-4 border-r border-border/30 ${idx % 2 === 1 ? "bg-muted/10" : ""} flex items-center justify-center`}>
                    {renderCell(feature.pro)}
                  </div>
                  <div key={`ent-${idx}`} className={`p-4 ${idx % 2 === 1 ? "bg-muted/10" : ""} flex items-center justify-center`}>
                    {renderCell(feature.enterprise)}
                  </div>
                </>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FAQ SECTION
   ────────────────────────────────────────────── */
function FAQSection() {
  const faqs = [
    { q: "Is there a free plan?", a: "Yes — our Starter plan is free forever with full access to all published courses, the quiz engine, and real-time leaderboard." },
    { q: "Can I switch plans later?", a: "Absolutely. You can upgrade or downgrade at any time. Changes take effect immediately." },
    { q: "Do I need to install anything?", a: "No. LearnSphere is a fully web-based platform. Just open your browser and start learning." },
    { q: "How does the AI feedback work?", a: "After every quiz submission, our AI engine analyzes your performance, assigns a severity level, and generates personalized improvement recommendations." },
    { q: "Is the real-time feature really real-time?", a: "Our event engine polls every 5 seconds, delivering near-instant updates for leaderboard positions, activity feeds, and instructor alerts." },
    { q: "Can I use this for my organization?", a: "Yes — our Enterprise plan includes custom branding, SSO integration, dedicated event pipelines, and 24/7 support." },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Frequently asked{" "}
              <span className="text-primary">questions</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <ScrollReveal key={faq.q} delay={i * 60} direction="up">
              <div className="p-5 rounded-2xl border border-border/40 bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300">
                <h3 className="text-sm font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
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
function PricingCTA() {
  return (
    <section className="relative py-24 overflow-hidden bg-[hsl(225,50%,4%)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/8 rounded-full blur-[120px] animate-glow" />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal direction="up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">
            Ready to transform your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              learning experience?
            </span>
          </h2>
          <p className="text-base text-white/45 mb-10 max-w-xl mx-auto leading-relaxed">
            Start free. Upgrade when you're ready. No credit card required.
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
   PRICING PAGE EXPORT
   ────────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <div className="flex flex-col">
      <PricingHero />
      <PricingCards />
      <FeatureComparison />
      <FAQSection />
      <PricingCTA />
    </div>
  );
}
