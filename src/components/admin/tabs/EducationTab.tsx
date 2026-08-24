/**
 * ==============================================================================
 * ADMIN TAB: EducationTab
 * ==============================================================================
 * Purpose:
 *   Manage education entries, degrees, periods, institutions, and CGPA/details.
 * ==============================================================================
 */

import React from "react";
import { TabProps } from "../types";

export const EducationTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-neo-muted border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
        <h2 className="font-black text-xl uppercase tracking-tight text-black">Education</h2>
      </div>
      <div className="space-y-6">
        {formData.education.entries.map((entry, edIdx) => (
          <div key={edIdx} className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Degree / Qualification
                </label>
                <input
                  type="text"
                  value={entry.degree}
                  onChange={(e) => {
                    const updated = [...formData.education.entries];
                    updated[edIdx].degree = e.target.value;
                    setFormData({ ...formData, education: { ...formData.education, entries: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Period
                </label>
                <input
                  type="text"
                  value={entry.period}
                  onChange={(e) => {
                    const updated = [...formData.education.entries];
                    updated[edIdx].period = e.target.value;
                    setFormData({ ...formData, education: { ...formData.education, entries: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Institution / Organization
                </label>
                <input
                  type="text"
                  value={entry.org}
                  onChange={(e) => {
                    const updated = [...formData.education.entries];
                    updated[edIdx].org = e.target.value;
                    setFormData({ ...formData, education: { ...formData.education, entries: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Details (CGPA / Stream)
                </label>
                <input
                  type="text"
                  value={entry.details.join(" | ")}
                  onChange={(e) => {
                    const updated = [...formData.education.entries];
                    updated[edIdx].details = e.target.value
                      .split("|")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setFormData({ ...formData, education: { ...formData.education, entries: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationTab;
