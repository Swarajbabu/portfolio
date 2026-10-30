/**
 * ==============================================================================
 * ADMIN TAB: PersonalTab
 * ==============================================================================
 * Purpose:
 *   Manage personal bio data, avatar photo upload, CV/Resume PDF upload,
 *   contact handles, and hero headlines & subheadlines.
 * ==============================================================================
 */

import React from "react";
import { Upload, FileText } from "lucide-react";
import { TabProps } from "../types";
import { getApiUrl } from "@/lib/api";

export const PersonalTab: React.FC<TabProps> = ({
  formData,
  setFormData,
  handleImageUpload,
  showToast,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
        <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
          Personal & Hero Details
        </h2>
      </div>

      {/* Hero Profile Photo Uploader */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <label className="block font-black text-sm uppercase tracking-wider text-black">
          Hero Profile Photo (Cartoon / Avatar Image)
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative border-3 border-black bg-[#FFFDF5] p-2 shadow-[4px_4px_0px_0px_#000] flex-shrink-0">
            <img
              src={formData.personal.avatar || "/assets/swaraj-hero.jpg"}
              alt="Hero Avatar"
              className="w-24 h-28 object-cover object-top border-2 border-black"
            />
          </div>
          <div className="flex-1 w-full space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={formData.personal.avatar || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personal: { ...formData.personal, avatar: e.target.value },
                  })
                }
                placeholder="Paste image URL or click upload..."
                className="flex-1 border-2 border-black bg-[#F7F4EA] px-3.5 py-2.5 font-bold text-xs sm:text-sm text-black focus:bg-yellow-100 focus:outline-none"
              />
              <label className="border-2 border-black bg-neo-accent hover:bg-red-400 px-4 py-2.5 font-black text-xs uppercase tracking-wider text-black cursor-pointer neo-btn-press shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1.5 whitespace-nowrap">
                <Upload className="h-4 w-4" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0] && handleImageUpload) {
                      handleImageUpload(e.target.files[0], (url) => {
                        setFormData({
                          ...formData,
                          personal: { ...formData.personal, avatar: url },
                        });
                      });
                    }
                  }}
                />
              </label>
            </div>
            <p className="text-[11px] font-bold text-black/60">
              Upload directly to Cloudinary CDN or paste any image URL. Updates your main portfolio hero photo immediately.
            </p>
          </div>
        </div>
      </div>

      {/* CV / Resume Upload */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <label className="block font-black text-sm uppercase tracking-wider text-black flex items-center gap-2">
          <FileText className="h-5 w-5" strokeWidth={3} />
          CV / Resume (PDF)
        </label>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-1 w-full space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={formData.personal.resumeUrl || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personal: { ...formData.personal, resumeUrl: e.target.value },
                  })
                }
                placeholder="Paste CV URL or upload a PDF file..."
                className="flex-1 border-2 border-black bg-[#F7F4EA] px-3.5 py-2.5 font-bold text-xs sm:text-sm text-black focus:bg-yellow-100 focus:outline-none"
              />
              <label className="border-2 border-black bg-neo-secondary hover:bg-yellow-300 px-4 py-2.5 font-black text-xs uppercase tracking-wider text-black cursor-pointer neo-btn-press shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1.5 whitespace-nowrap">
                <Upload className="h-4 w-4" />
                <span>Upload PDF</span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.type !== "application/pdf") {
                      showToast("Only PDF files are allowed for CV upload");
                      return;
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      showToast("PDF is too large (max 10MB)");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = async () => {
                      try {
                        const res = await fetch(getApiUrl("/api/upload-cv"), {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "x-admin-passcode": sessionStorage.getItem("admin_passcode") || "",
                          },
                          body: JSON.stringify({ file: reader.result }),
                        });
                        const json = await res.json();
                        if (json.success && json.url) {
                          setFormData({
                            ...formData,
                            personal: { ...formData.personal, resumeUrl: json.url },
                          });
                          showToast("CV uploaded successfully!");
                        } else {
                          showToast("CV upload failed: " + (json.error || "Error"));
                        }
                      } catch {
                        showToast("CV upload failed!");
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
            {formData.personal.resumeUrl && (
              <div className="flex items-center gap-3">
                <a
                  href={formData.personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-black bg-[#FAF8F5] hover:bg-yellow-100 px-3 py-1.5 font-black text-[10px] uppercase tracking-wider neo-btn-press shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 text-black"
                >
                  <FileText className="h-3 w-3" />
                  Preview Current CV
                </a>
                <span className="font-mono text-[10px] text-black/40 truncate max-w-[300px]">
                  {formData.personal.resumeUrl}
                </span>
              </div>
            )}
            <p className="text-[11px] font-bold text-black/60">
              Upload your CV/Resume as a PDF. It will be hosted on Cloudinary CDN and linked from the "Download CV" button on the hero section.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Text Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <label className="block font-black text-xs uppercase tracking-widest mb-2 text-black">Full Name</label>
          <input
            type="text"
            value={formData.personal.name}
            onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, name: e.target.value } })}
            className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
          />
        </div>
        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <label className="block font-black text-xs uppercase tracking-widest mb-2 text-black">Headline Role</label>
          <input
            type="text"
            value={formData.personal.role}
            onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, role: e.target.value } })}
            className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
          />
        </div>
        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <label className="block font-black text-xs uppercase tracking-widest mb-2 text-black">Email</label>
          <input
            type="text"
            value={formData.personal.email}
            onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, email: e.target.value } })}
            className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
          />
        </div>
        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <label className="block font-black text-xs uppercase tracking-widest mb-2 text-black">Phone</label>
          <input
            type="text"
            value={formData.personal.phone}
            onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, phone: e.target.value } })}
            className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
          />
        </div>
        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <label className="block font-black text-xs uppercase tracking-widest mb-2 text-black">LinkedIn URL</label>
          <input
            type="text"
            value={formData.personal.linkedin}
            onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, linkedin: e.target.value } })}
            className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
          />
        </div>
        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <label className="block font-black text-xs uppercase tracking-widest mb-2 text-black">GitHub URL</label>
          <input
            type="text"
            value={formData.personal.github}
            onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, github: e.target.value } })}
            className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
          />
        </div>
        <div className="md:col-span-2 border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <label className="block font-black text-xs uppercase tracking-widest mb-2 text-black">Hero Headline</label>
          <input
            type="text"
            value={formData.hero.headlineOne}
            onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, headlineOne: e.target.value } })}
            className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
          />
        </div>
        <div className="md:col-span-2 border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <label className="block font-black text-xs uppercase tracking-widest mb-2 text-black">Hero Subheadline</label>
          <textarea
            rows={3}
            value={formData.hero.subheadline}
            onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subheadline: e.target.value } })}
            className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalTab;
