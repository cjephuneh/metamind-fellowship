
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getScholarships, getUserApplications, getUserMessages, getUserTransactions } from "@/lib/api";
import { 
  AlertCircle, 
  BookOpen, 
  Clock, 
  GraduationCap, 
  Wallet, 
  MessageSquare, 
  FileText,
  Award,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import ScholarshipCard from "@/components/ScholarshipCard";
import TransactionHistory from "@/components/TransactionHistory";
import SendFunds from "@/components/SendFunds";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, refreshBalance } = useWallet();
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState({
    scholarships: true,
    applications: true,
    messages: true,
    transactions: true
  });

  useEffect(() => {
    refreshBalance();
    
    const fetchData = async () => {
      try {
        // Fetch scholarships
        const scholarshipsData = await getScholarships();
        setScholarships(scholarshipsData || []);
        setLoadingStatus(prev => ({ ...prev, scholarships: false }));
        
        // Fetch user-specific data if user is logged in
        if (user?.id) {
          // Fetch applications for students
          if (user.type === "student") {
            try {
              const applicationsData = await getUserApplications(user.id);
              setApplications(applicationsData || []);
            } catch (error) {
              console.error("Failed to fetch applications:", error);
              setApplications([]);
            } finally {
              setLoadingStatus(prev => ({ ...prev, applications: false }));
            }
          }
          
          // Fetch messages
          try {
            const messagesData = await getUserMessages(user.id);
            setMessages(messagesData || []);
          } catch (error) {
            console.error("Failed to fetch messages:", error);
            setMessages([]);
          } finally {
            setLoadingStatus(prev => ({ ...prev, messages: false }));
          }
          
          // Fetch transactions
          if (user.address) {
            try {
              const transactionsData = await getUserTransactions(user.address);
              setTransactions(transactionsData || []);
            } catch (error) {
              console.error("Failed to fetch transactions:", error);
              setTransactions([]);
            } finally {
              setLoadingStatus(prev => ({ ...prev, transactions: false }));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch scholarships:", error);
        setScholarships([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, refreshBalance]);

  // Filter scholarships based on status - ensure scholarships is an array before filtering
  const openScholarships = scholarships && Array.isArray(scholarships) 
    ? scholarships.filter((s) => s.status === "open") 
    : [];
  const closedScholarships = scholarships && Array.isArray(scholarships) 
    ? scholarships.filter((s) => s.status === "closed") 
    : [];
  
  // Calculate unread messages - ensure messages is an array before filtering
  const unreadMessages = messages && Array.isArray(messages) 
    ? messages.filter(msg => !msg.read).length 
    : 0;
  
  // Calculate application stats - ensure applications is an array before filtering
  const pendingApplications = applications && Array.isArray(applications) 
    ? applications.filter(app => app.status === "pending").length 
    : 0;
  const approvedApplications = applications && Array.isArray(applications) 
    ? applications.filter(app => app.status === "approved").length 
    : 0;
  
  // Calculate scholarship usage
  const scholarshipUsage = user?.type === "student" ? 65 : 40; // Mock percentage

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">EduLink Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name || (user?.type === "sponsor" ? "Sponsor" : "Student")}</p>
        </div>
        <div className="flex items-center p-2 px-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
          <Wallet className="mr-2 h-5 w-5 text-purple-500" />
          <div>
            <span className="font-medium">{user?.balance || "0"} ETH</span>
            <span className="text-xs text-muted-foreground ml-2">≈ ${parseFloat(user?.balance || "0") * 3500} USD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-purple-500" />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Wallet Balance</CardTitle>
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Your blockchain wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user?.balance || "0"} ETH</div>
            <p className="text-sm text-muted-foreground mt-2">
              {user?.type === "student" 
                ? "Received from scholarships and transfers"
                : "Available for funding scholarships"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-green-500" />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                {user?.type === "student" ? "Applications" : "Scholarships"}
              </CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>
              {user?.type === "student" ? "Your scholarship applications" : "Scholarships you've created"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {user?.type === "student" ? pendingApplications + approvedApplications : openScholarships.length}
            </div>
            <div className="flex gap-2 mt-2">
              {user?.type === "student" && (
                <>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    {pendingApplications} Pending
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                    {approvedApplications} Approved
                  </Badge>
                </>
              )}
              {user?.type === "sponsor" && (
                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                  {openScholarships.length} Active
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-blue-500" />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Smart Contracts</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Blockchain-based agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <div className="mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                {user?.type === "student" 
                  ? "1 Active Contract"
                  : "1 Created Contract"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-amber-500" />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Messages</CardTitle>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Communication center</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{messages.length}</div>
            <div className="mt-2">
              {unreadMessages > 0 ? (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  {unreadMessages} Unread
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">
                  All Read
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Stats Section */}
      {user?.type === "student" && (
        <Card>
          <CardHeader>
            <CardTitle>Scholarship Usage</CardTitle>
            <CardDescription>Track your educational funding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Scholarship Fund Usage</span>
                  <span className="font-medium">{scholarshipUsage}%</span>
                </div>
                <Progress value={scholarshipUsage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-green-100">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Scholarship</p>
                    <p className="text-xs text-muted-foreground">$3,200 remaining</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-100">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Academic Progress</p>
                    <p className="text-xs text-muted-foreground">GPA: 3.8/4.0</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Next Milestone</p>
                    <p className="text-xs text-muted-foreground">Due in 14 days</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="scholarships">
        <TabsList className="mb-4">
          <TabsTrigger value="scholarships">
            <BookOpen className="h-4 w-4 mr-2" />
            Scholarships
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Wallet className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          {user?.type === "student" && (
            <TabsTrigger value="applications">
              <FileText className="h-4 w-4 mr-2" />
              My Applications
            </TabsTrigger>
          )}
          {user?.type === "sponsor" && (
            <TabsTrigger value="send">
              <GraduationCap className="h-4 w-4 mr-2" />
              Send Funds
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="scholarships" className="space-y-4">
          <Tabs defaultValue="open">
            <TabsList>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="open" className="space-y-4 mt-6">
              {loadingStatus.scholarships ? (
                <div className="text-center p-4">Loading scholarships...</div>
              ) : openScholarships.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No open scholarships found. Please check back later for new opportunities.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {openScholarships.map((scholarship) => (
                    <ScholarshipCard 
                      key={scholarship.id} 
                      scholarship={scholarship} 
                      userType={user?.type || "student"}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="closed" className="space-y-4 mt-6">
              {loadingStatus.scholarships ? (
                <div className="text-center p-4">Loading scholarships...</div>
              ) : closedScholarships.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No closed scholarships found.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {closedScholarships.map((scholarship) => (
                    <ScholarshipCard 
                      key={scholarship.id} 
                      scholarship={scholarship} 
                      userType={user?.type || "student"}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionHistory transactions={transactions} isLoading={loadingStatus.transactions} />
        </TabsContent>
        
        {user?.type === "student" && (
          <TabsContent value="applications">
            {loadingStatus.applications ? (
              <div className="text-center p-4">Loading your applications...</div>
            ) : applications.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You haven't applied to any scholarships yet. Browse open scholarships to apply.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Scholarship Applications</h3>
                <div className="grid grid-cols-1 gap-4">
                  {applications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{application.scholarshipTitle}</CardTitle>
                            <CardDescription>Applied on: {new Date(application.createdAt).toLocaleDateString()}</CardDescription>
                          </div>
                          <Badge className={
                            application.status === "approved" ? "bg-green-100 text-green-800" : 
                            application.status === "rejected" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2">{application.story}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        )}
        
        {user?.type === "sponsor" && (
          <TabsContent value="send">
            <div className="max-w-md mx-auto">
              <SendFunds />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
