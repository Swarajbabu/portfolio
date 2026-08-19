import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PortfolioProvider } from "@/context/PortfolioContext";
import Index from "./pages/Index";

const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { useContentProtection } from "./hooks/useContentProtection";

import { getApiUrl } from "@/lib/api";

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
    <div className="border-4 border-black bg-neo-secondary p-6 shadow-[6px_6px_0px_0px_#000] font-black text-base uppercase tracking-wider flex items-center gap-3">
      <div className="h-4 w-4 rounded-full bg-black animate-ping" />
      <span>Loading...</span>
    </div>
  </div>
);

const App = () => {
  useContentProtection();

  // Track visitor once per session
  useEffect(() => {
    if (sessionStorage.getItem("visit_tracked")) return;
    sessionStorage.setItem("visit_tracked", "1");
    fetch(getApiUrl("/api/track-visit"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: window.location.pathname + window.location.hash }),
    }).catch(() => { /* tracking failure is silent */ });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </PortfolioProvider>
    </QueryClientProvider>
  );
};

export default App;
