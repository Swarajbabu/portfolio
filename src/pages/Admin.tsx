import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, RotateCcw, Download, Plus, Trash2, Lock, Unlock, CheckCircle, Upload, Image as ImageIcon } from "lucide-react";

const Admin = () => {
  const { data, updateData, resetData, exportJSON } = usePortfolio();
  
  // Security lock state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState("");
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<"personal" | "about" | "skills" | "projects" | "certs" | "education" | "contact">("personal");
  
  // Local editable copy of data
  const [formData, setFormData] = useState(data);
  const [toastMessage, setToastMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_passcode", passcode);
        setIsAuthenticated(true);
        setPassError("");
      } else {
        const json = await res.json().catch(() => ({}));
        setPassError(json.error === "Invalid passcode" ? "Invalid passcode." : (json.error || "Login failed."));
      }
    } catch (err) {
      setPassError("Could not reach the server to verify the passcode.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSave = () => {
    updateData(formData);
    showToast("Changes saved successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data back to original defaults?")) {
      resetData();
      setFormData(data);
      showToast("Data reset to defaults!");
    }
  };

  const handleImageUpload = async (file: File, onSuccess: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": sessionStorage.getItem("admin_passcode") || "",
          },
          body: JSON.stringify({ image: base64 }),
        });
        const json = await res.json();
        if (json.url) {
          onSuccess(json.url);
          showToast("Image uploaded successfully!");
        } else {
          showToast("Upload failed: " + (json.error || "Error"));
        }
      } catch (err) {
        console.error(err);
        showToast("Upload failed!");
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F4EA] flex items-center justify-center p-4">
        <div className="border-4 border-black bg-white p-8 max-w-md w-full shadow-[8px_8px_0px_0px_#000] text-center">
          <div className="border-2 border-black bg-neo-accent p-4 inline-block mb-6 rotate-3 shadow-[4px_4px_0px_0px_#000]">
            <Lock className="h-10 w-10 text-black" strokeWidth={3} />
          </div>
          <h1 className="font-black text-2xl uppercase tracking-tight mb-2 text-black">Admin Portal Lock</h1>
          <p className="font-bold text-xs uppercase tracking-widest text-black/70 mb-6">Enter passcode to access settings</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full border-2 border-black bg-[#FAF8F5] px-4 py-3 font-bold text-center text-lg text-black placeholder:text-black/40 focus:bg-yellow-100 focus:outline-none shadow-[3px_3px_0px_0px_#000]"
            />
            {passError && <p className="font-bold text-xs text-red-600 uppercase">{passError}</p>}
            <button
              type="submit"
              className="w-full border-2 border-black bg-neo-accent px-6 py-3 font-black text-base uppercase tracking-wide neo-btn-press flex items-center justify-center gap-2 text-black shadow-[4px_4px_0px_0px_#000]"
            >
              Unlock <Unlock className="h-5 w-5" strokeWidth={3} />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-black/20">
            <Link to="/" className="font-bold text-xs uppercase tracking-widest text-black/70 hover:text-black">
              ← Return to Main Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EA] p-4 sm:p-8 text-black">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 border-4 border-black bg-neo-secondary px-6 py-3 font-black text-sm uppercase tracking-wide shadow-[6px_6px_0px_0px_#000] flex items-center gap-2 animate-bounce">
          <CheckCircle className="h-5 w-5 text-black" strokeWidth={3} />
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <header className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link to="/" className="border-2 border-black bg-neo-accent p-2 shadow-[3px_3px_0px_0px_#000] neo-btn-press">
                <ArrowLeft className="h-5 w-5 text-black" strokeWidth={3} />
              </Link>
              <h1 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">Portfolio Admin Portal</h1>
            </div>
            <p className="font-bold text-xs uppercase tracking-widest text-black/70 mt-1">
              Dynamically edit main page text, skills, projects, & certs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              className="border-2 border-black bg-neo-accent px-5 py-2.5 font-black text-sm uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center gap-2 text-black"
            >
              <Save className="h-4 w-4" strokeWidth={3} />
              Save Changes
            </button>
            <button
              onClick={handleReset}
              className="border-2 border-black bg-neo-muted px-4 py-2.5 font-black text-sm uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center gap-2 text-black"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={3} />
              Reset Defaults
            </button>
            <button
              onClick={exportJSON}
              className="border-2 border-black bg-neo-secondary px-4 py-2.5 font-black text-sm uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center gap-2 text-black"
            >
              <Download className="h-4 w-4" strokeWidth={3} />
              Export JSON
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {(["personal", "about", "skills", "projects", "certs", "education", "contact"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-2 border-black px-5 py-2.5 font-black text-xs uppercase tracking-widest neo-btn-press transition-all ${
                activeTab === tab ? "bg-neo-accent shadow-[4px_4px_0px_0px_#000] text-black -translate-y-1" : "bg-white hover:bg-neo-secondary shadow-[2px_2px_0px_0px_#000] text-black"
              }`}
            >
              {tab === "certs" ? "Certifications" : tab}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="border-4 border-black bg-[#FAF8F5] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000]">
          {/* TAB 1: PERSONAL & HERO */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
                <h2 className="font-black text-xl uppercase tracking-tight text-black">Personal & Hero Details</h2>
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
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.personal.avatar || ""}
                        onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, avatar: e.target.value } })}
                        placeholder="Paste image URL or click upload..."
                        className="flex-1 border-2 border-black bg-[#F7F4EA] px-3.5 py-2.5 font-bold text-xs sm:text-sm text-black focus:bg-yellow-100 focus:outline-none"
                      />
                      <label className="border-2 border-black bg-neo-accent hover:bg-red-400 px-4 py-2.5 font-black text-xs uppercase tracking-wider text-black cursor-pointer neo-btn-press shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5 whitespace-nowrap">
                        <Upload className="h-4 w-4" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
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
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === "about" && (
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
                    onClick={() => setFormData({ ...formData, about: { ...formData.about, highlights: [...formData.about.highlights, "New Highlight"] } })}
                    className="border-2 border-black bg-neo-accent px-3 py-1 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000]"
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
                        className="border-2 border-black bg-red-400 p-2 neo-btn-press shadow-[2px_2px_0px_0px_#000]"
                      >
                        <Trash2 className="h-4 w-4 text-black" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="bg-neo-muted border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
                <h2 className="font-black text-xl uppercase tracking-tight text-black">Skills Categories</h2>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, skills: { ...formData.skills, groups: [...formData.skills.groups, { heading: "New Group", items: ["Skill 1", "Skill 2"] }] } })}
                  className="border-2 border-black bg-neo-accent px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000]"
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
                        className="border-2 border-black bg-red-400 p-2 neo-btn-press shadow-[2px_2px_0px_0px_#000]"
                      >
                        <Trash2 className="h-4 w-4 text-black" />
                      </button>
                    </div>

                    <div>
                      <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Items (comma separated)</label>
                      <input
                        type="text"
                        value={group.items.join(", ")}
                        onChange={(e) => {
                          const updated = [...formData.skills.groups];
                          updated[groupIdx].items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          setFormData({ ...formData, skills: { ...formData.skills, groups: updated } });
                        }}
                        className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
                <h2 className="font-black text-xl uppercase tracking-tight text-black">Projects</h2>
                <button
                  type="button"
                  onClick={() => setFormData({
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
                          links: [{ label: "GitHub", url: "https://github.com/Swarajbabu" }],
                          image: formData.projects.cards[0]?.image || "",
                          impactPoints: ["Feature impact point 1", "Feature impact point 2"]
                        }
                      ]
                    }
                  })}
                  className="border-2 border-black bg-white px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000]"
                >
                  <Plus className="h-4 w-4" /> Add Project
                </button>
              </div>

              <div className="space-y-6">
                {formData.projects.cards.map((project, pIdx) => (
                  <div key={pIdx} className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
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
                        className="border-2 border-black bg-red-400 p-2 neo-btn-press shadow-[2px_2px_0px_0px_#000] self-end sm:self-auto"
                      >
                        <Trash2 className="h-4 w-4 text-black" />
                      </button>
                    </div>

                    <div>
                      <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Description</label>
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
                      <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Tags (comma separated)</label>
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
                        <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">GitHub Repository URL</label>
                        <input
                          type="text"
                          value={project.links?.find((l: any) => l.label?.toLowerCase().includes("github"))?.url || project.links?.[0]?.url || ""}
                          placeholder="https://github.com/username/repo"
                          onChange={(e) => {
                            const updated = [...formData.projects.cards];
                            const deployUrl = updated[pIdx].links?.find((l: any) => l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo"))?.url || updated[pIdx].links?.[1]?.url || "";
                            updated[pIdx].links = [
                              { label: "GitHub Code", url: e.target.value },
                              ...(deployUrl ? [{ label: "Live Demo", url: deployUrl }] : [])
                            ];
                            setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                          }}
                          className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Live Deployment URL (Optional)</label>
                        <input
                          type="text"
                          value={project.links?.find((l: any) => l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo"))?.url || (project.links?.[1]?.url && !project.links[1].url.includes("github.com") ? project.links[1].url : "")}
                          placeholder="https://your-app.vercel.app (or leave empty)"
                          onChange={(e) => {
                            const updated = [...formData.projects.cards];
                            const githubUrl = updated[pIdx].links?.find((l: any) => l.label?.toLowerCase().includes("github"))?.url || updated[pIdx].links?.[0]?.url || "";
                            updated[pIdx].links = [
                              ...(githubUrl ? [{ label: "GitHub Code", url: githubUrl }] : []),
                              ...(e.target.value.trim() ? [{ label: "Live Demo", url: e.target.value.trim() }] : [])
                            ];
                            setFormData({ ...formData, projects: { ...formData.projects, cards: updated } });
                          }}
                          className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-medium text-sm text-black focus:bg-yellow-100 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Project Preview Image (URL / Cloudinary)</label>
                      <div className="flex items-center gap-3">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.name}
                            className="h-12 w-20 object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000]"
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
                        <label className="border-2 border-black bg-neo-secondary hover:bg-yellow-300 px-3 py-2 font-black text-xs uppercase tracking-wider text-black cursor-pointer neo-btn-press shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 whitespace-nowrap">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
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
          )}

          {/* TAB 5: CERTIFICATIONS */}
          {activeTab === "certs" && (
            <div className="space-y-6">
              <div className="bg-neo-secondary border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
                <h2 className="font-black text-xl uppercase tracking-tight text-black">Certifications & Achievements</h2>
                <button
                  type="button"
                  onClick={() => setFormData({
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
                          bullets: ["Certification detail point 1"]
                        }
                      ]
                    }
                  })}
                  className="border-2 border-black bg-neo-accent px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000]"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              </div>

              <div className="space-y-6">
                {formData.experience.items.map((item, cIdx) => (
                  <div key={cIdx} className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
                    <div className="flex items-center gap-3">
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
                        className="w-28 border-2 border-black bg-neo-accent px-3 py-2 font-bold text-xs text-center uppercase text-black"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.experience.items.filter((_, i) => i !== cIdx);
                          setFormData({ ...formData, experience: { ...formData.experience, items: updated } });
                        }}
                        className="border-2 border-black bg-red-400 p-2 neo-btn-press shadow-[2px_2px_0px_0px_#000]"
                      >
                        <Trash2 className="h-4 w-4 text-black" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Organization / Platform</label>
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
                        <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Certificate / Link URL</label>
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
                      <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Certificate Image / Badge (URL / Cloudinary)</label>
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.role}
                            className="h-10 w-16 object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000]"
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
                        <label className="border-2 border-black bg-neo-accent hover:bg-red-400 px-3 py-2 font-black text-xs uppercase tracking-wider text-black cursor-pointer neo-btn-press shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 whitespace-nowrap">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
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
          )}

          {/* TAB 6: EDUCATION */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="bg-neo-muted border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
                <h2 className="font-black text-xl uppercase tracking-tight text-black">Education</h2>
              </div>
              <div className="space-y-6">
                {formData.education.entries.map((entry, edIdx) => (
                  <div key={edIdx} className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Degree / Qualification</label>
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
                        <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Period</label>
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
                        <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Institution / Organization</label>
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
                        <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Details (CGPA / Stream)</label>
                        <input
                          type="text"
                          value={entry.details.join(" | ")}
                          onChange={(e) => {
                            const updated = [...formData.education.entries];
                            updated[edIdx].details = e.target.value.split("|").map((s) => s.trim()).filter(Boolean);
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
          )}

          {/* TAB 7: CONTACT & SOCIALS */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
                <h2 className="font-black text-xl uppercase tracking-tight text-black">Direct Contacts & Social Profiles</h2>
              </div>

              {/* Direct Contact Details */}
              <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
                <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2">
                  Contact Information (Shown on Cards)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Email Address</label>
                    <input
                      type="email"
                      value={formData.personal.email || ""}
                      onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, email: e.target.value } })}
                      placeholder="your.email@gmail.com"
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Mobile / Phone Number</label>
                    <input
                      type="text"
                      value={formData.personal.phone || ""}
                      onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, phone: e.target.value } })}
                      placeholder="+91-9642985278"
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Location / Country</label>
                    <input
                      type="text"
                      value={formData.personal.location || ""}
                      onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, location: e.target.value } })}
                      placeholder="India"
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Social Profiles & Developer Links */}
              <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
                <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2">
                  Social & Coding Platform Profiles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={formData.personal.linkedin || formData.personal.socials?.linkedin || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          linkedin: e.target.value,
                          socials: { ...formData.personal.socials, linkedin: e.target.value }
                        }
                      })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={formData.personal.github || formData.personal.socials?.github || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          github: e.target.value,
                          socials: { ...formData.personal.socials, github: e.target.value }
                        }
                      })}
                      placeholder="https://github.com/username"
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">LeetCode Profile URL</label>
                    <input
                      type="text"
                      value={formData.personal.socials?.leetcode || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          socials: { ...formData.personal.socials, leetcode: e.target.value }
                        }
                      })}
                      placeholder="https://leetcode.com/username"
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">CodeChef Profile URL</label>
                    <input
                      type="text"
                      value={formData.personal.socials?.codechef || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          socials: { ...formData.personal.socials, codechef: e.target.value }
                        }
                      })}
                      placeholder="https://codechef.com/users/username"
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">HackerRank Profile URL</label>
                    <input
                      type="text"
                      value={formData.personal.socials?.hackerrank || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          socials: { ...formData.personal.socials, hackerrank: e.target.value }
                        }
                      })}
                      placeholder="https://hackerrank.com/username"
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Free Email Form Delivery Settings */}
              <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black/10 pb-2">
                  <h3 className="font-black text-sm uppercase tracking-widest text-black">
                    Free Form Email Delivery (Receive in Gmail)
                  </h3>
                  <span className="neo-border bg-neo-accent px-2 py-0.5 font-black text-[10px] uppercase tracking-wider text-black">
                    Free & Instant
                  </span>
                </div>
                
                <div className="bg-[#FFFDF5] border-2 border-black p-3.5 space-y-2">
                  <p className="text-xs font-bold text-black/80">
                    💡 <strong>Option A (Formspree)</strong>: Create a free form at <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="underline font-black text-blue-700">formspree.io</a> and paste your Form ID (e.g. <code className="bg-yellow-200 px-1 border border-black">xdoqwpqr</code>) or full URL.
                  </p>
                  <p className="text-xs font-bold text-black/80">
                    💡 <strong>Option B (Web3Forms)</strong>: Get a free instant Access Key at <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="underline font-black text-blue-700">web3forms.com</a> (sent directly to your Gmail with 0 setup).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                      Formspree Form ID or URL
                    </label>
                    <input
                      type="text"
                      value={formData.contact.formspreeId || formData.contact.formspreeUrl || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        contact: {
                          ...formData.contact,
                          formspreeId: e.target.value.includes("/") ? "" : e.target.value,
                          formspreeUrl: e.target.value.includes("/") ? e.target.value : ""
                        }
                      })}
                      placeholder="e.g. xvgzpkqw or https://formspree.io/f/xvgzpkqw"
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
                      Web3Forms Access Key
                    </label>
                    <input
                      type="text"
                      value={formData.contact.web3FormsKey || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        contact: { ...formData.contact, web3FormsKey: e.target.value }
                      })}
                      placeholder="e.g. 1a2b3c4d-5e6f-7g8h-9i0j..."
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section Copy & Footer Note */}
              <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
                <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2">
                  Section Copy & Footer Settings
                </h3>
                <div>
                  <label className="block font-black text-xs uppercase tracking-widest mb-1 text-black">Contact Subheadline Copy</label>
                  <textarea
                    rows={2}
                    value={formData.contact.copy}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, copy: e.target.value } })}
                    className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-xs uppercase tracking-widest mb-1 text-black">Form Button Label</label>
                    <input
                      type="text"
                      value={formData.contact.submitLabel || "Send Message"}
                      onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, submitLabel: e.target.value } })}
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-xs uppercase tracking-widest mb-1 text-black">Footer Copyright Note</label>
                    <input
                      type="text"
                      value={formData.footer?.note || ""}
                      onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, note: e.target.value } })}
                      placeholder="© 2026 Swaraj Vecha • All rights reserved."
                      className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
