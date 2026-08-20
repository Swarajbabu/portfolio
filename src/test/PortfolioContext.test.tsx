import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { PortfolioProvider, usePortfolio } from "../context/PortfolioContext";

describe("PortfolioContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response);
  });

  it("provides portfolio data to children", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PortfolioProvider>{children}</PortfolioProvider>
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    expect(result.current.data).toBeDefined();
    expect(result.current.data.personal.name).toBe("Swaraj Vecha");
    expect(typeof result.current.updateData).toBe("function");
    expect(typeof result.current.resetData).toBe("function");
    expect(typeof result.current.skipLoading).toBe("function");
  });

  it("allows skipping loading state via skipLoading", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PortfolioProvider>{children}</PortfolioProvider>
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    act(() => {
      result.current.skipLoading();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("throws an error when usePortfolio is called outside of PortfolioProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => usePortfolio())).toThrow(
      "usePortfolio must be used within a PortfolioProvider"
    );
    spy.mockRestore();
  });
});
