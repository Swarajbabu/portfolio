/**
 * ==============================================================================
 * LAYOUT COMPONENT: ScrollProgressBar
 * ==============================================================================
 * Purpose:
 *   Fixed reading progress bar positioned immediately below the navbar (top-16)
 *   that visually displays scroll percentage in neo-accent color.
 * ==============================================================================
 */

import { useState, useEffect } from "react";

export const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 h-1.5 z-40 bg-transparent pointer-events-none" aria-hidden="true">
      <div
        className="h-full bg-neo-accent border-b-2 border-black transition-all duration-75 ease-out shadow-[0px_2px_0px_0px_#000]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
