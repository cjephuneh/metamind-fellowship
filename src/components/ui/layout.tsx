
import { ReactNode } from "react";
import { useWallet } from "@/context/WalletContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";
import { LogOut, User, MessageSquare, Bell, Settings } from "lucide-react";
import MainNavigation from "@/components/MainNavigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, disconnectWallet } = useWallet();
  const navigate = useNavigate();

  // Redirect to sign in if not authenticated
  if (!user) {
    navigate("/signin");
    return null;
  }

  const handleSignOut = () => {
    disconnectWallet();
    navigate("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto px-4">
          <MainNavigation />
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {children}
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            EduChain &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default Layout;
