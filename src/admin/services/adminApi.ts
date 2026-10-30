/**
 * ==============================================================================
 * ADMIN SERVICE: adminApi
 * ==============================================================================
 * Purpose:
 *   Encapsulates all administrative backend communication with MongoDB:
 *   - Passcode verification & rate-limiting checks
 *   - Email OTP delivery & passcode reset
 *   - Live visitor analytics & geolocation logs
 *   - Secure base64 image upload to Cloudinary
 * ==============================================================================
 */

import { getApiUrl } from "@/core/api/apiClient";
import type { AnalyticsData } from "@/admin/types/admin.types";

export const adminApi = {
  /**
   * Verify admin passcode with backend (bcrypt verification + brute force tracking)
   */
  verifyPasscode: async (passcode: string): Promise<{ success: boolean; error?: string; remainingAttempts?: number; lockoutSeconds?: number }> => {
    try {
      const res = await fetch(getApiUrl("/api/admin/verify-passcode"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      return await res.json();
    } catch {
      return { success: false, error: "Network error contacting authentication server." };
    }
  },

  /**
   * Request an OTP sent to swarajvecha@gmail.com for passcode recovery
   */
  requestOtp: async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch(getApiUrl("/api/admin/forgot-passcode"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return await res.json();
    } catch {
      return { success: false, error: "Failed to request OTP." };
    }
  },

  /**
   * Reset passcode using OTP received on admin email
   */
  resetPasscode: async (otp: string, newPasscode: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch(getApiUrl("/api/admin/reset-passcode"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, newPasscode }),
      });
      return await res.json();
    } catch {
      return { success: false, error: "Failed to reset passcode." };
    }
  },

  /**
   * Fetch visitor analytics from MongoDB Atlas
   */
  fetchAnalytics: async (passcode: string, page: number = 1, limit: number = 10): Promise<AnalyticsData> => {
    const res = await fetch(getApiUrl(`/api/admin/analytics?page=${page}&limit=${limit}`), {
      headers: { "x-admin-passcode": passcode },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch analytics (HTTP ${res.status})`);
    }
    return await res.json();
  },

  /**
   * Upload image to Cloudinary via backend
   */
  uploadImage: async (base64Image: string, passcode: string): Promise<string> => {
    const res = await fetch(getApiUrl("/api/upload"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passcode": passcode,
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Upload failed with HTTP ${res.status}`);
    }

    const json = await res.json();
    return json.url;
  },
};

export default adminApi;

