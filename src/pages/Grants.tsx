
import { useState, useEffect } from "react";
import { getGrants } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Search, Filter, GraduationCap, School, DollarSign, Award, Clock } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import ScholarshipCard from "@/components/ScholarshipCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIAssistant from "@/components/AIAssistant";

const Grants = () => {
  const { user } = useWallet();
  const [grants, setGrants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssistant, setShowAssistant] = useState(false);
  
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const data = await getGrants();
        setGrants(data);
      } catch (error) {
        console.error("Failed to fetch grants:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGrants();
  }, []);
  
  // Create some mock grant categories for demonstration
  const grantCategories = [
    {
      title: "Research Grants",
      icon: <School className="h-5 w-5 text-purple-600" />,
      description: "Funding for academic research projects across disciplines",
      count: 2
    },
    {
      title: "Innovation Grants",
      icon: <Award className="h-5 w-5 text-blue-600" />,
      description: "Support for developing new technologies and solutions",
      count: 1
    },
    {
      title: "Community Grants",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      description: "Funding for projects that benefit local communities",
      count: 1
    }
  ];
  
  // Filter grants based on search term
  const filteredGrants = grants.filter(grant => 
    !searchTerm || 
    grant.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    grant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Research & Innovation Grants</h1>
          <p className="text-muted-foreground mt-1">Explore funding opportunities for your projects and research</p>
        </div>
        
        <Button 
          onClick={() => setShowAssistant(!showAssistant)}
          variant={showAssistant ? "default" : "outline"}
          className="gap-2"
        >
          <GraduationCap className="h-4 w-4" />
          Grant Application Assistant
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {grantCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  {category.icon}
                  {category.title}
                </CardTitle>
                <Badge>{category.count}</Badge>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search grants by keyword..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="secondary" className="gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-4">Available Grants</h2>
          
          {isLoading ? (
            <div className="text-center p-4">Loading grants...</div>
          ) : filteredGrants.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No matching grants found. Try adjusting your search or check back later for new opportunities.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredGrants.map((grant) => (
                <ScholarshipCard 
                  key={grant.id} 
                  scholarship={grant} 
                  userType={user?.type || "student"}
                />
              ))}
            </div>
          )}
        </div>
        
        {showAssistant ? (
          <div className="md:col-span-1">
            <AIAssistant 
              context="research grants funding applications"
              onClose={() => setShowAssistant(false)}
            />
          </div>
        ) : (
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Grant Application Timeline</CardTitle>
                <CardDescription>Key dates and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Application Period</span>
                    </div>
                    <span className="text-sm">Now - June 30</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Review Process</span>
                    </div>
                    <span className="text-sm">July 1 - July 15</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Announcements</span>
                    </div>
                    <span className="text-sm">July 31</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Fund Disbursement</span>
                    </div>
                    <span className="text-sm">August 15</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6"
                  variant="outline"
                  onClick={() => setShowAssistant(true)}
                >
                  Get Application Help
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grants;
