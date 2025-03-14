
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  PlusCircle, 
  MessageCircle, 
  Wallet, 
  BookOpen, 
  LogOut, 
  User,
  CheckCircle2,
  Clock,
  BookCheck,
  CreditCard,
  BarChart3,
  Gift,
  FileText,
  HandCoins,
  Book
} from "lucide-react";
import { Link } from "react-router-dom";
import ScholarshipCard from "@/components/ScholarshipCard";
import { useWallet } from "@/context/WalletContext";
import MessageModal from "@/components/MessageModal";

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

const mockMessages = [
  {
    id: "msg1",
    sender: {
      name: "Future Tech Foundation",
      walletAddress: "0x3a2d3b45C67A98df234B21399E8ee9C",
      avatar: ""
    },
    recipient: {
      name: "Alex Johnson",
      walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    },
    content: "Thank you for your interest in our scholarship program. Your application has been received and is currently under review. We will notify you of any updates.",
    timestamp: new Date(2023, 5, 15, 10, 30),
    read: false
  },
  {
    id: "msg2",
    sender: {
      name: "Diversity in Tech Alliance",
      walletAddress: "0x8b34c91A53D7e4eC45C67Ae1234c5d6",
      avatar: ""
    },
    recipient: {
      name: "Alex Johnson",
      walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    },
    content: "We've reviewed your application for the Women in STEM Scholarship and we're pleased to inform you that you've been selected as a recipient! Please check your dashboard for next steps.",
    timestamp: new Date(2023, 5, 10, 14, 45),
    read: true
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const { userType, account, disconnectWallet } = useWallet();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMessage, setSelectedMessage] = useState<typeof mockMessages[0] | null>(null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  
  const userName = "Alex Johnson";
  
  const handleLogout = () => {
    disconnectWallet();
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const handleViewMessageDetails = (message: typeof mockMessages[0]) => {
    setSelectedMessage(message);
    setShowMessageDetails(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex items-center h-16 gap-2 px-6 border-b bg-gradient-to-r from-purple-500 to-purple-700 text-white">
          <Sparkles className="h-5 w-5" />
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
                  <FileText className="mr-3 h-5 w-5" />
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
                  <Gift className="mr-3 h-5 w-5" />
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
                  <HandCoins className="mr-3 h-5 w-5" />
                  My Scholarships
                </button>
                <button 
                  onClick={() => setActiveTab("applicants")} 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${
                    activeTab === "applicants" 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <User className="mr-3 h-5 w-5" />
                  Applicants
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
              <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">2</span>
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
          
          <div className="mt-auto space-y-4">
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-semibold text-purple-600">AI Assistant</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Need help with your application? Our AI assistant can guide you.</p>
              <Button 
                size="sm" 
                className="w-full text-xs bg-purple-500 hover:bg-purple-600"
                onClick={() => setActiveTab("aiAssistant")}
              >
                Chat with Assistant
              </Button>
            </div>
            
            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600">
              <Wallet className="mr-3 h-5 w-5" />
              <span className="truncate">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-white fixed top-0 w-full z-10">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
          <span className="font-semibold">MetaMind Fellowship</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        <main className="p-6">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {userType === "student" ? (
                <>
                  <Book className="h-6 w-6 text-purple-500" />
                  Welcome, {userName}!
                </>
              ) : (
                <>
                  <HandCoins className="h-6 w-6 text-purple-500" />
                  Welcome, Sponsor {userName}!
                </>
              )}
            </h1>
            <p className="text-gray-600">
              {userType === "student" 
                ? "Manage your scholarship applications and find new opportunities."
                : "Manage your scholarships and review applications."}
            </p>
          </header>
          
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-2 bg-purple-500" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {userType === "student" ? "Applications" : "Active Scholarships"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800 flex items-center">
                      {userType === "student" ? (
                        <>
                          {mockApplications.length}
                          <FileText className="ml-2 h-5 w-5 text-purple-500" />
                        </>
                      ) : (
                        <>
                          {mockScholarships.filter(s => s.status === "open").length}
                          <Gift className="ml-2 h-5 w-5 text-purple-500" />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-2 bg-green-500" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {userType === "student" ? "Approved" : "Total Awarded"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800 flex items-center">
                      {userType === "student" ? (
                        <>
                          {mockApplications.filter(a => a.status === "approved").length}
                          <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
                        </>
                      ) : (
                        <>
                          $12,500
                          <CreditCard className="ml-2 h-5 w-5 text-green-500" />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-2 bg-blue-500" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Unread Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800 flex items-center">
                      2
                      <MessageCircle className="ml-2 h-5 w-5 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <h2 className="text-xl font-semibold mt-10 mb-4 flex items-center gap-2">
                {userType === "student" ? (
                  <>
                    <Clock className="h-5 w-5 text-purple-500" />
                    Recent Applications
                  </>
                ) : (
                  <>
                    <Gift className="h-5 w-5 text-purple-500" />
                    Recent Scholarships
                  </>
                )}
              </h2>
              
              {userType === "student" ? (
                <div className="space-y-4">
                  {mockApplications.map(application => (
                    <Card key={application.id} className="hover:shadow-md transition-shadow">
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
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" className="bg-purple-500 hover:bg-purple-600">View Details</Button>
                          </div>
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-500" />
                  Available Scholarships
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Sort by Deadline
                  </Button>
                </div>
              </div>
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  My Applications
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="outline" size="sm">Sort by Date</Button>
                </div>
              </div>
              <div className="space-y-4">
                {mockApplications.map(application => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
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
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">View Details</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "myScholarships" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <HandCoins className="h-5 w-5 text-purple-500" />
                  My Scholarships
                </h2>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Create New
                </Button>
              </div>
              
              <Tabs defaultValue="active">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockScholarships
                      .filter(s => s.status === "open")
                      .map(scholarship => (
                        <ScholarshipCard 
                          key={scholarship.id} 
                          scholarship={scholarship} 
                          userType="sponsor" 
                        />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="draft" className="mt-4">
                  <div className="bg-gray-50 p-8 text-center rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium mb-2">No Draft Scholarships</h3>
                    <p className="text-gray-600 mb-4">You don't have any draft scholarships saved.</p>
                    <Button className="bg-purple-500 hover:bg-purple-600">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Create New Scholarship
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="closed" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockScholarships
                      .filter(s => s.status === "closed")
                      .map(scholarship => (
                        <ScholarshipCard 
                          key={scholarship.id} 
                          scholarship={scholarship} 
                          userType="sponsor" 
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {activeTab === "applicants" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-500" />
                  Applicants
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="outline" size="sm">Sort by Date</Button>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tech Innovation Grant Applicants</CardTitle>
                  <CardDescription>12 applicants total</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map(id => (
                      <div key={id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">Jonathan Smith</div>
                            <div className="text-sm text-gray-500">Applied on April 15, 2023</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" className="bg-purple-500 hover:bg-purple-600">Review</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Applicants</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Women in STEM Scholarship Applicants</CardTitle>
                  <CardDescription>8 applicants total</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map(id => (
                      <div key={id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">Sarah Johnson</div>
                            <div className="text-sm text-gray-500">Applied on April 18, 2023</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" className="bg-purple-500 hover:bg-purple-600">Review</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Applicants</Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {activeTab === "createScholarship" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-purple-500" />
                Create New Scholarship
              </h2>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Title</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="E.g. Technology Innovation Grant" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Award Amount</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <input type="number" className="w-full pl-7 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="5000" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                    <input type="date" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Technology</option>
                      <option>Science</option>
                      <option>Arts</option>
                      <option>Humanities</option>
                      <option>Business</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-32" placeholder="Describe the purpose and goals of this scholarship..."></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Requirements</label>
                    <textarea className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-32" placeholder="List the requirements applicants must meet..."></textarea>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                    <Button variant="outline">Save as Draft</Button>
                    <Button className="bg-purple-500 hover:bg-purple-600">Create Scholarship</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "messages" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-500" />
                Messages
              </h2>
              
              <div className="space-y-4">
                {mockMessages.map(message => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle>{message.sender.name}</CardTitle>
                      <CardDescription>
                        {message.timestamp.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600">
                        {message.content.length > 120 
                          ? `${message.content.substring(0, 120)}...` 
                          : message.content}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-between items-center w-full">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          message.read 
                            ? "bg-gray-100 text-gray-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {message.read ? "Read" : "New"}
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-purple-500 hover:bg-purple-600"
                          onClick={() => handleViewMessageDetails(message)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Display message modal when a message is selected */}
          {selectedMessage && (
            <MessageModal
              isOpen={showMessageDetails}
              message={selectedMessage}
              onClose={() => {
                setShowMessageDetails(false);
                setSelectedMessage(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
