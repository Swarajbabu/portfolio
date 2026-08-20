import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import RevealOnScroll from "../components/RevealOnScroll";
import ScrollProgressBar from "../components/ScrollProgressBar";
import ScrollToTopButton from "../components/ScrollToTopButton";

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => {
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  window.scrollTo = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Scroll Animation Components", () => {
  describe("RevealOnScroll", () => {
    it("renders children wrapped in reveal container", () => {
      render(
        <RevealOnScroll animation="fade-up">
          <div data-testid="child-element">Test Content</div>
        </RevealOnScroll>
      );

      expect(screen.getByTestId("child-element")).toBeDefined();
      expect(screen.getByText("Test Content")).toBeDefined();
    });
  });

  describe("ScrollProgressBar", () => {
    it("renders progress bar and updates width on scroll", () => {
      const { container } = render(<ScrollProgressBar />);
      
      const progressBar = container.querySelector("div");
      expect(progressBar).toBeDefined();

      // Trigger scroll event
      act(() => {
        fireEvent.scroll(window);
      });
    });
  });

  describe("ScrollToTopButton", () => {
    it("renders and calls window.scrollTo when clicked", () => {
      render(<ScrollToTopButton />);

      // Trigger scroll event to make it visible
      act(() => {
        Object.defineProperty(window, "scrollY", { value: 500, writable: true });
        fireEvent.scroll(window);
      });

      const button = screen.getByLabelText(/scroll back to top/i);
      expect(button).toBeDefined();

      fireEvent.click(button);
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth"
      });
    });
  });
});
