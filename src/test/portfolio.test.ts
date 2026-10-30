import { describe, it, expect } from "vitest";
import type { PortfolioData } from "@/core/types/portfolio";

describe("Portfolio Database Document Contract", () => {
  const samplePortfolio: PortfolioData = {
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
      subheadline: "Engineering scalable digital platforms, AI/ML models, and cloud infrastructure.",
      typingCycle: ["AI / ML Systems", "Full Stack Apps"],
      primaryCta: "View Projects",
      secondaryCta: "Download CV",
    },
    about: {
      title: "About",
      bio: "Passionate AI/ML & Full Stack Engineer",
      highlights: ["Education: B.Tech CSE"],
    },
    skills: {
      title: "Skills",
      groups: [{ heading: "AI & ML", items: ["Python", "TensorFlow"] }],
    },
    projects: {
      title: "Projects",
      cards: [
        {
          name: "TradeX",
          category: "FinTech",
          year: "2026",
          description: "Trading platform",
          tags: ["React", "Node.js"],
          links: [{ label: "Code", url: "https://github.com" }],
          image: "",
          impactPoints: ["Real-time streaming"],
        },
      ],
    },
    education: {
      title: "Education",
      entries: [
        {
          period: "2023-2027",
          degree: "B.Tech CSE",
          org: "Lovely Professional University",
          details: ["CGPA: 7.42"],
        },
      ],
    },
    experience: {
      title: "Certifications",
      items: [
        {
          role: "OCI AI Foundations Associate",
          org: "Oracle",
          period: "2026",
          url: "https://github.com",
          image: "",
          bullets: ["AI foundations"],
        },
      ],
    },
    contact: {
      title: "Contact",
      copy: "Reach out for opportunities",
      formspreeId: "xdenyeaj",
      formspreeUrl: "https://formspree.io/f/xdenyeaj",
      web3FormsKey: "",
      fields: ["Name", "Email", "Message"],
      submitLabel: "Send Message",
      altContacts: [{ label: "Email", value: "swarajvecha@gmail.com" }],
    },
    footer: {
      note: "© Swaraj Vecha",
    },
  };

  it("contains complete personal details and social links", () => {
    expect(samplePortfolio.personal.name).toBe("Swaraj Vecha");
    expect(samplePortfolio.personal.email).toBe("swarajvecha@gmail.com");
    expect(samplePortfolio.personal.socials).toBeDefined();
    expect(samplePortfolio.personal.socials.github).toContain("github.com");
    expect(samplePortfolio.personal.socials.linkedin).toContain("linkedin.com");
  });

  it("contains structured projects with required categories and valid tags", () => {
    expect(samplePortfolio.projects.cards.length).toBeGreaterThan(0);
    samplePortfolio.projects.cards.forEach((card) => {
      expect(card.name).toBeTruthy();
      expect(card.category).toBeTruthy();
      expect(card.description).toBeTruthy();
      expect(Array.isArray(card.tags)).toBe(true);
      expect(Array.isArray(card.links)).toBe(true);
    });
  });

  it("contains categorized skills", () => {
    expect(samplePortfolio.skills.groups.length).toBeGreaterThan(0);
    samplePortfolio.skills.groups.forEach((group) => {
      expect(group.heading).toBeTruthy();
      expect(group.items.length).toBeGreaterThan(0);
    });
  });

  it("has valid contact details", () => {
    expect(samplePortfolio.contact.title).toBeTruthy();
    expect(samplePortfolio.contact.fields).toContain("Name");
    expect(samplePortfolio.contact.fields).toContain("Email");
    expect(samplePortfolio.contact.fields).toContain("Message");
  });
});
