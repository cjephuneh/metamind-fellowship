
import { useState, useEffect } from "react";
import { getScholarships } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Search, Filter, GraduationCap, BookOpen } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import ScholarshipCard from "@/components/ScholarshipCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AIAssistant from "@/components/AIAssistant";

const Scholarships = () => {
  const { user } = useWallet();
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [showAssistant, setShowAssistant] = useState(false);
  
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
  
  // Filter and sort scholarships based on search, filter, and sort criteria
  const filterScholarships = (scholarshipList) => {
    return scholarshipList
      .filter(scholarship => {
        // Search term filter
        if (searchTerm && !scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // Type filter
        if (filterType === "stem" && 
            !scholarship.description.toLowerCase().includes("science") && 
            !scholarship.description.toLowerCase().includes("technology") && 
            !scholarship.description.toLowerCase().includes("engineering") && 
            !scholarship.description.toLowerCase().includes("mathematics")) {
          return false;
        }
        
        if (filterType === "arts" && 
            !scholarship.description.toLowerCase().includes("arts") && 
            !scholarship.description.toLowerCase().includes("humanities") && 
            !scholarship.description.toLowerCase().includes("literature")) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "amount") {
          return b.amount - a.amount;
        } else if (sortBy === "deadline") {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
      });
  };
  
  const filteredOpenScholarships = filterScholarships(openScholarships);
  const filteredClosedScholarships = filterScholarships(closedScholarships);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Scholarships</h1>
          <p className="text-muted-foreground mt-1">Browse and apply for available scholarships</p>
        </div>
        
        <Button 
          onClick={() => setShowAssistant(!showAssistant)}
          variant={showAssistant ? "default" : "outline"}
          className="gap-2"
        >
          <GraduationCap className="h-4 w-4" />
          AI Scholarship Assistant
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search scholarships..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="stem">STEM</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Badge className="bg-purple-100 text-purple-800">
                All Scholarships: {scholarships.length}
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                Open: {openScholarships.length}
              </Badge>
              <Badge className="bg-gray-100 text-gray-800">
                Closed: {closedScholarships.length}
              </Badge>
            </div>
          </div>
          
          <Tabs defaultValue="open">
            <TabsList>
              <TabsTrigger value="open" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Open
              </TabsTrigger>
              <TabsTrigger value="closed" className="gap-2">
                Closed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="open" className="space-y-4 mt-6">
              {isLoading ? (
                <div className="text-center p-4">Loading scholarships...</div>
              ) : filteredOpenScholarships.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No matching scholarships found. Try adjusting your search or filters.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOpenScholarships.map((scholarship) => (
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
              {isLoading ? (
                <div className="text-center p-4">Loading scholarships...</div>
              ) : filteredClosedScholarships.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No matching closed scholarships found.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredClosedScholarships.map((scholarship) => (
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
        </div>
        
        {showAssistant ? (
          <div className="md:col-span-1">
            <AIAssistant 
              context="scholarships applications grants funding"
              onClose={() => setShowAssistant(false)}
            />
          </div>
        ) : (
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Scholarship Guide</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">How to Apply</h3>
                    <p className="text-sm text-gray-600">
                      Browse available scholarships, review requirements, and click "Apply Now" to submit your application.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Tips for Success</h3>
                    <p className="text-sm text-gray-600">
                      Read all requirements carefully, prepare your documents in advance, and submit before the deadline.
                    </p>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => setShowAssistant(true)}
                >
                  Get AI Assistance
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scholarships;
