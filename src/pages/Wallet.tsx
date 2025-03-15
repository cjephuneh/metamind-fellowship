
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  Copy, 
  ExternalLink, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  Wallet as WalletIcon,
  Shield,
  ReceiptText,
  QrCode
} from "lucide-react";
import TransactionHistory from "@/components/TransactionHistory";
import SendFunds from "@/components/SendFunds";

const transactions = [
  {
    id: "tx1",
    from_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    to_address: "0x1234567890abcdef1234567890abcdef12345678",
    amount: "0.5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "completed",
    scholarship_id: "sch123",
    tx_hash: "0x123456789abcdef"
  },
  {
    id: "tx2",
    from_address: "0x1234567890abcdef1234567890abcdef12345678",
    to_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    amount: "0.25",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "completed",
    scholarship_id: null,
    tx_hash: "0xabcdef123456789"
  },
  {
    id: "tx3",
    from_address: "0x9876543210fedcba9876543210fedcba98765432",
    to_address: "0x1234567890abcdef1234567890abcdef12345678",
    amount: "1.2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: "completed",
    scholarship_id: "sch456",
    tx_hash: "0x9876543210abcdef"
  }
];

const Wallet = () => {
  const { user, refreshBalance } = useWallet();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
      toast({
        title: "Balance refreshed",
        description: "Your wallet balance has been updated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to refresh",
        description: "Could not update your wallet balance",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const copyAddress = () => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const openExplorerLink = () => {
    if (user?.address) {
      window.open(`https://etherscan.io/address/${user.address}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your blockchain wallet and transactions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-blue-500" />
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Wallet Balance</CardTitle>
                <CardDescription>Your blockchain wallet details</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefreshBalance}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 space-y-2">
                <div className="text-muted-foreground text-sm">Total Balance</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold">{user?.balance || "0"} ETH</div>
                  <div className="text-lg text-muted-foreground">
                    ≈ ${parseFloat(user?.balance || "0") * 3500} USD
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    Received: 1.7 ETH
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Sent: 0.75 ETH
                  </Badge>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Wallet Address</div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={copyAddress}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={openExplorerLink}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="font-mono text-sm break-all">{user?.address}</div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="w-full text-xs h-8">
                      <QrCode className="h-3 w-3 mr-1" />
                      Show QR Code
                    </Button>
                    <Button className="w-full text-xs h-8">
                      <WalletIcon className="h-3 w-3 mr-1" />
                      Send Funds
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
            <CardDescription>Wallet security information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Wallet Security</span>
              </div>
              <Badge>Secured</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ReceiptText className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">Transaction Signing</span>
              </div>
              <Badge variant="outline">Required</Badge>
            </div>
            
            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-800">
                Never share your private keys or seed phrase with anyone, including EduLink support.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Security Settings</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="send">Send Funds</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-4">
          <TransactionHistory transactions={transactions} isLoading={false} />
        </TabsContent>
        
        <TabsContent value="send" className="mt-4">
          <div className="max-w-md mx-auto">
            <SendFunds />
          </div>
        </TabsContent>
        
        <TabsContent value="contracts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Smart Contracts</CardTitle>
              <CardDescription>Blockchain contracts linked to your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">STEM Scholarship Fund</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Contract Address: {formatAddress("0xfedcba9876543210fedcba9876543210fedcba98")}
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Total Funds</div>
                      <div className="font-medium">5.0 ETH</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Remaining</div>
                      <div className="font-medium">3.8 ETH</div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Arts & Humanities Grant</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Contract Address: {formatAddress("0x98765432101234567890abcdef1234567890abcde")}
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Total Funds</div>
                      <div className="font-medium">2.5 ETH</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Remaining</div>
                      <div className="font-medium">2.5 ETH</div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create New Smart Contract</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;
