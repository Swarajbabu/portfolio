import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { PortfolioProvider, usePortfolio } from "@/core/context/PortfolioContext";

const mockMongoPortfolio = {
  personal: {
    name: "Swaraj Vecha",
    role: "AI/ML & Full Stack Engineer",
    location: "Hyderabad, India",
    email: "swarajvecha@gmail.com",
    phone: "+91-9642985278",
    linkedin: "https://www.linkedin.com/in/laxmiswarajbabu",
    github: "https://github.com/Swarajbabu",
    instagram: "https://github.com/Swarajbabu",
    resumeUrl: "/Swaraj_Vecha_CV.pdf",
    avatar: "",
    socials: {
      linkedin: "https://www.linkedin.com/in/laxmiswarajbabu",
      github: "https://github.com/Swarajbabu",
      leetcode: "https://leetcode.com/u/swarajvecha/",
    },
  },
  hero: {
    headlineOne: "Swaraj Vecha",
    headlineTwo: "AI/ML & Full Stack Engineer",
    subheadline: "Engineering scalable digital platforms.",
    typingCycle: ["AI / ML Systems"],
    primaryCta: "View Projects",
    secondaryCta: "Download CV",
  },
};

describe("PortfolioContext", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("fetches and provides live MongoDB portfolio data to children", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: (h: string) => (h.toLowerCase() === "content-type" ? "application/json" : null),
      },
      json: async () => mockMongoPortfolio,
    } as unknown as Response);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PortfolioProvider>{children}</PortfolioProvider>
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.personal.name).toBe("Swaraj Vecha");
    expect(result.current.isMongoConnected).toBe(true);
    expect(typeof result.current.updateData).toBe("function");
    expect(typeof result.current.resetData).toBe("function");
    expect(typeof result.current.skipLoading).toBe("function");
  });

  it("allows skipping loading state via skipLoading", async () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {})); // pending

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
