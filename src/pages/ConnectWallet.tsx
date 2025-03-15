import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { ArrowLeft, AlertCircle, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const ConnectWallet = () => {
  const { connectWallet, isConnecting } = useWallet();
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student");
  const [useDynamicWidget, setUseDynamicWidget] = useState(true);

  const handleConnectMetaMask = async () => {
    const success = await connectWallet(userType as "student" | "sponsor");
    
    if (success) {
      // Redirect to registration
      setTimeout(() => {
        navigate(`/register?type=${userType}`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 flex flex-col">
      <div className="container mx-auto py-6 px-4">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <DynamicContextProvider
          settings={{
            environmentId: "fda698ee-d8ca-4c73-ac3c-f86687fea53c",
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Connect Your Wallet</CardTitle>
              <CardDescription className="text-center">
                Connect your wallet to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="student" onValueChange={setUserType} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">I'm a Student</TabsTrigger>
                  <TabsTrigger value="sponsor">I'm a Sponsor</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mb-6">
                <Tabs defaultValue="dynamic" onValueChange={(val) => setUseDynamicWidget(val === "dynamic")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dynamic">Dynamic Connect</TabsTrigger>
                    <TabsTrigger value="metamask">MetaMask Only</TabsTrigger>
                  </TabsList>
                  <TabsContent value="dynamic" className="mt-4">
                    <div className="flex justify-center">
                      <DynamicWidget />
                    </div>
                  </TabsContent>
                  <TabsContent value="metamask" className="mt-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-amber-800">Before you connect</h3>
                          <div className="mt-1 text-sm text-amber-700">
                            <p>Make sure you have the MetaMask extension installed in your browser. Your wallet will be used to verify your identity on our platform.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleConnectMetaMask} 
                      className="w-full bg-purple-500 hover:bg-purple-600"
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Connecting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Wallet className="mr-2 h-5 w-5" />
                          Connect MetaMask
                        </span>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-xs text-gray-500">
                By connecting, you agree to our <Link to="/terms" className="underline">Terms of Service</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>
              </p>
            </CardFooter>
          </Card>
        </DynamicContextProvider>
      </div>
    </div>
  );
};

export default ConnectWallet;
