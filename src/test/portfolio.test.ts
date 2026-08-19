import { describe, it, expect } from "vitest";
import { portfolioData } from "@/data/portfolio";

describe("Portfolio Data Structure", () => {
  it("contains complete personal details and social links", () => {
    expect(portfolioData.personal.name).toBe("Swaraj Vecha");
    expect(portfolioData.personal.email).toBe("swarajvecha@gmail.com");
    expect(portfolioData.personal.socials).toBeDefined();
    expect(portfolioData.personal.socials.github).toContain("github.com");
    expect(portfolioData.personal.socials.linkedin).toContain("linkedin.com");
  });

  it("contains structured projects with required categories and valid tags", () => {
    expect(portfolioData.projects.cards.length).toBeGreaterThan(0);
    portfolioData.projects.cards.forEach((card) => {
      expect(card.name).toBeTruthy();
      expect(card.category).toBeTruthy();
      expect(card.description).toBeTruthy();
      expect(Array.isArray(card.tags)).toBe(true);
      expect(Array.isArray(card.links)).toBe(true);
    });
  });

  it("contains categorized skills", () => {
    expect(portfolioData.skills.groups.length).toBeGreaterThan(0);
    portfolioData.skills.groups.forEach((group) => {
      expect(group.heading).toBeTruthy();
      expect(group.items.length).toBeGreaterThan(0);
    });
  });

  it("has valid contact details", () => {
    expect(portfolioData.contact.title).toBeTruthy();
    expect(portfolioData.contact.fields).toContain("Name");
    expect(portfolioData.contact.fields).toContain("Email");
    expect(portfolioData.contact.fields).toContain("Message");
  });
});
