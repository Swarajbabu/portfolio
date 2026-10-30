/**
 * ==============================================================================
 * ADMIN COMPONENT: AdminPasskeyModal
 * ==============================================================================
 * Purpose:
 *   Modal dialog for changing / resetting the master admin passkey via
 *   secure 6-digit Email OTP identity verification.
 * ==============================================================================
 */

import React, { useState, useEffect, FormEvent } from "react";
import {
  Key,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  X
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

const ADMIN_EMAIL = "swarajvecha@gmail.com";

interface AdminPasskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const AdminPasskeyModal: React.FC<AdminPasskeyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [otpStep, setOtpStep] = useState<"idle" | "otp_sent" | "success">("idle");
  const [otpCode, setOtpCode] = useState<string>("");
  const [newPasskey, setNewPasskey] = useState<string>("");
  const [confirmPasskey, setConfirmPasskey] = useState<string>("");
  const [showNewPasskey, setShowNewPasskey] = useState<boolean>(false);
  const [otpCooldown, setOtpCooldown] = useState<number>(0);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string>("");
  const [devOtpHint, setDevOtpHint] = useState<string>("");

  // Cooldown countdown timer for OTP requests
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const resetState = () => {
    setOtpStep("idle");
    setOtpCode("");
    setNewPasskey("");
    setConfirmPasskey("");
    setOtpError("");
    setOtpSuccessMsg("");
    setDevOtpHint("");
    onClose();
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
    } catch {
      setOtpError("Network error while communicating with authentication server.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleUpdatePasskey = async (e: FormEvent) => {
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
      setOtpError("New passkeys do not match.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/admin/verify-otp-update-passcode"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpCode.trim(), newPasscode: newPasskey.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        setOtpStep("success");
        sessionStorage.setItem("admin_passcode", newPasskey.trim());
        onSuccess("Passkey updated successfully!");
      } else {
        setOtpError(json.error || "Passkey update failed. Please verify the code.");
      }
    } catch {
      setOtpError("Network error while updating passkey.");
    } finally {
      setOtpLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="border-4 border-black bg-white p-6 sm:p-8 max-w-lg w-full shadow-[10px_10px_0px_0px_#000] relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={resetState}
          className="absolute top-4 right-4 border-2 border-black bg-red-400 p-1.5 neo-btn-press shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          aria-label="Close passkey modal"
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

        {/* Recipient Email Banner */}
        <div className="border-2 border-black bg-[#FAF8F5] p-3.5 shadow-[3px_3px_0px_0px_#000] mb-5 flex items-center gap-3">
          <Mail className="h-5 w-5 text-black flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-black/60 uppercase block">Registered Security Email:</span>
            <span className="font-black text-black text-sm">{ADMIN_EMAIL}</span>
          </div>
        </div>

        {/* Status Alerts */}
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
            🧪 DEV OTP HINT: <span className="underline tracking-widest">{devOtpHint}</span>
          </div>
        )}

        {/* STEP 1: Request OTP */}
        {otpStep === "idle" && (
          <div className="space-y-4">
            <p className="text-xs font-bold text-black/80 leading-relaxed">
              Click below to generate a secure 6-digit OTP. The verification code will be dispatched to <strong>{ADMIN_EMAIL}</strong> to authorize your passkey change.
            </p>

            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={otpLoading}
              className="w-full border-2 border-black bg-neo-secondary hover:bg-yellow-300 px-6 py-3 font-black text-sm uppercase tracking-wider neo-btn-press flex items-center justify-center gap-2 text-black shadow-[4px_4px_0px_0px_#000] disabled:opacity-60 cursor-pointer"
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
                  placeholder="Minimum 4 characters"
                  className="w-full border-2 border-black bg-[#FAF8F5] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none shadow-[3px_3px_0px_0px_#000]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPasskey(!showNewPasskey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black cursor-pointer"
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
                type={showNewPasskey ? "text" : "password"}
                value={confirmPasskey}
                onChange={(e) => setConfirmPasskey(e.target.value)}
                placeholder="Re-enter new passkey"
                className="w-full border-2 border-black bg-[#FAF8F5] px-4 py-2.5 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none shadow-[3px_3px_0px_0px_#000]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={otpLoading}
                className="flex-1 border-2 border-black bg-neo-accent hover:bg-red-400 px-6 py-2.5 font-black text-xs uppercase tracking-wider neo-btn-press flex items-center justify-center gap-2 text-black shadow-[3px_3px_0px_0px_#000] disabled:opacity-60 cursor-pointer"
              >
                {otpLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                Update Passkey
              </button>

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={otpCooldown > 0 || otpLoading}
                className="border-2 border-black bg-white hover:bg-gray-100 px-4 py-2.5 font-black text-xs uppercase tracking-wider neo-btn-press text-black shadow-[3px_3px_0px_0px_#000] disabled:opacity-40 cursor-pointer"
              >
                {otpCooldown > 0 ? `Resend (${otpCooldown}s)` : "Resend"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success */}
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
              onClick={resetState}
              className="w-full border-2 border-black bg-neo-secondary px-6 py-2.5 font-black text-xs uppercase tracking-wider neo-btn-press text-black shadow-[3px_3px_0px_0px_#000] cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPasskeyModal;
