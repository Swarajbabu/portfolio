/**
 * ==============================================================================
 * ADMIN TAB: AboutTab
 * ==============================================================================
 * Purpose:
 *   Manage About bio summary and the key highlights list items.
 * ==============================================================================
 */

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { TabProps } from "../types";

export const AboutTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-neo-secondary border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
        <h2 className="font-black text-xl uppercase tracking-tight text-black">About Section</h2>
      </div>

      <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
        <label className="block font-black text-xs uppercase tracking-widest mb-2 text-black">Bio Text</label>
        <textarea
          rows={4}
          value={formData.about.bio}
          onChange={(e) => setFormData({ ...formData, about: { ...formData.about, bio: e.target.value } })}
          className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
        />
      </div>

      <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000] space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-black text-xs uppercase tracking-widest text-black">Highlights List</label>
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                about: { ...formData.about, highlights: [...formData.about.highlights, "New Highlight"] },
              })
            }
            className="border-2 border-black bg-neo-accent px-3 py-1 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Highlight
          </button>
        </div>
        <div className="space-y-3">
          {formData.about.highlights.map((h, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={h}
                onChange={(e) => {
                  const updated = [...formData.about.highlights];
                  updated[idx] = e.target.value;
                  setFormData({ ...formData, about: { ...formData.about, highlights: updated } });
                }}
                className="flex-1 border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.about.highlights.filter((_, i) => i !== idx);
                  setFormData({ ...formData, about: { ...formData.about, highlights: updated } });
                }}
                className="border-2 border-black bg-red-400 p-2 neo-btn-press shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                title="Delete highlight"
              >
                <Trash2 className="h-4 w-4 text-black" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
