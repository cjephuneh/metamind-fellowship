
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
  CreditCard,
  Gift,
  FileText,
  HandCoins,
  Book
} from "lucide-react";
import { Link } from "react-router-dom";
import ScholarshipCard from "@/components/ScholarshipCard";
import { useWallet } from "@/context/WalletContext";
import MessageDetailModal, { Message } from "@/components/MessageDetailModal";

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

// Mock conversation data
const mockConversations = [
  {
    id: "conv1",
    recipient: "Future Tech Foundation",
    lastMessage: "Thank you for your interest in our scholarship program...",
    timestamp: "2h ago",
    unread: true,
    messages: [
      {
        id: "msg1",
        sender: "Future Tech Foundation",
        senderType: "recipient" as const,
        content: "Hi there! Thanks for your interest in the Tech Innovation Grant. Do you have any questions about the application process?",
        timestamp: "10:30 AM",
        read: true,
      },
      {
        id: "msg2",
        sender: "You",
        senderType: "user" as const,
        content: "Yes, I was wondering about the eligibility requirements. Do I need to be a current student to apply?",
        timestamp: "10:35 AM",
        read: true,
      },
      {
        id: "msg3",
        sender: "Future Tech Foundation",
        senderType: "recipient" as const,
        content: "Yes, you need to be currently enrolled in an accredited institution to be eligible. You'll need to provide proof of enrollment during the application process.",
        timestamp: "10:40 AM",
        read: true,
      }
    ]
  },
  {
    id: "conv2",
    recipient: "Diversity in Tech Alliance",
    lastMessage: "We've reviewed your application and have a few questions...",
    timestamp: "1d ago",
    unread: true,
    messages: [
      {
        id: "msg4",
        sender: "Diversity in Tech Alliance",
        senderType: "recipient" as const,
        content: "We've reviewed your application and have a few questions about your project proposal.",
        timestamp: "Yesterday, 2:15 PM",
        read: true,
      },
      {
        id: "msg5",
        sender: "You",
        senderType: "user" as const,
        content: "I'd be happy to provide more information. What specific aspects would you like me to elaborate on?",
        timestamp: "Yesterday, 3:30 PM",
        read: true,
      }
    ]
  },
  {
    id: "conv3",
    recipient: "Global Education Fund",
    lastMessage: "Your application has been approved! Congratulations!",
    timestamp: "3d ago",
    unread: false,
    messages: [
      {
        id: "msg6",
        sender: "Global Education Fund",
        senderType: "recipient" as const,
        content: "Your application has been approved! Congratulations! We're excited to support your academic journey.",
        timestamp: "3 days ago",
        read: true,
      },
      {
        id: "msg7",
        sender: "You",
        senderType: "user" as const,
        content: "Thank you so much! This means a lot to me. When can I expect to receive the scholarship funds?",
        timestamp: "3 days ago",
        read: true,
      },
      {
        id: "msg8",
        sender: "Global Education Fund",
        senderType: "recipient" as const,
        content: "The funds will be transferred to your connected wallet within the next 5-7 business days. You'll receive a notification once the transaction is complete.",
        timestamp: "2 days ago",
        read: true,
      }
    ]
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const { userType, account, disconnect } = useWallet();
  const [selectedConversation, setSelectedConversation] = useState<typeof mockConversations[0] | null>(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  
  const userName = "Alex Johnson";
  
  const handleLogout = () => {
    disconnect();
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
    
    // In a real app, you would send this to your API and update the conversation
    console.log("Message sent:", content, "to:", selectedConversation.recipient);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
      
      <div className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-white fixed top-0 w-full z-10">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
          <span className="font-semibold">MetaMind Fellowship</span>
        </div>
      </div>

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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Find related conversation and open message detail
                                const conversation = mockConversations.find(c => 
                                  c.recipient === application.sponsor
                                );
                                if (conversation) {
                                  setSelectedConversation(conversation);
                                  setShowMessageDetail(true);
                                }
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-purple-500 hover:bg-purple-600"
                              onClick={() => {
                                // Navigate to scholarship detail
                                window.location.href = `/scholarships/${application.scholarshipId}`;
                              }}
                            >
                              View Details
                            </Button>
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
                        window.location.href = "/apply";
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Find related conversation and open message detail
                            const conversation = mockConversations.find(c => 
                              c.recipient === application.sponsor
                            );
                            if (conversation) {
                              setSelectedConversation(conversation);
                              setShowMessageDetail(true);
                            }
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message Sponsor
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-purple-500 hover:bg-purple-600"
                          onClick={() => {
                            window.location.href = `/scholarships/${application.scholarshipId}`;
                          }}
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Here you would normally find the correct conversation
                              // For demo purposes, we'll just open the first one
                              if (mockConversations.length > 0) {
                                setSelectedConversation(mockConversations[0]);
                                setShowMessageDetail(true);
                              }
                            }}
                          >
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (mockConversations.length > 0) {
                                setSelectedConversation(mockConversations[1]);
                                setShowMessageDetail(true);
                              }
                            }}
                          >
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
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Description</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                      placeholder="Describe the scholarship, its purpose, and who should apply."
                    ></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Requirements</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
                      placeholder="List all requirements applicants must meet to be eligible."
                    ></textarea>
                  </div>
                
                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
                {mockConversations.map(conversation => (
                  <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer"
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setShowMessageDetail(true);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {conversation.recipient}
                            {conversation.unread && (
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {conversation.lastMessage}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{conversation.timestamp}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-purple-500" />
                Profile
              </h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={userName} 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        readOnly 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        value="alex.johnson@example.com" 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        readOnly 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
                      <input 
                        type="text" 
                        value={account || "Not connected"} 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-purple-500 hover:bg-purple-600">Edit Profile</Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {activeTab === "aiAssistant" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Assistant
              </h2>
              
              <Card className="h-[500px] flex flex-col">
                <CardHeader>
                  <CardTitle>Ask me anything about scholarships</CardTitle>
                  <CardDescription>
                    I can help with applications, finding scholarships, or understanding requirements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          Hi! I'm your AI scholarship assistant. How can I help you today?
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t">
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      placeholder="Type your question here..."
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Button className="bg-purple-500 hover:bg-purple-600">
                      Send
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Message Detail Modal */}
      {selectedConversation && (
        <MessageDetailModal
          isOpen={showMessageDetail}
          onClose={() => setShowMessageDetail(false)}
          conversation={selectedConversation}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default Dashboard;
