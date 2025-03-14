
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import { useState, useEffect } from "react";
import { getApiKey } from "@/lib/localStorage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ConnectWallet from "./pages/ConnectWallet";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScholarshipDetail from "./pages/ScholarshipDetail";

const queryClient = new QueryClient();

const App = () => {
  const [openAIApiKey, setOpenAIApiKey] = useState<string>("");

  useEffect(() => {
    // Load API key from localStorage on mount
    const storedApiKey = getApiKey();
    if (storedApiKey) {
      setOpenAIApiKey(storedApiKey);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WalletProvider>
            <Routes>
              <Route path="/" element={<Index apiKey={openAIApiKey} setApiKey={setOpenAIApiKey} />} />
              <Route path="/connect" element={<ConnectWallet />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard apiKey={openAIApiKey} />} />
              <Route path="/scholarships/:id" element={<ScholarshipDetail apiKey={openAIApiKey} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WalletProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
