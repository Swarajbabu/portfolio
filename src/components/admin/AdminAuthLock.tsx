/**
 * ==============================================================================
 * ADMIN COMPONENT: AdminAuthLock
 * ==============================================================================
 * Purpose:
 *   Passcode lock screen protecting the Admin CMS with:
 *   - 15-minute brute-force lockout countdown timer
 *   - Unlock passkey form
 *   - Quick access to OTP passkey reset modal
 * ==============================================================================
 */

import React, { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Lock, Unlock, Key, AlertCircle } from "lucide-react";

interface AdminAuthLockProps {
  passcode: string;
  setPasscode: (val: string) => void;
  passError: string;
  lockoutRemaining: number;
  handleLogin: (e: FormEvent) => void;
  onOpenPasskeyModal: () => void;
}

export const AdminAuthLock: React.FC<AdminAuthLockProps> = ({
  passcode,
  setPasscode,
  passError,
  lockoutRemaining,
  handleLogin,
  onOpenPasskeyModal,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F4EA] flex items-center justify-center p-4">
      <div className="border-4 border-black bg-white p-5 sm:p-8 max-w-md w-full shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] text-center">
        
        {/* Lock Icon Box */}
        <div className="border-2 border-black bg-neo-accent p-3 sm:p-4 inline-block mb-4 sm:mb-6 rotate-3 shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]">
          <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-black" strokeWidth={3} />
        </div>

        <h1 className="font-black text-xl sm:text-2xl uppercase tracking-tight mb-1 text-black">
          Admin Portal Lock
        </h1>
        <p className="font-bold text-[11px] sm:text-xs uppercase tracking-widest text-black/70 mb-5 sm:mb-6">
          Enter passkey to access CMS settings
        </p>

        {/* Lockout Warning vs Form */}
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
              placeholder="Enter passkey"
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
              className="w-full border-2 border-black bg-neo-accent px-6 py-3 font-black text-base uppercase tracking-wide neo-btn-press flex items-center justify-center gap-2 text-black shadow-[4px_4px_0px_0px_#000] cursor-pointer"
            >
              Unlock <Unlock className="h-5 w-5" strokeWidth={3} />
            </button>
          </form>
        )}

        {/* Change / Reset Passkey */}
        <div className="mt-4 pt-4 border-t-2 border-black/15 flex flex-col gap-2">
          <button
            type="button"
            onClick={onOpenPasskeyModal}
            className="border-2 border-black bg-neo-secondary hover:bg-yellow-300 px-4 py-2 font-black text-xs uppercase tracking-wider neo-btn-press flex items-center justify-center gap-1.5 text-black shadow-[3px_3px_0px_0px_#000] cursor-pointer"
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
};

export default AdminAuthLock;
