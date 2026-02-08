import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 700,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [once]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0,0,0)";
    switch (direction) {
      case "up": return "translate3d(0, 40px, 0)";
      case "down": return "translate3d(0, -40px, 0)";
      case "left": return "translate3d(40px, 0, 0)";
      case "right": return "translate3d(-40px, 0, 0)";
      case "none": return "translate3d(0, 0, 0)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/** Stagger wrapper — gives each child an incremental delay */
interface StaggerProps {
  children: React.ReactNode[];
  className?: string;
  baseDelay?: number;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

export function StaggerReveal({
  children,
  className = "",
  baseDelay = 0,
  stagger = 80,
  direction = "up",
  duration = 600,
}: StaggerProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <ScrollReveal
          key={i}
          delay={baseDelay + i * stagger}
          direction={direction}
          duration={duration}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
