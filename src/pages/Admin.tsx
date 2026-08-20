import React, { useState, useEffect, useCallback } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  Lock,
  Unlock,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  FileText,
  Key,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  AlertCircle,
  BarChart3,
  Globe,
  Monitor,
  Smartphone,
  Clock,
  CalendarDays,
  CalendarRange,
  Users,
  MapPin,
  Activity
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

const ADMIN_EMAIL = "swarajvecha@gmail.com";

const Admin = () => {
  const { data, updateData, resetData, exportJSON } = usePortfolio();
  
  // Security lock state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState("");
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<"personal" | "about" | "skills" | "projects" | "certs" | "education" | "contact" | "analytics">("personal");

  // Toast notification
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Analytics state
  interface VisitorRecord {
    _id: string;
    city: string;
    region: string;
    country: string;
    timezone: string;
    device: string;
    browser: string;
    referrer: string;
    page: string;
    visitedAt: string;
  }
  interface AnalyticsData {
    summary: { total: number; today: number; thisWeek: number; thisMonth: number };
    dailyCounts: { date: string; label: string; count: number }[];
    topLocations: { city: string; country: string; count: number }[];
    deviceBreakdown: { device: string; count: number }[];
    visitors: VisitorRecord[];
    pagination: { page: number; limit: number; totalPages: number; totalRecords: number };
  }
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");
  const [visitorPage, setVisitorPage] = useState(1);

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
    if (!confirm("⚠️ Are you sure you want to delete ALL visitor logs? This cannot be undone.")) return;
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

  // Auto-fetch analytics when tab is switched to analytics
  useEffect(() => {
    if (activeTab === "analytics" && isAuthenticated && !analyticsData) {
      fetchAnalytics();
    }
  }, [activeTab, isAuthenticated, analyticsData, fetchAnalytics]);
  
  // Local editable copy of data
  const [formData, setFormData] = useState(data);

  // Sync formData when data is loaded from MongoDB
  useEffect(() => {
    setFormData(data);
  }, [data]);


  // Passkey Change / OTP State
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [otpStep, setOtpStep] = useState<"idle" | "otp_sent" | "success">("idle");
  const [otpCode, setOtpCode] = useState("");
  const [newPasskey, setNewPasskey] = useState("");
  const [confirmPasskey, setConfirmPasskey] = useState("");
  const [showNewPasskey, setShowNewPasskey] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");

  // Cooldown countdown timer for OTP requests
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining > 0) {
      const timer = setTimeout(() => setLockoutRemaining(lockoutRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutRemaining]);

  const handleLogin = async (e: React.FormEvent) => {
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
    } catch (err) {
      setPassError("Could not reach the server to verify the passcode.");
    }
  };

  const handleRequestOtp = async () => {
    setOtpLoading(true);
    setOtpError("");
    setDevOtpHint("");
    try {
      const res = await fetch(getApiUrl("/api/admin/request-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (res.ok) {
        setOtpStep("otp_sent");
        setOtpSuccessMsg(json.message || `Verification OTP sent to ${ADMIN_EMAIL}`);
        setOtpCooldown(60);
        if (json.devOtp) {
          setDevOtpHint(json.devOtp);
        }
      } else {
        setOtpError(json.error || "Failed to send verification OTP.");
      }
    } catch (err) {
      setOtpError("Network error while communicating with authentication server.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleUpdatePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (!otpCode || otpCode.trim().length < 6) {
      setOtpError("Please enter the 6-digit verification code.");
      return;
    }
    if (!newPasskey || newPasskey.trim().length < 4) {
      setOtpError("New passkey must be at least 4 characters long.");
      return;
    }
    if (newPasskey !== confirmPasskey) {
      setOtpError("Passkeys do not match. Please verify.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/admin/change-passcode"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: otpCode.trim(),
          newPasscode: newPasskey.trim(),
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setOtpStep("success");
        setOtpSuccessMsg("Admin passkey updated successfully!");
        setPasscode(newPasskey.trim()); // Pre-fill login input
        sessionStorage.setItem("admin_passcode", newPasskey.trim());
        showToast("Passkey updated successfully!");
      } else {
        setOtpError(json.error || "Failed to update passkey. Check your OTP.");
      }
    } catch (err) {
      setOtpError("Server communication error.");
    } finally {
      setOtpLoading(false);
    }
  };

  const resetPasskeyModalState = () => {
    setShowPasskeyModal(false);
    setOtpStep("idle");
    setOtpCode("");
    setNewPasskey("");
    setConfirmPasskey("");
    setOtpError("");
    setOtpSuccessMsg("");
    setDevOtpHint("");
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
      } catch (err) {
        console.error(err);
        showToast("Upload failed!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Passkey Change / Reset Modal Component
  const renderPasskeyModal = () => {
    if (!showPasskeyModal) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="border-4 border-black bg-white p-6 sm:p-8 max-w-lg w-full shadow-[10px_10px_0px_0px_#000] relative animate-in fade-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={resetPasskeyModalState}
            className="absolute top-4 right-4 border-2 border-black bg-red-400 p-1.5 neo-btn-press shadow-[2px_2px_0px_0px_#000]"
          >
            <X className="h-4 w-4 text-black" strokeWidth={3} />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="border-2 border-black bg-[#FFD93D] p-2.5 shadow-[3px_3px_0px_0px_#000]">
              <Key className="h-6 w-6 text-black" strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-black text-xl uppercase tracking-tight text-black">
                Change Admin Passkey
              </h2>
              <p className="font-bold text-xs uppercase tracking-wider text-black/60">
                Email OTP Identity Verification
              </p>
            </div>
          </div>

          {/* Recipient Email Verification Banner */}
          <div className="border-2 border-black bg-[#FAF8F5] p-3.5 shadow-[3px_3px_0px_0px_#000] mb-5 flex items-center gap-3">
            <Mail className="h-5 w-5 text-black flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-black/60 uppercase block">Registered Security Email:</span>
              <span className="font-black text-black text-sm">{ADMIN_EMAIL}</span>
            </div>
          </div>

          {/* Notifications */}
          {otpError && (
            <div className="border-2 border-black bg-red-100 p-3 shadow-[2px_2px_0px_0px_#000] mb-4 flex items-center gap-2 text-xs font-bold text-red-900">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-700" />
              <span>{otpError}</span>
            </div>
          )}

          {otpSuccessMsg && (
            <div className="border-2 border-black bg-green-100 p-3 shadow-[2px_2px_0px_0px_#000] mb-4 flex items-center gap-2 text-xs font-bold text-green-900">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-700" />
              <span>{otpSuccessMsg}</span>
            </div>
          )}

          {devOtpHint && (
            <div className="border-2 border-dashed border-black bg-yellow-100 p-2.5 text-xs font-black text-black mb-4">
              🧪 DEV OTP HINT: <span className="underline tracking-widest">{devOtpHint}</span> (Logged in server console)
            </div>
          )}

          {/* STEP 1: Request OTP State */}
          {otpStep === "idle" && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-black/80 leading-relaxed">
                Click below to generate a secure 6-digit OTP. The verification code will be dispatched to <strong>{ADMIN_EMAIL}</strong> to authorize your passkey change.
              </p>

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={otpLoading}
                className="w-full border-2 border-black bg-neo-secondary hover:bg-yellow-300 px-6 py-3 font-black text-sm uppercase tracking-wider neo-btn-press flex items-center justify-center gap-2 text-black shadow-[4px_4px_0px_0px_#000] disabled:opacity-60"
              >
                {otpLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Sending Verification Code...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" strokeWidth={3} /> Send 6-Digit OTP Code
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2: Enter OTP & New Passkey */}
          {otpStep === "otp_sent" && (
            <form onSubmit={handleUpdatePasskey} className="space-y-4">
              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-1 text-black">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 849201"
                  className="w-full border-2 border-black bg-[#FAF8F5] px-4 py-2.5 font-mono font-black text-center text-xl text-black tracking-[6px] placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-black/30 focus:bg-yellow-100 focus:outline-none shadow-[3px_3px_0px_0px_#000]"
                />
              </div>

              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-1 text-black">
                  New Master Passkey
                </label>
                <div className="relative">
                  <input
                    type={showNewPasskey ? "text" : "password"}
                    value={newPasskey}
                    onChange={(e) => setNewPasskey(e.target.value)}
                    placeholder="Enter new passkey"
                    className="w-full border-2 border-black bg-[#FAF8F5] px-4 py-2.5 font-bold text-sm text-black placeholder:text-black/30 focus:bg-yellow-100 focus:outline-none shadow-[3px_3px_0px_0px_#000]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPasskey(!showNewPasskey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                  >
                    {showNewPasskey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-1 text-black">
                  Confirm New Passkey
                </label>
                <input
                  type="password"
                  value={confirmPasskey}
                  onChange={(e) => setConfirmPasskey(e.target.value)}
                  placeholder="Repeat new passkey"
                  className="w-full border-2 border-black bg-[#FAF8F5] px-4 py-2.5 font-bold text-sm text-black placeholder:text-black/30 focus:bg-yellow-100 focus:outline-none shadow-[3px_3px_0px_0px_#000]"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full border-2 border-black bg-neo-accent hover:bg-red-400 px-6 py-3 font-black text-sm uppercase tracking-wider neo-btn-press flex items-center justify-center gap-2 text-black shadow-[4px_4px_0px_0px_#000] disabled:opacity-60"
                >
                  {otpLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Verifying & Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" strokeWidth={3} /> Verify OTP & Update Passkey
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpCooldown > 0 || otpLoading}
                  className="text-xs font-bold uppercase tracking-wider text-black/70 hover:text-black py-1 disabled:opacity-50"
                >
                  {otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : "Resend OTP Code"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success State */}
          {otpStep === "success" && (
            <div className="text-center space-y-4">
              <div className="border-2 border-black bg-green-300 p-3 inline-block shadow-[3px_3px_0px_0px_#000]">
                <CheckCircle className="h-8 w-8 text-black" strokeWidth={3} />
              </div>
              <p className="text-sm font-bold text-black">
                Your admin passkey was updated and is immediately active across the system.
              </p>
              <button
                type="button"
                onClick={resetPasskeyModalState}
                className="w-full border-2 border-black bg-neo-secondary px-6 py-2.5 font-black text-xs uppercase tracking-wider neo-btn-press text-black shadow-[3px_3px_0px_0px_#000]"
              >
                Done & Return
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F4EA] flex items-center justify-center p-4">
        {renderPasskeyModal()}

        <div className="border-4 border-black bg-white p-5 sm:p-8 max-w-md w-full shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] text-center">
          <div className="border-2 border-black bg-neo-accent p-3 sm:p-4 inline-block mb-4 sm:mb-6 rotate-3 shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]">
            <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-black" strokeWidth={3} />
          </div>
          <h1 className="font-black text-xl sm:text-2xl uppercase tracking-tight mb-1 text-black">Admin Portal Lock</h1>
          <p className="font-bold text-[11px] sm:text-xs uppercase tracking-widest text-black/70 mb-5 sm:mb-6">Enter passkey to access CMS settings</p>
          
          {lockoutRemaining > 0 ? (
            <div className="space-y-4">
              <div className="border-3 border-black bg-red-100 p-4 shadow-[4px_4px_0px_0px_#000] text-left">
                <div className="flex items-center gap-2 text-red-900 font-black text-xs uppercase tracking-wider mb-1">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Access Temporarily Blocked</span>
                </div>
                <p className="font-bold text-xs text-red-800">
                  Too many failed attempts (3/3). Login is blocked for 15 minutes to protect this portfolio.
                </p>
                <div className="mt-3 border-2 border-black bg-black text-white p-2 text-center font-mono font-black text-xl tracking-widest shadow-[2px_2px_0px_0px_#FF6B6B]">
                  ⏳ {Math.floor(lockoutRemaining / 60)}:{(lockoutRemaining % 60).toString().padStart(2, "0")}
                </div>
              </div>
              <p className="text-[11px] font-bold text-black/60">
                Are you the admin? You can still reset your passkey using email OTP verification below.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter passkey (default: swaraj2026)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full border-2 border-black bg-[#FAF8F5] px-4 py-3 font-bold text-center text-lg text-black placeholder:text-black/40 focus:bg-yellow-100 focus:outline-none shadow-[3px_3px_0px_0px_#000]"
              />
              {passError && (
                <div className="border-2 border-black bg-red-50 p-2.5 shadow-[2px_2px_0px_0px_#000] text-red-700 font-bold text-xs">
                  {passError}
                </div>
              )}
              <button
                type="submit"
                className="w-full border-2 border-black bg-neo-accent px-6 py-3 font-black text-base uppercase tracking-wide neo-btn-press flex items-center justify-center gap-2 text-black shadow-[4px_4px_0px_0px_#000]"
              >
                Unlock <Unlock className="h-5 w-5" strokeWidth={3} />
              </button>
            </form>
          )}

          {/* Change / Reset Passkey Action Button */}
          <div className="mt-4 pt-4 border-t-2 border-black/15 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowPasskeyModal(true)}
              className="border-2 border-black bg-neo-secondary hover:bg-yellow-300 px-4 py-2 font-black text-xs uppercase tracking-wider neo-btn-press flex items-center justify-center gap-1.5 text-black shadow-[3px_3px_0px_0px_#000]"
            >
              <Key className="h-3.5 w-3.5" strokeWidth={3} /> Change Passkey / Reset via OTP
            </button>

            <Link to="/" className="font-bold text-xs uppercase tracking-widest text-black/60 hover:text-black mt-2">
              ← Return to Main Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EA] p-4 sm:p-8 text-black">
      {renderPasskeyModal()}

      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 border-4 border-black bg-neo-secondary px-6 py-3 font-black text-sm uppercase tracking-wide shadow-[6px_6px_0px_0px_#000] flex items-center gap-2 animate-bounce">
          <CheckCircle className="h-5 w-5 text-black" strokeWidth={3} />
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <header className="border-4 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link to="/" className="border-2 border-black bg-neo-accent p-2 shadow-[3px_3px_0px_0px_#000] neo-btn-press flex-shrink-0">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-black" strokeWidth={3} />
              </Link>
              <h1 className="font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-black">Portfolio Admin Portal</h1>
            </div>
            <p className="font-bold text-[11px] sm:text-xs uppercase tracking-widest text-black/70 mt-1">
              Dynamically edit main page text, skills, projects, & certs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowPasskeyModal(true)}
              className="w-full sm:w-auto border-2 border-black bg-[#FAF8F5] hover:bg-yellow-200 px-3 py-2 sm:px-4 sm:py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center justify-center gap-1.5 sm:gap-2 text-black"
            >
              <Key className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
              <span>Passkey</span>
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto border-2 border-black bg-neo-accent px-3 py-2 sm:px-5 sm:py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center justify-center gap-1.5 sm:gap-2 text-black"
            >
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
              <span>Save</span>
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto border-2 border-black bg-neo-muted px-3 py-2 sm:px-4 sm:py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center justify-center gap-1.5 sm:gap-2 text-black"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
              <span>Reset</span>
            </button>
            <button
              onClick={exportJSON}
              className="w-full sm:w-auto border-2 border-black bg-neo-secondary px-3 py-2 sm:px-4 sm:py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center justify-center gap-1.5 sm:gap-2 text-black"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
              <span>Export</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1.5 sm:pb-0 sm:flex-wrap -mx-1 px-1 sm:mx-0 sm:px-0">
          {(["personal", "about", "skills", "projects", "certs", "education", "contact", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 border-2 border-black px-3.5 py-2 sm:px-5 sm:py-2.5 font-black text-xs uppercase tracking-widest whitespace-nowrap neo-btn-press transition-all ${
                activeTab === tab ? "bg-neo-accent shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] text-black -translate-y-0.5 sm:-translate-y-1" : "bg-white hover:bg-neo-secondary shadow-[2px_2px_0px_0px_#000] text-black"
              }`}
            >
              {tab === "certs" ? "Certifications" : tab === "analytics" ? "📊 Analytics" : tab}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="border-4 border-black bg-[#FAF8F5] p-4 sm:p-8 shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000]">
          {/* TAB 1: PERSONAL & HERO */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
                <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">Personal & Hero Details</h2>
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
                        onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, avatar: e.target.value } })}
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
                        onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, resumeUrl: e.target.value } })}
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
              <div className="bg-neo-muted border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">Skills Categories</h2>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, skills: { ...formData.skills, groups: [...formData.skills.groups, { heading: "New Group", items: ["Skill 1", "Skill 2"] }] } })}
                  className="border-2 border-black bg-neo-accent px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto"
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
              <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">Projects</h2>
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
                  className="border-2 border-black bg-white px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto"
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
                          value={project.links?.find((l: { label: string; url: string }) => l.label?.toLowerCase().includes("github"))?.url || project.links?.[0]?.url || ""}
                          placeholder="https://github.com/username/repo"
                          onChange={(e) => {
                            const updated = [...formData.projects.cards];
                            const deployUrl = updated[pIdx].links?.find((l: { label: string; url: string }) => l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo"))?.url || updated[pIdx].links?.[1]?.url || "";
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
                          value={project.links?.find((l: { label: string; url: string }) => l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("demo"))?.url || (project.links?.[1]?.url && !project.links[1].url.includes("github.com") ? project.links[1].url : "")}
                          placeholder="https://your-app.vercel.app (or leave empty)"
                          onChange={(e) => {
                            const updated = [...formData.projects.cards];
                            const githubUrl = updated[pIdx].links?.find((l: { label: string; url: string }) => l.label?.toLowerCase().includes("github"))?.url || updated[pIdx].links?.[0]?.url || "";
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
              <div className="bg-neo-secondary border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">Certifications & Achievements</h2>
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
                  className="border-2 border-black bg-neo-accent px-4 py-1.5 font-black text-xs uppercase neo-btn-press flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto"
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
                        className="border-2 border-black bg-red-400 p-2 neo-btn-press shadow-[2px_2px_0px_0px_#000] self-end sm:self-auto"
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

          {/* TAB 8: VISITOR ANALYTICS DASHBOARD */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] w-full sm:w-auto">
                  <h2 className="font-black text-base sm:text-lg uppercase tracking-widest flex items-center gap-2 text-black">
                    <BarChart3 className="h-5 w-5" strokeWidth={3} />
                    Visitor Analytics Dashboard
                  </h2>
                </div>
                <button
                  onClick={() => fetchAnalytics(visitorPage)}
                  disabled={analyticsLoading}
                  className="border-2 border-black bg-neo-secondary hover:bg-yellow-300 px-4 py-2 sm:px-5 sm:py-2.5 font-black text-xs uppercase tracking-wider neo-btn-press shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2 text-black disabled:opacity-50 self-stretch sm:self-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${analyticsLoading ? "animate-spin" : ""}`} strokeWidth={3} />
                  {analyticsLoading ? "Loading..." : "Refresh Data"}
                </button>
              </div>

              {/* Error State */}
              {analyticsError && (
                <div className="border-2 border-black bg-red-100 p-4 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 text-sm font-bold text-red-900">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  {analyticsError}
                </div>
              )}

              {/* Loading State */}
              {analyticsLoading && !analyticsData && (
                <div className="border-4 border-black bg-white p-12 shadow-[6px_6px_0px_0px_#000] text-center">
                  <div className="h-8 w-8 rounded-full border-4 border-black border-t-transparent animate-spin mx-auto mb-4" />
                  <p className="font-black text-sm uppercase tracking-widest text-black/60">Loading visitor analytics...</p>
                </div>
              )}

              {/* Analytics Data */}
              {analyticsData && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Today", value: analyticsData.summary.today, icon: Clock, color: "bg-[#FF6B6B]" },
                      { label: "This Week", value: analyticsData.summary.thisWeek, icon: CalendarDays, color: "bg-[#FFD93D]" },
                      { label: "This Month", value: analyticsData.summary.thisMonth, icon: CalendarRange, color: "bg-[#6BCB77]" },
                      { label: "All Time", value: analyticsData.summary.total, icon: Users, color: "bg-[#4D96FF]" },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`${card.color} border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_#000]`}>
                            <card.icon className="h-4 w-4 text-black" strokeWidth={3} />
                          </div>
                          <span className="font-black text-[11px] uppercase tracking-widest text-black/60">{card.label}</span>
                        </div>
                        <div className="font-black text-3xl sm:text-4xl text-black tracking-tight">{card.value.toLocaleString()}</div>
                        <div className="font-bold text-[10px] uppercase tracking-wider text-black/40 mt-1">Visitors</div>
                      </div>
                    ))}
                  </div>

                  {/* 30-Day Bar Chart */}
                  <div className="border-4 border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000]">
                    <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2 mb-5 flex items-center gap-2">
                      <Activity className="h-4 w-4" strokeWidth={3} />
                      Last 30 Days — Daily Visitors
                    </h3>
                    <div className="flex items-end gap-[3px] sm:gap-1 h-40 sm:h-52">
                      {analyticsData.dailyCounts.map((day) => {
                        const maxCount = Math.max(...analyticsData.dailyCounts.map((d) => d.count), 1);
                        const heightPct = (day.count / maxCount) * 100;
                        const isToday = day.date === new Date().toISOString().split("T")[0];
                        return (
                          <div
                            key={day.date}
                            className="flex-1 flex flex-col items-center justify-end h-full group relative"
                          >
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 border-2 border-black bg-black text-white px-2 py-1 text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-[2px_2px_0px_0px_#FFD93D] pointer-events-none">
                              {day.label}: {day.count}
                            </div>
                            <div
                              className={`w-full border border-black/30 transition-all duration-300 ${isToday ? "bg-[#FF6B6B]" : "bg-[#FFD93D] group-hover:bg-[#FF6B6B]"}`}
                              style={{ height: `${Math.max(heightPct, 2)}%`, minHeight: "2px" }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] font-bold text-black/40 uppercase">
                      <span>{analyticsData.dailyCounts[0]?.label}</span>
                      <span>Today</span>
                    </div>
                  </div>

                  {/* Bottom Grid: Top Locations + Device Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Locations */}
                    <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000]">
                      <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2 mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4" strokeWidth={3} />
                        Top Locations
                      </h3>
                      {analyticsData.topLocations.length === 0 ? (
                        <p className="font-bold text-xs text-black/40 uppercase">No location data yet</p>
                      ) : (
                        <div className="space-y-3">
                          {analyticsData.topLocations.map((loc, i) => {
                            const maxLocCount = analyticsData.topLocations[0]?.count || 1;
                            const barWidth = (loc.count / maxLocCount) * 100;
                            return (
                              <div key={`${loc.city}-${loc.country}`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-black text-xs uppercase tracking-wider text-black flex items-center gap-2">
                                    <Globe className="h-3 w-3" />
                                    <span className="text-black/40">#{i + 1}</span>
                                    {loc.city}, {loc.country}
                                  </span>
                                  <span className="font-black text-xs text-black border border-black px-2 py-0.5 bg-[#FAF8F5]">
                                    {loc.count}
                                  </span>
                                </div>
                                <div className="h-2.5 bg-[#FAF8F5] border border-black/20">
                                  <div className="h-full bg-[#FFD93D] border-r border-black/30 transition-all duration-500" style={{ width: `${barWidth}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Device Breakdown */}
                    <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000]">
                      <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2 mb-4 flex items-center gap-2">
                        <Monitor className="h-4 w-4" strokeWidth={3} />
                        Device Breakdown
                      </h3>
                      {analyticsData.deviceBreakdown.length === 0 ? (
                        <p className="font-bold text-xs text-black/40 uppercase">No device data yet</p>
                      ) : (
                        <div className="space-y-4">
                          {analyticsData.deviceBreakdown.map((d) => {
                            const totalDevices = analyticsData.deviceBreakdown.reduce((s, x) => s + x.count, 0) || 1;
                            const pct = Math.round((d.count / totalDevices) * 100);
                            const DeviceIcon = d.device === "Mobile" ? Smartphone : Monitor;
                            const barColor = d.device === "Desktop" ? "bg-[#4D96FF]" : d.device === "Mobile" ? "bg-[#FF6B6B]" : "bg-[#6BCB77]";
                            return (
                              <div key={d.device}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-black text-xs uppercase tracking-wider text-black flex items-center gap-2">
                                    <DeviceIcon className="h-3.5 w-3.5" />
                                    {d.device}
                                  </span>
                                  <span className="font-black text-xs text-black">
                                    {d.count} ({pct}%)
                                  </span>
                                </div>
                                <div className="h-3 bg-[#FAF8F5] border border-black/20">
                                  <div className={`h-full ${barColor} border-r border-black/30 transition-all duration-500`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Visitors Table with Pagination & Delete */}
                  <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black/10 pb-3 mb-4">
                      <h3 className="font-black text-sm uppercase tracking-widest text-black flex items-center gap-2">
                        <Eye className="h-4 w-4" strokeWidth={3} />
                        Visitor Logs
                        {analyticsData.pagination && (
                          <span className="font-bold text-[10px] text-black/50 ml-1">
                            ({analyticsData.pagination.totalRecords} total)
                          </span>
                        )}
                      </h3>
                      <button
                        onClick={clearAllVisitors}
                        className="border-2 border-black bg-red-100 hover:bg-red-200 px-3 py-1.5 font-black text-[10px] uppercase tracking-wider neo-btn-press shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 text-red-900"
                      >
                        <Trash2 className="h-3 w-3" strokeWidth={3} />
                        Clear All Logs
                      </button>
                    </div>

                    {analyticsData.visitors.length === 0 ? (
                      <p className="font-bold text-xs text-black/40 uppercase text-center py-8">No visitors recorded yet. They'll appear here automatically!</p>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-black text-white">
                                <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Time</th>
                                <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Location</th>
                                <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Device</th>
                                <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Browser</th>
                                <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest">Page</th>
                                <th className="px-3 py-2 font-black text-[11px] uppercase tracking-widest w-10"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsData.visitors.map((v, i) => (
                                <tr key={v._id} className={`border-b border-black/10 ${i % 2 === 0 ? "bg-[#FAF8F5]" : "bg-white"} hover:bg-yellow-50 transition-colors group`}>
                                  <td className="px-3 py-2.5 font-bold text-xs text-black whitespace-nowrap">
                                    {new Date(v.visitedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true })}
                                  </td>
                                  <td className="px-3 py-2.5 font-bold text-xs text-black">
                                    {v.city !== "Unknown" ? `${v.city}, ${v.country}` : v.country !== "Unknown" ? v.country : "\u2014"}
                                  </td>
                                  <td className="px-3 py-2.5 text-xs">
                                    <span className={`border border-black px-2 py-0.5 font-black text-[10px] uppercase ${v.device === "Mobile" ? "bg-[#FF6B6B]/20" : "bg-[#4D96FF]/20"}`}>
                                      {v.device}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2.5 font-bold text-xs text-black/70">{v.browser}</td>
                                  <td className="px-3 py-2.5 font-mono text-xs text-black/50">{v.page || "/"}</td>
                                  <td className="px-2 py-2.5">
                                    <button
                                      onClick={() => deleteVisitor(v._id)}
                                      title="Delete this visitor record"
                                      className="opacity-0 group-hover:opacity-100 transition-opacity border border-black bg-red-100 hover:bg-red-300 p-1 neo-btn-press shadow-[1px_1px_0px_0px_#000]"
                                    >
                                      <Trash2 className="h-3 w-3 text-red-900" strokeWidth={3} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Controls */}
                        {analyticsData.pagination && analyticsData.pagination.totalPages > 1 && (
                          <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t-2 border-black/10">
                            <span className="font-black text-xs uppercase tracking-wider text-black/50">
                              Page {analyticsData.pagination.page} of {analyticsData.pagination.totalPages}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {/* Prev Button */}
                              <button
                                onClick={() => fetchAnalytics(visitorPage - 1)}
                                disabled={visitorPage <= 1}
                                className="border-2 border-black bg-white hover:bg-neo-secondary disabled:opacity-30 disabled:pointer-events-none px-3 py-1.5 font-black text-xs uppercase neo-btn-press shadow-[2px_2px_0px_0px_#000] text-black"
                              >
                                ← Prev
                              </button>

                              {/* Page Number Buttons */}
                              {Array.from({ length: analyticsData.pagination.totalPages }, (_, idx) => idx + 1)
                                .filter((p) => {
                                  // Show first, last, and pages near current
                                  return p === 1 || p === analyticsData.pagination.totalPages || Math.abs(p - visitorPage) <= 2;
                                })
                                .reduce<(number | string)[]>((acc, p, i, arr) => {
                                  if (i > 0 && typeof arr[i - 1] === "number" && (p as number) - (arr[i - 1] as number) > 1) {
                                    acc.push("...");
                                  }
                                  acc.push(p);
                                  return acc;
                                }, [])
                                .map((p, idx) =>
                                  typeof p === "string" ? (
                                    <span key={`ellipsis-${idx}`} className="font-black text-xs text-black/40 px-1">...</span>
                                  ) : (
                                    <button
                                      key={p}
                                      onClick={() => fetchAnalytics(p as number)}
                                      className={`h-8 w-8 border-2 border-black font-black text-xs flex items-center justify-center neo-btn-press transition-all ${
                                        visitorPage === p
                                          ? "bg-black text-white shadow-[2px_2px_0px_0px_#FF6B6B] -translate-y-0.5"
                                          : "bg-white text-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_#000]"
                                      }`}
                                    >
                                      {p}
                                    </button>
                                  )
                                )}

                              {/* Next Button */}
                              <button
                                onClick={() => fetchAnalytics(visitorPage + 1)}
                                disabled={visitorPage >= analyticsData.pagination.totalPages}
                                className="border-2 border-black bg-white hover:bg-neo-secondary disabled:opacity-30 disabled:pointer-events-none px-3 py-1.5 font-black text-xs uppercase neo-btn-press shadow-[2px_2px_0px_0px_#000] text-black"
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
