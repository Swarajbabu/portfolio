import { PortfolioData } from "@/data/portfolio";

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
  summary: { total: number; today: number; thisWeek: number; thisMonth: number };
  dailyCounts: { date: string; label: string; count: number }[];
  topLocations: { city: string; country: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  visitors: VisitorRecord[];
  pagination: { page: number; limit: number; totalPages: number; totalRecords: number };
}

export type ImageUploadCallback = (url: string) => void;
export type ImageUploadHandler = (file: File, onSuccess: ImageUploadCallback) => Promise<void>;

export interface TabProps {
  formData: PortfolioData;
  setFormData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  handleImageUpload?: ImageUploadHandler;
  showToast: (msg: string) => void;
}
