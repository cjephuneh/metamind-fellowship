
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { getContracts } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import ContractInteraction from "@/components/ContractInteraction";
import { useNavigate } from "react-router-dom";

interface SmartContract {
  id: string;
  contract_address: string;
  title: string;
  description: string;
  sponsor_address: string;
  total_funds: string;
  remaining_funds: string;
  created_at: string;
  terms: {
    milestones: Array<{
      description: string;
      percentage: number;
    }>;
    minimum_gpa: number;
    deadline: string;
  };
}

const SmartContracts = () => {
  const { user } = useWallet();
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        const data = await getContracts();
        setContracts(data);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const getProgressPercentage = (contract: SmartContract) => {
    const total = parseFloat(contract.total_funds);
    const remaining = parseFloat(contract.remaining_funds);
    return total > 0 ? Math.round(((total - remaining) / total) * 100) : 0;
  };

  const handleCreateContract = () => {
    // In a real app, this would navigate to a create contract page
    // For now, we'll just alert
    alert("This feature would allow creating a new smart contract");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Smart Contracts</h1>
        {user?.type === "sponsor" && (
          <Button onClick={handleCreateContract} className="bg-purple-500 hover:bg-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Create Contract
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Contracts</TabsTrigger>
          {user?.type === "sponsor" && (
            <TabsTrigger value="my-contracts">My Contracts</TabsTrigger>
          )}
          {user?.type === "student" && (
            <TabsTrigger value="eligible">Eligible For Me</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : contracts.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No smart contracts found. Contracts created for scholarships will appear here.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contracts.map((contract) => (
                <Card key={contract.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{contract.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {contract.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{getProgressPercentage(contract)}%</span>
                      </div>
                      <Progress value={getProgressPercentage(contract)} className="h-2" />
                    </div>

                    <div className="pt-2 border-t text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Funds:</span>
                        <span>{parseFloat(contract.total_funds).toFixed(2)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining:</span>
                        <span>{parseFloat(contract.remaining_funds).toFixed(2)} ETH</span>
                      </div>
                    </div>

                    {user?.type === "sponsor" && contract.sponsor_address === user.address && (
                      <div className="pt-4">
                        <ContractInteraction
                          contractId={contract.id}
                          studentAddress="0x1234567890abcdef1234567890abcdef12345678"
                          studentName="John Doe"
                          milestone={contract.terms.milestones[0]}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-contracts">
          {user?.type === "sponsor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contracts
                .filter((contract) => contract.sponsor_address === user.address)
                .map((contract) => (
                  <Card key={contract.id}>
                    <CardHeader>
                      <CardTitle>{contract.title}</CardTitle>
                      <CardDescription>{contract.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Contract details specific to sponsors */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Milestones</h4>
                          <ul className="space-y-2">
                            {contract.terms.milestones.map((milestone, index) => (
                              <li key={index} className="flex justify-between text-sm border-b pb-1">
                                <span>{milestone.description}</span>
                                <span>{milestone.percentage}%</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="eligible">
          {user?.type === "student" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contracts.map((contract) => (
                <Card key={contract.id}>
                  <CardHeader>
                    <CardTitle>{contract.title}</CardTitle>
                    <CardDescription>{contract.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Student-specific view of the contract */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Milestones to Achieve</h4>
                        <ul className="space-y-2">
                          {contract.terms.milestones.map((milestone, index) => (
                            <li key={index} className="flex justify-between items-center text-sm border-b pb-2">
                              <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                                  {index + 1}
                                </div>
                                <span>{milestone.description}</span>
                              </div>
                              <span className="font-medium">
                                {((parseFloat(contract.total_funds) * milestone.percentage) / 100).toFixed(2)} ETH
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Minimum GPA required:</span>
                        <span>{contract.terms.minimum_gpa}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartContracts;
