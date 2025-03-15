
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getScholarships } from "@/lib/api";
import { AlertCircle, BookOpen, Clock, GraduationCap, Wallet } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import ScholarshipCard from "@/components/ScholarshipCard";
import TransactionHistory from "@/components/TransactionHistory";
import SendFunds from "@/components/SendFunds";

const Dashboard = () => {
  const { user } = useWallet();
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const data = await getScholarships();
        setScholarships(data);
      } catch (error) {
        console.error("Failed to fetch scholarships:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Filter scholarships based on status
  const openScholarships = scholarships.filter((s) => s.status === "open");
  const closedScholarships = scholarships.filter((s) => s.status === "closed");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{user?.type === "sponsor" ? "Sponsor" : "Student"} Dashboard</h1>
        <div className="flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-muted-foreground" />
          <span>{user?.balance || "0"} ETH</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Balance</CardTitle>
            <CardDescription>Your current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user?.balance || "0"} ETH</div>
            <p className="text-sm text-muted-foreground mt-2">
              {user?.type === "student" 
                ? "Received from scholarships and direct transfers"
                : "Available for funding scholarships"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {user?.type === "student" ? "Applications" : "Scholarships"}
            </CardTitle>
            <CardDescription>
              {user?.type === "student" ? "Your scholarship applications" : "Scholarships you've created"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground mt-2">
              {user?.type === "student" 
                ? "Pending approval"
                : "Active scholarships"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Smart Contracts</CardTitle>
            <CardDescription>Blockchain-based scholarship agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-sm text-muted-foreground mt-2">
              {user?.type === "student" 
                ? "Contracts you're eligible for"
                : "Created smart contracts"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scholarships">
        <TabsList>
          <TabsTrigger value="scholarships">
            <BookOpen className="h-4 w-4 mr-2" />
            Scholarships
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Wallet className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
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
              {isLoading ? (
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
                    <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="closed" className="space-y-4 mt-6">
              {isLoading ? (
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
                    <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionHistory />
        </TabsContent>
        
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
