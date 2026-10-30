/**
 * ==============================================================================
 * ADMIN COMPONENT: AdminTabsNav
 * ==============================================================================
 * Purpose:
 *   Horizontal scrollable tab navigation switcher for admin dashboard.
 * ==============================================================================
 */

import React from "react";
import { AdminTabType } from "./types";

interface AdminTabsNavProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
}

const TABS: { id: AdminTabType; label: string }[] = [
  { id: "personal", label: "Personal" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certs", label: "Certifications" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
  { id: "analytics", label: "📊 Analytics" },
];

export const AdminTabsNav: React.FC<AdminTabsNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1.5 sm:pb-0 sm:flex-wrap -mx-1 px-1 sm:mx-0 sm:px-0">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 border-2 border-black px-3.5 py-2 sm:px-5 sm:py-2.5 font-black text-xs uppercase tracking-widest whitespace-nowrap neo-btn-press transition-all cursor-pointer ${
              isActive
                ? "bg-neo-accent shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] text-black -translate-y-0.5 sm:-translate-y-1"
                : "bg-white hover:bg-neo-secondary shadow-[2px_2px_0px_0px_#000] text-black"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default AdminTabsNav;
