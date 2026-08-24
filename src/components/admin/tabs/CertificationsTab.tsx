/**
 * ==============================================================================
 * ADMIN TAB: CertificationsTab
 * ==============================================================================
 * Purpose:
 *   Manage certifications & credentials, issuer org, period, bullet takeaways,
 *   credential verification link, and certificate image upload.
 * ==============================================================================
 */

import React from "react";
import { Plus, Trash2, Upload } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="bg-neo-secondary border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
          Certifications & Achievements
        </h2>
        <button
          type="button"
          onClick={handleAddItem}
          className="border-2 border-black bg-neo-accent px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      <div className="space-y-6">
        {formData.experience.items.map((item, cIdx) => (
          <div key={cIdx} className="border-4 border-black bg-white p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <input
                type="text"
                value={item.role}
                onChange={(e) => {
                  const updated = [...formData.experience.items];
                  updated[cIdx].role = e.target.value;
                  setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                }}
                className="flex-1 border-2 border-black bg-[#F7F4EA] px-4 py-2 font-black text-base uppercase text-black"
              />
              <input
                type="text"
                value={item.period}
                onChange={(e) => {
                  const updated = [...formData.experience.items];
                  updated[cIdx].period = e.target.value;
                  setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                }}
                className="w-full sm:w-28 border-2 border-black bg-neo-accent px-3 py-2 font-bold text-xs text-center uppercase text-black"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.experience.items.filter((_, i) => i !== cIdx);
                  setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                }}
                className="border-2 border-black bg-red-400 p-2 neo-btn-press shadow-[2px_2px_0px_0px_#000] self-end sm:self-auto cursor-pointer"
                title="Delete certificate"
              >
                <Trash2 className="h-4 w-4 text-black" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Organization / Platform
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
                  Certificate / Link URL
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
                Certificate Image / Badge (URL / Cloudinary)
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 flex-1">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.role}
                      className="h-10 w-16 object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000] flex-shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={item.image || ""}
                    onChange={(e) => {
                      const updated = [...formData.experience.items];
                      updated[cIdx].image = e.target.value;
                      setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                    }}
                    placeholder="Paste certificate image URL or upload..."
                    className="flex-1 border-2 border-black bg-[#F7F4EA] px-3 py-2 font-bold text-xs text-black focus:bg-yellow-100 focus:outline-none"
                  />
                </div>
                <label className="border-2 border-black bg-neo-accent hover:bg-red-400 px-4 py-2 font-black text-xs uppercase tracking-wider text-black cursor-pointer neo-btn-press shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1.5 whitespace-nowrap">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && handleImageUpload) {
                        handleImageUpload(file, (uploadedUrl) => {
                          const updated = [...formData.experience.items];
                          updated[cIdx].image = uploadedUrl;
                          setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                        });
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsTab;
