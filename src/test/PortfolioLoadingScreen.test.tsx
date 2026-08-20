import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import { PortfolioLoadingScreen } from "../components/PortfolioLoadingScreen";

describe("PortfolioLoadingScreen", () => {
  it("renders loading screen with initial stage and note", () => {
    render(<PortfolioLoadingScreen />);

    expect(screen.getByText(/SWARAJ VECHA • PORTFOLIO/i)).toBeDefined();
    expect(screen.getByText(/Connecting to Server/i)).toBeDefined();
    expect(screen.getByText(/Render's free backend sleeps when inactive/i)).toBeDefined();
  });

  it("updates elapsed time and shows skip button when elapsed time passes threshold", () => {
    vi.useFakeTimers();
    const handleSkip = vi.fn();

    render(<PortfolioLoadingScreen onSkip={handleSkip} />);

    expect(screen.queryByText(/Continue with local fallback data/i)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByText(/Continue with local fallback data/i)).toBeDefined();

    const skipButton = screen.getByText(/Continue with local fallback data/i);
    skipButton.click();
    expect(handleSkip).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
