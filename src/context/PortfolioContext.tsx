import React, { createContext, useContext, useState, useEffect } from "react";
import { portfolioData as defaultData } from "@/data/portfolio";
import { getApiUrl } from "@/lib/api";

type PortfolioData = typeof defaultData;

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: PortfolioData) => Promise<void>;
  resetData: () => Promise<void>;
  exportJSON: () => void;
  isLoading: boolean;
  isMongoConnected: boolean;
  skipLoading: () => void;
}

const STORAGE_KEY = "swaraj_portfolio_data_v1";

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Local storage error:", e);
    }
    return defaultData;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isMongoConnected, setIsMongoConnected] = useState(false);

  const skipLoading = () => {
    setIsLoading(false);
  };

  // Fetch portfolio data from MongoDB Atlas API on mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 25000); // 25s safeguard timeout for cold start

    const fetchPortfolioFromMongo = async () => {
      try {
        const response = await fetch(getApiUrl("/api/portfolio"), {
          signal: controller.signal,
        });
        if (response.ok) {
          const mongoData = await response.json();
          if (mongoData && mongoData.personal && isMounted) {
            setData(mongoData);
            setIsMongoConnected(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(mongoData));
            } catch {
              // Ignore local storage quota/private browsing write errors
            }
          }
        }
      } catch (err: unknown) {
        const error = err as { name?: string };
        if (error.name !== "AbortError") {
          console.warn("Could not connect to MongoDB Atlas API server, using local data fallback:", err);
        } else {
          console.warn("MongoDB Atlas API request timed out after 25s, falling back to local data.");
        }
        if (isMounted) {
          setIsMongoConnected(false);
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPortfolioFromMongo();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const updateData = async (newData: PortfolioData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      // Ignore local storage quota/private browsing write errors
    }

    try {
      const response = await fetch(getApiUrl("/api/portfolio"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": sessionStorage.getItem("admin_passcode") || "",
        },
        body: JSON.stringify(newData),
      });
      if (response.ok) {
        setIsMongoConnected(true);
      } else if (response.status === 401) {
        console.error("Save rejected: admin session expired or invalid, please log in to /admin again.");
      }
    } catch (err) {
      console.error("Failed to sync update to MongoDB Atlas:", err);
    }
  };

  const resetData = async () => {
    setData(defaultData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore local storage quota/private browsing write errors
    }

    // Persist reset via PUT /api/portfolio
    await updateData(defaultData);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <PortfolioContext.Provider value={{ data, updateData, resetData, exportJSON, isLoading, isMongoConnected, skipLoading }}>
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
