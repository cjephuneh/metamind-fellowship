
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "@/components/DashboardLayout";
import Layout from "@/components/ui/layout";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import ScholarshipDetail from "@/pages/ScholarshipDetail";
import Register from "@/pages/Register";
import ConnectWallet from "@/pages/ConnectWallet";
import SignIn from "@/pages/SignIn";
import NotFound from "@/pages/NotFound";
import SmartContracts from "@/pages/SmartContracts";
import Analytics from "@/pages/Analytics";
import Community from "@/pages/Community";
import Wallet from "@/pages/Wallet";
import Scholarships from "@/pages/Scholarships";
import Grants from "@/pages/Grants";

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
            
            {/* Dashboard Routes with Sidebar */}
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/scholarships" element={<DashboardLayout><Scholarships /></DashboardLayout>} />
            <Route path="/grants" element={<DashboardLayout><Grants /></DashboardLayout>} />
            <Route path="/scholarships/:id" element={<DashboardLayout><ScholarshipDetail /></DashboardLayout>} />
            <Route path="/smart-contracts" element={<DashboardLayout><SmartContracts /></DashboardLayout>} />
            <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
            <Route path="/community" element={<DashboardLayout><Community /></DashboardLayout>} />
            <Route path="/wallet" element={<DashboardLayout><Wallet /></DashboardLayout>} />
            
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
