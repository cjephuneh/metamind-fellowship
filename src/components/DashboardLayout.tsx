
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AIAssistantSidebar from "@/components/AIAssistantSidebar";
import MainNavigation from "@/components/MainNavigation";
import { 
  LogOut, 
  User, 
  MessageSquare, 
  Bell, 
  Settings,
  Home,
  BookOpen,
  Wallet,
  GraduationCap,
  FileText,
  HelpCircle,
  LucideIcon,
  Building2,
  PieChart,
  Users,
  Calendar
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReactNode } from "react";

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  path: string;
  studentOnly?: boolean;
  sponsorOnly?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, disconnectWallet } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Use useEffect for navigation to avoid React warnings
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  // Return early if no user to prevent render issues
  if (!user) {
    return null;
  }

  const handleSignOut = () => {
    disconnectWallet();
    navigate("/");
  };
  
  const toggleAIAssistant = () => {
    setShowAIAssistant(prev => !prev);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Scholarships", icon: BookOpen, path: "/scholarships" },
    { title: "My Applications", icon: FileText, path: "/applications", studentOnly: true },
    { title: "My Scholarships", icon: GraduationCap, path: "/my-scholarships", sponsorOnly: true },
    { title: "Smart Contracts", icon: Building2, path: "/smart-contracts" },
    { title: "Wallet", icon: Wallet, path: "/wallet" },
    { title: "Analytics", icon: PieChart, path: "/analytics" },
    { title: "Community", icon: Users, path: "/community" },
    { title: "Events", icon: Calendar, path: "/events" },
  ];

  const filteredItems = sidebarItems.filter(item => {
    if (user?.type === "student" && item.sponsorOnly) return false;
    if (user?.type === "sponsor" && item.studentOnly) return false;
    return true;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-4 py-2">
              <div className="text-2xl font-bold text-purple-600">EduLink</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        onClick={() => navigate(item.path)}
                        isActive={location.pathname === item.path}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Help" onClick={toggleAIAssistant}>
                      <HelpCircle className="h-5 w-5" />
                      <span>AI Assistant</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate max-w-[140px]">
                        {user?.name || "User"}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/messages")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/notifications")}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <div className="text-2xl font-bold text-purple-600 md:hidden">EduLink</div>
                </div>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleAIAssistant}
                    className="relative"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Bell className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="text-sm font-medium p-2">Notifications</div>
                      <DropdownMenuSeparator />
                      <div className="p-4 text-sm text-muted-foreground">
                        No new notifications
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline-flex">
                          {user?.name?.split(" ")[0] || "User"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          <div className="flex flex-1">
            <main className="flex-1 p-6">
              {children}
            </main>
            
            {showAIAssistant && (
              <div className="w-[350px] border-l">
                <AIAssistantSidebar onClose={toggleAIAssistant} />
              </div>
            )}
          </div>
        </SidebarInset>
        
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
