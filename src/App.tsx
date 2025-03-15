
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/ui/layout";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import ScholarshipDetail from "@/pages/ScholarshipDetail";
import Register from "@/pages/Register";
import ConnectWallet from "@/pages/ConnectWallet";
import SignIn from "@/pages/SignIn";
import NotFound from "@/pages/NotFound";
import SmartContracts from "@/pages/SmartContracts";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="educhain-theme">
      <Router>
        <WalletProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/connect" element={<ConnectWallet />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/scholarships/:id" element={<Layout><ScholarshipDetail /></Layout>} />
            <Route path="/smart-contracts" element={<Layout><SmartContracts /></Layout>} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </WalletProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
