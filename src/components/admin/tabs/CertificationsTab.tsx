/**
 * ==============================================================================
 * ADMIN TAB: CertificationsTab
 * ==============================================================================
 * Purpose:
 *   Manage certifications & credentials ordering (1st, 2nd, 3rd...), issuer org,
 *   period, bullet takeaways, credential verification link, and certificate image upload.
 * ==============================================================================
 */

import React from "react";
import { Plus, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { TabProps } from "../types";

export const CertificationsTab: React.FC<TabProps> = ({
  formData,
  setFormData,
  handleImageUpload,
}) => {
  const handleAddItem = () => {
    setFormData({
      ...formData,
      experience: {
        ...formData.experience,
        items: [
          ...formData.experience.items,
          {
            role: "New Certification",
            org: "Issuing Organization",
            period: "2026",
            url: "https://github.com/Swarajbabu",
            image: formData.experience.items[0]?.image || "",
            bullets: ["Certification detail point 1"],
          },
        ],
      },
    });
  };

  const moveCert = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= formData.experience.items.length) return;
    const updated = [...formData.experience.items];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
  };

  return (
    <div className="space-y-6">
      <div className="bg-neo-secondary border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
            Certifications & Credentials
          </h2>
          <p className="font-bold text-xs text-black/70 mt-0.5">
            Use ▲ and ▼ to order which certificates appear 1st, 2nd, 3rd on the portfolio.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="border-2 border-black bg-neo-accent px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto cursor-pointer hover:bg-red-400"
        >
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      <div className="space-y-6">
        {formData.experience.items.map((item, cIdx) => (
          <div key={cIdx} className="border-4 border-black bg-white p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
            
            {/* Top Order & Action Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b-2 border-black/10 gap-2">
              <div className="flex items-center gap-2">
                <span className="border-2 border-black bg-black text-white px-3 py-1 font-mono font-black text-xs shadow-[2px_2px_0px_0px_#FFD93D]">
                  CERTIFICATE #{cIdx + 1 < 10 ? `0${cIdx + 1}` : cIdx + 1} {cIdx === 0 ? "(1st)" : cIdx === 1 ? "(2nd)" : cIdx === 2 ? "(3rd)" : ""}
                </span>
                <span className="text-xs font-bold text-black/60 hidden sm:inline">
                  Position in FlipCards
                </span>
              </div>

              {/* Move Up / Move Down & Delete Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border-2 border-black bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#000]">
                  <button
                    type="button"
                    disabled={cIdx === 0}
                    onClick={() => moveCert(cIdx, cIdx - 1)}
                    title="Move Up (Appear Earlier)"
                    className={`px-2.5 py-1 font-black text-xs uppercase flex items-center gap-1 border-r-2 border-black transition-colors ${
                      cIdx === 0 ? "opacity-30 cursor-not-allowed bg-gray-200" : "hover:bg-yellow-200 cursor-pointer"
                    }`}
                  >
                    <ArrowUp className="h-3.5 w-3.5" /> Move Up
                  </button>
                  <button
                    type="button"
                    disabled={cIdx === formData.experience.items.length - 1}
                    onClick={() => moveCert(cIdx, cIdx + 1)}
                    title="Move Down (Appear Later)"
                    className={`px-2.5 py-1 font-black text-xs uppercase flex items-center gap-1 transition-colors ${
                      cIdx === formData.experience.items.length - 1 ? "opacity-30 cursor-not-allowed bg-gray-200" : "hover:bg-yellow-200 cursor-pointer"
                    }`}
                  >
                    <ArrowDown className="h-3.5 w-3.5" /> Move Down
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = formData.experience.items.filter((_, i) => i !== cIdx);
                    setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                  }}
                  className="border-2 border-black bg-red-400 p-1.5 neo-btn-press shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-red-500"
                  title="Delete certificate"
                >
                  <Trash2 className="h-4 w-4 text-black" />
                </button>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <div className="flex-1">
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Certification Title
                </label>
                <input
                  type="text"
                  value={item.role}
                  onChange={(e) => {
                    const updated = [...formData.experience.items];
                    updated[cIdx].role = e.target.value;
                    setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-black text-base uppercase text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-28">
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Year / Period
                </label>
                <input
                  type="text"
                  value={item.period}
                  onChange={(e) => {
                    const updated = [...formData.experience.items];
                    updated[cIdx].period = e.target.value;
                    setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                  }}
                  className="w-full border-2 border-black bg-neo-accent px-3 py-2 font-bold text-xs text-center uppercase text-black focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Issuing Organization / Platform
                </label>
                <input
                  type="text"
                  value={item.org}
                  onChange={(e) => {
                    const updated = [...formData.experience.items];
                    updated[cIdx].org = e.target.value;
                    setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Verification / Credential Link URL
                </label>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => {
                    const updated = [...formData.experience.items];
                    updated[cIdx].url = e.target.value;
                    setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                Bullet Points (1 per line)
              </label>
              <textarea
                rows={2}
                value={(item.bullets || []).join("\n")}
                onChange={(e) => {
                  const updated = [...formData.experience.items];
                  updated[cIdx].bullets = e.target.value.split("\n").filter((s) => s.trim() !== "");
                  setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                }}
                className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
              />
            </div>

            {/* Certificate Preview Image */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-2 text-black">
                Certificate Preview Image
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.role}
                    className="w-32 h-20 object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                  />
                )}
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={item.image}
                    placeholder="Image URL or upload certificate below"
                    onChange={(e) => {
                      const updated = [...formData.experience.items];
                      updated[cIdx].image = e.target.value;
                      setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                    }}
                    className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                  />
                  <label className="cursor-pointer border-2 border-black bg-neo-accent px-3 py-1.5 font-black text-xs uppercase neo-btn-press inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] hover:bg-red-400">
                    <Upload className="h-3.5 w-3.5" /> Upload Certificate
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (url) => {
                            const updated = [...formData.experience.items];
                            updated[cIdx].image = url;
                            setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                          });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsTab;
