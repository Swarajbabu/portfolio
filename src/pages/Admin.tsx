/**
 * ==============================================================================
 * PAGE: Admin Portal (CMS & Visitor Analytics)
 * ==============================================================================
 * Purpose:
 *   Secure content management system allowing real-time edits to:
 *   - Personal Info, Avatar, Resume PDF, and Hero Headlines
 *   - About Bio and Highlights
 *   - Technical Arsenal & Skills Domains
 *   - Projects & Systems Portfolio
 *   - Certifications & Verified Credentials
 *   - Education Milestones & Coursework
 *   - Contact Forms, Email Gateways (Formspree/Web3Forms) & Socials
 *   - Live Visitor Analytics, 30-Day Activity Chart & Traffic Logs
 *
 * Architecture:
 *   This page coordinates security authentication, global state syncing with MongoDB,
 *   and renders modular components located in `@/components/admin`.
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { getApiUrl } from "@/lib/api";
import { CheckCircle } from "lucide-react";

import {
  AdminAuthLock,
  AdminPasskeyModal,
  AdminHeader,
  AdminTabsNav,
  PersonalTab,
  AboutTab,
  SkillsTab,
  ProjectsTab,
  CertificationsTab,
  EducationTab,
  ContactTab,
  AnalyticsTab,
  AdminTabType,
  AnalyticsData,
  ImageUploadCallback,
} from "@/components/admin";

export const Admin = () => {
  /* 1. PORTFOLIO DATA CONTEXT ---------------------------------------------- */
  const { data, updateData, resetData, exportJSON } = usePortfolio();

  /* 2. AUTHENTICATION & SECURITY STATE ------------------------------------- */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [passError, setPassError] = useState<string>("");
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [showPasskeyModal, setShowPasskeyModal] = useState<boolean>(false);

  /* 3. NAVIGATION & NOTIFICATIONS ------------------------------------------ */
  const [activeTab, setActiveTab] = useState<AdminTabType>("personal");
  const [toastMessage, setToastMessage] = useState<string>("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  /* 4. VISITOR ANALYTICS STATE --------------------------------------------- */
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
  const [analyticsError, setAnalyticsError] = useState<string>("");
  const [visitorPage, setVisitorPage] = useState<number>(1);

  /* 5. LOCAL EDITABLE FORM STATE ------------------------------------------- */
  const [formData, setFormData] = useState(data);

  // Sync formData when data is fetched from remote MongoDB
  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining > 0) {
      const timer = setTimeout(() => setLockoutRemaining(lockoutRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutRemaining]);

  /* 6. ANALYTICS ACTIONS --------------------------------------------------- */
  const fetchAnalytics = useCallback(async (page = 1) => {
    setAnalyticsLoading(true);
    setAnalyticsError("");
    try {
      const res = await fetch(getApiUrl(`/api/analytics/visitors?page=${page}&limit=15`), {
        headers: { "x-admin-passcode": sessionStorage.getItem("admin_passcode") || "" },
      });
      if (res.ok) {
        const json = await res.json();
        setAnalyticsData(json);
        setVisitorPage(page);
      } else {
        setAnalyticsError("Failed to load analytics data.");
      }
    } catch {
      setAnalyticsError("Network error while loading analytics.");
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const deleteVisitor = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/analytics/visitors/${id}`), {
        method: "DELETE",
        headers: { "x-admin-passcode": sessionStorage.getItem("admin_passcode") || "" },
      });
      if (res.ok) {
        showToast("Visitor record deleted");
        fetchAnalytics(visitorPage);
      }
    } catch {
      showToast("Failed to delete visitor");
    }
  };

  const clearAllVisitors = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL visitor logs? This cannot be undone.")) return;
    try {
      const res = await fetch(getApiUrl("/api/analytics/visitors"), {
        method: "DELETE",
        headers: { "x-admin-passcode": sessionStorage.getItem("admin_passcode") || "" },
      });
      if (res.ok) {
        const json = await res.json();
        showToast(json.message || "All visitor logs cleared");
        setVisitorPage(1);
        fetchAnalytics(1);
      }
    } catch {
      showToast("Failed to clear visitor logs");
    }
  };

  // Auto-fetch analytics when switching to the analytics tab
  useEffect(() => {
    if (activeTab === "analytics" && isAuthenticated && !analyticsData) {
      fetchAnalytics();
    }
  }, [activeTab, isAuthenticated, analyticsData, fetchAnalytics]);

  /* 7. CMS SAVE, RESET & UPLOAD HANDLERS ----------------------------------- */
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    try {
      const res = await fetch(getApiUrl("/api/admin/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        sessionStorage.setItem("admin_passcode", passcode);
        setIsAuthenticated(true);
        setPassError("");
        setLockoutRemaining(0);
      } else {
        if (json.locked && json.remainingMs) {
          const seconds = Math.ceil(json.remainingMs / 1000);
          setLockoutRemaining(seconds);
          setPassError(json.error || "Too many failed attempts. You are locked out for 15 minutes.");
        } else {
          setPassError(json.error || "Login failed.");
        }
      }
    } catch {
      setPassError("Could not reach the server to verify the passcode.");
    }
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

  const handleImageUpload = async (file: File, onSuccess: ImageUploadCallback) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch(getApiUrl("/api/upload"), {
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
      } catch {
        showToast("Upload failed!");
      }
    };
    reader.readAsDataURL(file);
  };

  /* 8. RENDER: LOCKED STATE ------------------------------------------------ */
  if (!isAuthenticated) {
    return (
      <>
        <AdminPasskeyModal
          isOpen={showPasskeyModal}
          onClose={() => setShowPasskeyModal(false)}
          onSuccess={(msg) => showToast(msg)}
        />
        <AdminAuthLock
          passcode={passcode}
          setPasscode={setPasscode}
          passError={passError}
          lockoutRemaining={lockoutRemaining}
          handleLogin={handleLogin}
          onOpenPasskeyModal={() => setShowPasskeyModal(true)}
        />
      </>
    );
  }

  /* 9. RENDER: AUTHENTICATED CMS DASHBOARD --------------------------------- */
  return (
    <div className="min-h-screen bg-[#F7F4EA] p-4 sm:p-8 text-black">
      {/* Passkey Change / OTP Reset Modal */}
      <AdminPasskeyModal
        isOpen={showPasskeyModal}
        onClose={() => setShowPasskeyModal(false)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 border-4 border-black bg-neo-secondary px-6 py-3 font-black text-sm uppercase tracking-wide shadow-[6px_6px_0px_0px_#000] flex items-center gap-2 animate-bounce">
          <CheckCircle className="h-5 w-5 text-black" strokeWidth={3} />
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <AdminHeader
          onOpenPasskeyModal={() => setShowPasskeyModal(true)}
          onSave={handleSave}
          onReset={handleReset}
          onExport={exportJSON}
        />

        {/* Tab Navigation Switcher */}
        <AdminTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Active Tab Panel */}
        <main className="border-4 border-black bg-[#FAF8F5] p-4 sm:p-8 shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000]">
          {activeTab === "personal" && (
            <PersonalTab
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
              showToast={showToast}
            />
          )}

          {activeTab === "about" && (
            <AboutTab
              formData={formData}
              setFormData={setFormData}
              showToast={showToast}
            />
          )}

          {activeTab === "skills" && (
            <SkillsTab
              formData={formData}
              setFormData={setFormData}
              showToast={showToast}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsTab
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
              showToast={showToast}
            />
          )}

          {activeTab === "certs" && (
            <CertificationsTab
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
              showToast={showToast}
            />
          )}

          {activeTab === "education" && (
            <EducationTab
              formData={formData}
              setFormData={setFormData}
              showToast={showToast}
            />
          )}

          {activeTab === "contact" && (
            <ContactTab
              formData={formData}
              setFormData={setFormData}
              showToast={showToast}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab
              analyticsData={analyticsData}
              analyticsLoading={analyticsLoading}
              analyticsError={analyticsError}
              visitorPage={visitorPage}
              fetchAnalytics={fetchAnalytics}
              deleteVisitor={deleteVisitor}
              clearAllVisitors={clearAllVisitors}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
