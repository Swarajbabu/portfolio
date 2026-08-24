/**
 * ==============================================================================
 * ADMIN TAB: ProjectsTab
 * ==============================================================================
 * Purpose:
 *   Manage projects cards, title, category, year, description, tags,
 *   GitHub URL, Live demo deployment URL, and preview image upload.
 * ==============================================================================
 */

import React from "react";
import { Plus, Trash2, Upload } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
          Projects
        </h2>
        <button
          type="button"
          onClick={handleAddProject}
          className="border-2 border-black bg-white px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      <div className="space-y-6">
        {formData.projects.cards.map((project, pIdx) => (
          <div key={pIdx} className="border-4 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={project.name}
                placeholder="Project Title"
                onChange={(e) => {
                  const updated = [...formData.projects.cards];
                  updated[pIdx].name = e.target.value;
                  setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                }}
                className="flex-1 border-2 border-black bg-[#F7F4EA] px-4 py-2 font-black text-lg uppercase text-black"
              />
              <input
                type="text"
                value={project.category || ""}
                placeholder="Category (e.g. AI & Full Stack)"
                onChange={(e) => {
                  const updated = [...formData.projects.cards];
                  updated[pIdx].category = e.target.value;
                  setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                }}
                className="w-full sm:w-56 border-2 border-black bg-[#F7F4EA] px-3 py-2 font-bold text-sm text-black"
              />
              <input
                type="text"
                value={project.year}
                placeholder="Year"
                onChange={(e) => {
                  const updated = [...formData.projects.cards];
                  updated[pIdx].year = e.target.value;
                  setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                }}
                className="w-full sm:w-28 border-2 border-black bg-neo-secondary px-3 py-2 font-black text-sm text-center text-black"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.projects.cards.filter((_, i) => i !== pIdx);
                  setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                }}
                className="border-2 border-black bg-red-400 p-2 neo-btn-press shadow-[2px_2px_0px_0px_#000] self-end sm:self-auto cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="h-4 w-4 text-black" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                Description
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
                Tags (comma separated)
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
                  placeholder="https://github.com/username/repo"
                  onChange={(e) => {
                    const updated = [...formData.projects.cards];
                    const deployUrl =
                      updated[pIdx].links?.find(
                        (l: { label: string; url: string }) =>
                          l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo")
                      )?.url ||
                      updated[pIdx].links?.[1]?.url ||
                      "";
                    updated[pIdx].links = [
                      { label: "GitHub Code", url: e.target.value },
                      ...(deployUrl ? [{ label: "Live Demo", url: deployUrl }] : []),
                    ];
                    setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                  Live Deployment URL (Optional)
                </label>
                <input
                  type="text"
                  value={
                    project.links?.find(
                      (l: { label: string; url: string }) =>
                        l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo")
                    )?.url ||
                    (project.links?.[1]?.url && !project.links[1].url.includes("github.com") ? project.links[1].url : "")
                  }
                  placeholder="https://your-app.vercel.app (or leave empty)"
                  onChange={(e) => {
                    const updated = [...formData.projects.cards];
                    const githubUrl =
                      updated[pIdx].links?.find((l: { label: string; url: string }) => l.label?.toLowerCase().includes("github"))?.url ||
                      updated[pIdx].links?.[0]?.url ||
                      "";
                    updated[pIdx].links = [
                      ...(githubUrl ? [{ label: "GitHub Code", url: githubUrl }] : []),
                      ...(e.target.value.trim() ? [{ label: "Live Demo", url: e.target.value.trim() }] : []),
                    ];
                    setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                  }}
                  className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                Project Preview Image (URL / Cloudinary)
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 flex-1">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-10 sm:h-12 w-16 sm:w-20 object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000] flex-shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={project.image || ""}
                    onChange={(e) => {
                      const updated = [...formData.projects.cards];
                      updated[pIdx].image = e.target.value;
                      setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                    }}
                    placeholder="Paste image URL or upload file..."
                    className="flex-1 border-2 border-black bg-[#F7F4EA] px-3 py-2 font-bold text-xs text-black focus:bg-yellow-100 focus:outline-none"
                  />
                </div>
                <label className="border-2 border-black bg-neo-secondary hover:bg-yellow-300 px-4 py-2 font-black text-xs uppercase tracking-wider text-black cursor-pointer neo-btn-press shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1.5 whitespace-nowrap">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && handleImageUpload) {
                        handleImageUpload(file, (uploadedUrl) => {
                          const updated = [...formData.projects.cards];
                          updated[pIdx].image = uploadedUrl;
                          setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
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

export default ProjectsTab;
