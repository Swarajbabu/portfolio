/**
 * ==============================================================================
 * ADMIN TAB: SkillsTab
 * ==============================================================================
 * Purpose:
 *   Manage technical skill domains, category headings, and comma-separated skill items.
 * ==============================================================================
 */

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { TabProps } from "../types";

export const SkillsTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-neo-muted border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
          Skills Categories
        </h2>
        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              skills: {
                ...formData.skills,
                groups: [
                  ...formData.skills.groups,
                  { heading: "New Group", items: ["Skill 1", "Skill 2"] },
                ],
              },
            })
          }
          className="border-2 border-black bg-neo-accent px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Skill Category
        </button>
      </div>

      <div className="space-y-6">
        {formData.skills.groups.map((group, groupIdx) => (
          <div key={groupIdx} className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={group.heading}
                onChange={(e) => {
                  const updated = [...formData.skills.groups];
                  updated[groupIdx].heading = e.target.value;
                  setFormData({ ...formData, skills: { ...formData.skills, groups: updated } });
                }}
                className="flex-1 border-2 border-black bg-neo-accent px-4 py-2 font-black text-base uppercase text-black"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.skills.groups.filter((_, i) => i !== groupIdx);
                  setFormData({ ...formData, skills: { ...formData.skills, groups: updated } });
                }}
                className="border-2 border-black bg-red-400 p-2 neo-btn-press shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                title="Delete skill category"
              >
                <Trash2 className="h-4 w-4 text-black" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                Items (comma separated)
              </label>
              <input
                type="text"
                value={group.items.join(", ")}
                onChange={(e) => {
                  const updated = [...formData.skills.groups];
                  updated[groupIdx].items = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  setFormData({ ...formData, skills: { ...formData.skills, groups: updated } });
                }}
                className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsTab;
