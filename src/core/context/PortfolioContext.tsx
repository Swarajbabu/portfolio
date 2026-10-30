/**
 * ==============================================================================
 * CORE CONTEXT: PortfolioContext (Pure Database-Driven)
 * ==============================================================================
 * Purpose:
 *   Single source of truth for portfolio data across the entire application.
 *   - Strictly connected to MongoDB Atlas (`portfolios` collection).
 *   - Zero local mock data fallbacks: Only live database records are rendered.
 *   - Seamless cold-start loading screen during initial backend synchronization.
 * ==============================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { PortfolioData } from "@/core/types/portfolio";
import { getApiUrl } from "@/core/api/apiClient";

export type { PortfolioData };

interface PortfolioContextType {
  data: PortfolioData | null;
  updateData: (newData: PortfolioData, passcode?: string) => Promise<boolean>;
  resetData: () => Promise<void>;
  exportJSON: () => void;
  isLoading: boolean;
  isMongoConnected: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  skipLoading: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMongoConnected, setIsMongoConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const skipLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const fetchPortfolioFromMongo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 35000); // 35s timeout for Render free-tier cold-starts

    try {
      const response = await fetch(getApiUrl("/api/portfolio"), {
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Database returned HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Invalid response format: Expected JSON from API");
      }

      const mongoData: PortfolioData = await response.json();
      if (mongoData && mongoData.personal) {
        setData(mongoData);
        setIsMongoConnected(true);
        setError(null);
      } else {
        throw new Error("Incomplete portfolio document structure in database");
      }
    } catch (err: unknown) {
      const fetchError = err as { name?: string; message?: string };
      console.error("MongoDB Atlas connection error:", fetchError.message || fetchError);
      setIsMongoConnected(false);
      setError(
        fetchError.name === "AbortError"
          ? "Database connection timed out. The server is waking up, please retry."
          : "Could not load portfolio from MongoDB database."
      );
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, []);

  // Fetch from MongoDB Atlas on application start
  useEffect(() => {
    fetchPortfolioFromMongo();
  }, [fetchPortfolioFromMongo]);

  // Update portfolio in MongoDB Atlas
  const updateData = async (newData: PortfolioData, passcode?: string): Promise<boolean> => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const storedPass = passcode || sessionStorage.getItem("admin_passcode");
      if (storedPass) {
        headers["x-admin-passcode"] = storedPass;
      }

      const response = await fetch(getApiUrl("/api/portfolio"), {
        method: "PUT",
        headers,
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        setData(newData);
        setIsMongoConnected(true);
        return true;
      } else {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Update failed with HTTP ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to update portfolio in MongoDB:", err);
      throw err;
    }
  };

  // Reset database state to pristine defaults
  const resetData = async () => {
    await fetchPortfolioFromMongo();
  };

  // Export current MongoDB snapshot as JSON file
  const exportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_database_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        resetData,
        exportJSON,
        isLoading,
        isMongoConnected,
        error,
        refetch: fetchPortfolioFromMongo,
        skipLoading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

export default PortfolioContext;

