import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export type ScrollAnimationType = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "pop-in" | "fade";

interface RevealOnScrollProps {
  children: React.ReactNode;
  animation?: ScrollAnimationType;
  delay?: number; // Milliseconds delay
  duration?: number; // Milliseconds duration
  className?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className = "",
  threshold = 0.1,
  rootMargin = "0px 0px -30px 0px",
  triggerOnce = true,
}) => {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const getInitialTransform = () => {
    switch (animation) {
      case "fade-up":
        return "translate-y-10 opacity-0";
      case "fade-down":
        return "-translate-y-10 opacity-0";
      case "fade-left":
        return "-translate-x-10 opacity-0";
      case "fade-right":
        return "translate-x-10 opacity-0";
      case "zoom-in":
        return "scale-90 opacity-0";
      case "pop-in":
        return "scale-75 translate-y-6 opacity-0";
      case "fade":
      default:
        return "opacity-0";
    }
  };

  const getRevealedTransform = () => {
    switch (animation) {
      case "fade-up":
      case "fade-down":
      case "fade-left":
      case "fade-right":
        return "translate-x-0 translate-y-0 opacity-100";
      case "zoom-in":
      case "pop-in":
        return "scale-100 translate-y-0 opacity-100";
      case "fade":
      default:
        return "opacity-100";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-out will-change-transform ${
        isRevealed ? getRevealedTransform() : getInitialTransform()
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
