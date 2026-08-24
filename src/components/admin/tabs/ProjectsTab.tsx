/**
 * ==============================================================================
 * ADMIN TAB: ProjectsTab
 * ==============================================================================
 * Purpose:
 *   Manage projects cards, ordering (1st, 2nd, 3rd...), category, year, description,
 *   tags, GitHub URL, Live demo deployment URL, and preview image upload.
 * ==============================================================================
 */

import React from "react";
import { Plus, Trash2, Upload, ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { TabProps } from "../types";

export const ProjectsTab: React.FC<TabProps> = ({
  formData,
  setFormData,
  handleImageUpload,
}) => {
  const handleAddProject = () => {
    setFormData({
      ...formData,
      projects: {
        ...formData.projects,
        cards: [
          ...formData.projects.cards,
          {
            name: "New Project",
            category: "Full Stack",
            year: "2026",
            description: "Project description goes here.",
            tags: ["React", "Node.js"],
            links: [{ label: "GitHub Code", url: "https://github.com/Swarajbabu" }],
            image: formData.projects.cards[0]?.image || "",
            impactPoints: ["Feature impact point 1", "Feature impact point 2"],
          },
        ],
      },
    });
  };

  const moveProject = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= formData.projects.cards.length) return;
    const updated = [...formData.projects.cards];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
  };

  return (
    <div className="space-y-6">
      <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
            Projects Management
          </h2>
          <p className="font-bold text-xs text-black/70 mt-0.5">
            Use the ▲ and ▼ buttons to set project display order (1st, 2nd, 3rd...).
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="border-2 border-black bg-white px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto cursor-pointer hover:bg-yellow-100"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      <div className="space-y-6">
        {formData.projects.cards.map((project, pIdx) => (
          <div key={pIdx} className="border-4 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
            
            {/* Top Order & Action Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b-2 border-black/10 gap-2">
              <div className="flex items-center gap-2">
                <span className="border-2 border-black bg-black text-white px-3 py-1 font-mono font-black text-xs shadow-[2px_2px_0px_0px_#FF6B6B]">
                  PROJECT #{pIdx + 1 < 10 ? `0${pIdx + 1}` : pIdx + 1} {pIdx === 0 ? "(1st / Main)" : pIdx === 1 ? "(2nd)" : pIdx === 2 ? "(3rd)" : ""}
                </span>
                <span className="text-xs font-bold text-black/60 hidden sm:inline">
                  Position in Showcase
                </span>
              </div>

              {/* Move Up / Move Down & Delete Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border-2 border-black bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#000]">
                  <button
                    type="button"
                    disabled={pIdx === 0}
                    onClick={() => moveProject(pIdx, pIdx - 1)}
                    title="Move Up (Appear Earlier)"
                    className={`px-2.5 py-1 font-black text-xs uppercase flex items-center gap-1 border-r-2 border-black transition-colors ${
                      pIdx === 0 ? "opacity-30 cursor-not-allowed bg-gray-200" : "hover:bg-yellow-200 cursor-pointer"
                    }`}
                  >
                    <ArrowUp className="h-3.5 w-3.5" /> Move Up
                  </button>
                  <button
                    type="button"
                    disabled={pIdx === formData.projects.cards.length - 1}
                    onClick={() => moveProject(pIdx, pIdx + 1)}
                    title="Move Down (Appear Later)"
                    className={`px-2.5 py-1 font-black text-xs uppercase flex items-center gap-1 transition-colors ${
                      pIdx === formData.projects.cards.length - 1 ? "opacity-30 cursor-not-allowed bg-gray-200" : "hover:bg-yellow-200 cursor-pointer"
                    }`}
                  >
                    <ArrowDown className="h-3.5 w-3.5" /> Move Down
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = formData.projects.cards.filter((_, i) => i !== pIdx);
                    setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                  }}
                  className="border-2 border-black bg-red-400 p-1.5 neo-btn-press shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-red-500"
                  title="Delete project"
                >
                  <Trash2 className="h-4 w-4 text-black" />
                </button>
              </div>
            </div>

            {/* Project Details Fields */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Project Title
                </label>
                <input
                  type="text"
                  value={project.name}
                  placeholder="Project Title"
                  onChange={(e) => {
                    const updated = [...formData.projects.cards];
                    updated[pIdx].name = e.target.value;
                    setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-black text-base uppercase text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-56">
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={project.category || ""}
                  placeholder="Category (e.g. AI & Full Stack)"
                  onChange={(e) => {
                    const updated = [...formData.projects.cards];
                    updated[pIdx].category = e.target.value;
                    setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-3 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-28">
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Year
                </label>
                <input
                  type="text"
                  value={project.year}
                  placeholder="Year"
                  onChange={(e) => {
                    const updated = [...formData.projects.cards];
                    updated[pIdx].year = e.target.value;
                    setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                  }}
                  className="w-full border-2 border-black bg-neo-secondary px-3 py-2 font-black text-sm text-center text-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                Description (Punchy summary for recruiters)
              </label>
              <textarea
                rows={2}
                value={project.description}
                onChange={(e) => {
                  const updated = [...formData.projects.cards];
                  updated[pIdx].description = e.target.value;
                  setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                }}
                className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                Tags / Technologies (comma separated)
              </label>
              <input
                type="text"
                value={project.tags.join(", ")}
                onChange={(e) => {
                  const updated = [...formData.projects.cards];
                  updated[pIdx].tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                  setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                }}
                className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={
                    project.links?.find((l: { label: string; url: string }) => l.label?.toLowerCase().includes("github"))?.url ||
                    project.links?.[0]?.url ||
                    ""
                  }
                  onChange={(e) => {
                    const updated = [...formData.projects.cards];
                    const existingLinks = updated[pIdx].links || [];
                    const ghIndex = existingLinks.findIndex((l: { label: string }) => l.label?.toLowerCase().includes("github"));
                    if (ghIndex >= 0) {
                      existingLinks[ghIndex].url = e.target.value;
                    } else {
                      existingLinks.unshift({ label: "GitHub Code", url: e.target.value });
                    }
                    updated[pIdx].links = existingLinks;
                    setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Live Demo / Deployment URL
                </label>
                <input
                  type="text"
                  value={
                    project.links?.find((l: { label: string; url: string }) => l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo"))?.url ||
                    project.links?.[1]?.url ||
                    ""
                  }
                  onChange={(e) => {
                    const updated = [...formData.projects.cards];
                    const existingLinks = updated[pIdx].links || [];
                    const liveIndex = existingLinks.findIndex((l: { label: string }) => l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo"));
                    if (liveIndex >= 0) {
                      existingLinks[liveIndex].url = e.target.value;
                    } else {
                      existingLinks.push({ label: "Live Demo", url: e.target.value });
                    }
                    updated[pIdx].links = existingLinks;
                    setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Impact Highlights */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                Architectural Highlights / Milestones (1 per line)
              </label>
              <textarea
                rows={2}
                value={(project.impactPoints || []).join("\n")}
                onChange={(e) => {
                  const updated = [...formData.projects.cards];
                  updated[pIdx].impactPoints = e.target.value.split("\n").filter((s) => s.trim() !== "");
                  setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                }}
                className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
              />
            </div>

            {/* Image Preview & Upload */}
            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-2 text-black">
                Project Banner Image
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-32 h-20 object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                  />
                )}
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={project.image}
                    placeholder="Image URL or upload below"
                    onChange={(e) => {
                      const updated = [...formData.projects.cards];
                      updated[pIdx].image = e.target.value;
                      setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                    }}
                    className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                  />
                  <label className="cursor-pointer border-2 border-black bg-neo-secondary px-3 py-1.5 font-black text-xs uppercase neo-btn-press inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]">
                    <Upload className="h-3.5 w-3.5" /> Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (url) => {
                            const updated = [...formData.projects.cards];
                            updated[pIdx].image = url;
                            setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
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

export default ProjectsTab;
