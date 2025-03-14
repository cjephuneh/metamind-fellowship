import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, PlusCircle, MessageCircle, Wallet, BookOpen, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import ScholarshipCard from "@/components/ScholarshipCard";

// Mock data for demonstrations
const mockScholarships = [
  {
    id: "1",
    title: "Tech Innovation Grant",
    sponsor: "Future Tech Foundation",
    amount: 5000,
    deadline: "2023-12-31",
    status: "open",
    description: "For students pursuing degrees in computer science, AI, or related fields.",
    requirements: "Minimum GPA of 3.5, demonstrated interest in technology innovation."
  },
  {
    id: "2",
    title: "Women in STEM Scholarship",
    sponsor: "Diversity in Tech Alliance",
    amount: 7500,
    deadline: "2023-11-15",
    status: "open",
    description: "Supporting women pursuing education in Science, Technology, Engineering and Mathematics.",
    requirements: "Open to female-identifying students in STEM programs."
  },
  {
    id: "3", 
    title: "Global Leadership Award",
    sponsor: "International Education Fund",
    amount: 10000,
    deadline: "2023-10-01",
    status: "closed",
    description: "For students demonstrating exceptional leadership and global perspective.",
    requirements: "Leadership experience, international engagement, minimum GPA of 3.0."
  }
];

const mockApplications = [
  {
    id: "app1",
    scholarshipId: "1",
    scholarshipTitle: "Tech Innovation Grant",
    sponsor: "Future Tech Foundation",
    appliedDate: "2023-09-15",
    status: "under review",
    amount: 5000
  },
  {
    id: "app2",
    scholarshipId: "2",
    scholarshipTitle: "Women in STEM Scholarship",
    sponsor: "Diversity in Tech Alliance",
    appliedDate: "2023-09-10",
    status: "approved",
    amount: 7500
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // In a real app, these would come from your user context/auth state
  const userType = "student"; // or "sponsor"
  const userWalletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const userName = "Alex Johnson";
  
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
    // In a real app, you would clear the auth state here
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 gap-2 px-6 border-b">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="font-semibold">MetaMind Fellowship</span>
        </div>
        <div className="flex-grow flex flex-col justify-between p-4">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("overview")} 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${
                activeTab === "overview" 
                  ? "bg-purple-50 text-purple-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Overview
            </button>
            
            {userType === "student" && (
              <>
                <button 
                  onClick={() => setActiveTab("myApplications")} 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${
                    activeTab === "myApplications" 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  My Applications
                </button>
                <button 
                  onClick={() => setActiveTab("findScholarships")} 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${
                    activeTab === "findScholarships" 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <PlusCircle className="mr-3 h-5 w-5" />
                  Find Scholarships
                </button>
              </>
            )}
            
            {userType === "sponsor" && (
              <>
                <button 
                  onClick={() => setActiveTab("myScholarships")} 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${
                    activeTab === "myScholarships" 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  My Scholarships
                </button>
                <button 
                  onClick={() => setActiveTab("createScholarship")} 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${
                    activeTab === "createScholarship" 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <PlusCircle className="mr-3 h-5 w-5" />
                  Create Scholarship
                </button>
              </>
            )}
            
            <button 
              onClick={() => setActiveTab("messages")} 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${
                activeTab === "messages" 
                  ? "bg-purple-50 text-purple-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <MessageCircle className="mr-3 h-5 w-5" />
              Messages
            </button>
            
            <button 
              onClick={() => setActiveTab("profile")} 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${
                activeTab === "profile" 
                  ? "bg-purple-50 text-purple-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </button>
          </nav>
          
          <div className="mt-auto">
            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600">
              <Wallet className="mr-3 h-5 w-5" />
              <span className="truncate">{userWalletAddress.slice(0, 6)}...{userWalletAddress.slice(-4)}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center px-3 py-2 mt-2 text-sm font-medium rounded-md w-full text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-white fixed top-0 w-full z-10">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
          <span className="font-semibold">MetaMind Fellowship</span>
        </div>
        {/* Mobile menu button would go here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        <main className="p-6">
          <header className="mb-8">
            <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
            <p className="text-gray-600">
              {userType === "student" 
                ? "Manage your scholarship applications and find new opportunities."
                : "Manage your scholarships and review applications."}
            </p>
          </header>
          
          {/* Content based on active tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {userType === "student" ? "Applications" : "Active Scholarships"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userType === "student" ? mockApplications.length : mockScholarships.filter(s => s.status === "open").length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {userType === "student" ? "Approved" : "Total Awarded"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userType === "student" 
                        ? mockApplications.filter(a => a.status === "approved").length 
                        : "$12,500"}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Unread Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                  </CardContent>
                </Card>
              </div>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">
                {userType === "student" ? "Recent Applications" : "Recent Scholarships"}
              </h2>
              
              {userType === "student" ? (
                <div className="space-y-4">
                  {mockApplications.map(application => (
                    <Card key={application.id}>
                      <CardHeader className="pb-2">
                        <CardTitle>{application.scholarshipTitle}</CardTitle>
                        <CardDescription>{application.sponsor}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <span>Applied: {application.appliedDate}</span>
                          <span>Amount: ${application.amount}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center justify-between w-full">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            application.status === "approved" 
                              ? "bg-green-100 text-green-800" 
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {application.status === "approved" 
                              ? "Approved" 
                              : application.status === "rejected"
                              ? "Rejected"
                              : "Under Review"}
                          </span>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockScholarships.map(scholarship => (
                    <ScholarshipCard key={scholarship.id} scholarship={scholarship} userType="sponsor" />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === "findScholarships" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Available Scholarships</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockScholarships
                  .filter(s => s.status === "open")
                  .map(scholarship => (
                    <ScholarshipCard 
                      key={scholarship.id} 
                      scholarship={scholarship} 
                      userType="student" 
                      onApply={() => {
                        toast({
                          title: "Application Started",
                          description: `You've started an application for ${scholarship.title}`,
                        });
                      }}
                    />
                  ))}
              </div>
            </div>
          )}
          
          {activeTab === "myApplications" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">My Applications</h2>
              <div className="space-y-4">
                {mockApplications.map(application => (
                  <Card key={application.id}>
                    <CardHeader>
                      <CardTitle>{application.scholarshipTitle}</CardTitle>
                      <CardDescription>{application.sponsor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Applied: {application.appliedDate}</span>
                          <span>Amount: ${application.amount}</span>
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            application.status === "approved" 
                              ? "bg-green-100 text-green-800" 
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {application.status === "approved" 
                              ? "Approved" 
                              : application.status === "rejected"
                              ? "Rejected"
                              : "Under Review"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message Sponsor
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Other tab contents would be implemented similarly */}
          {(activeTab === "messages" || activeTab === "profile" || 
           activeTab === "myScholarships" || activeTab === "createScholarship") && (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-gray-600">This feature is under development and will be available soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
