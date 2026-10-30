/**
 * ==============================================================================
 * ADMIN TYPES
 * ==============================================================================
 * Purpose:
 *   Type definitions specific to the Admin CMS dashboard, authentication,
 *   tab management, visitor analytics, and Cloudinary media uploading.
 * ==============================================================================
 */

import React from "react";
import type { PortfolioData } from "@/core/types/portfolio";

export type AdminTabType =
  | "personal"
  | "about"
  | "skills"
  | "projects"
  | "certs"
  | "education"
  | "contact"
  | "analytics";

export interface VisitorRecord {
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

export interface AnalyticsData {
  summary: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  dailyCounts: Array<{ date: string; label: string; count: number }>;
  topLocations: Array<{ city: string; country: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  visitors: VisitorRecord[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}

export type ImageUploadCallback = (url: string) => void;
export type ImageUploadHandler = (file: File, onSuccess: ImageUploadCallback) => Promise<void>;

export interface TabProps {
  formData: PortfolioData;
  setFormData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  onSave?: () => Promise<void>;
  onImageUpload?: ImageUploadHandler;
  handleImageUpload?: ImageUploadHandler;
  showToast?: (msg: string) => void;
}

