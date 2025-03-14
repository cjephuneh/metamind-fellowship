
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, MessageCircle, Send, Settings } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import AIChat from "./AIChat";
import SettingsModal from "./SettingsModal";
import SendFundsModal from "./SendFundsModal";
import { saveApiKey } from "@/lib/localStorage";

interface ScholarshipActionsProps {
  scholarshipId: string;
  recipientAddress: string;
  recipientName: string;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ScholarshipActions: React.FC<ScholarshipActionsProps> = ({
  scholarshipId,
  recipientAddress,
  recipientName,
  apiKey,
  setApiKey,
}) => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSendFunds, setShowSendFunds] = useState(false);
  const { isConnected, account, userType } = useWallet();
  const { toast } = useToast();

  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    saveApiKey(newApiKey);
  };

  const handleSendFunds = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send funds.",
        variant: "destructive",
      });
      return;
    }

    if (userType !== "sponsor") {
      toast({
        title: "Sponsor Account Required",
        description: "Only sponsors can send funds to scholarships.",
        variant: "destructive",
      });
      return;
    }

    setShowSendFunds(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Scholarship Actions</CardTitle>
          <CardDescription>
            Interact with this scholarship
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowAIChat(!showAIChat)}
            >
              <MessageCircle className="h-4 w-4" />
              {showAIChat ? "Hide AI Assistant" : "Ask AI Assistant"}
            </Button>
            
            {userType === "sponsor" && (
              <Button 
                className="flex items-center gap-2"
                onClick={handleSendFunds}
              >
                <Send className="h-4 w-4" />
                Send Funds
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="ml-auto"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {showAIChat && (
            <div className="mt-4">
              <AIChat apiKey={apiKey} />
            </div>
          )}
        </CardContent>
      </Card>
      
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        onSave={handleSaveApiKey}
      />
      
      <SendFundsModal
        isOpen={showSendFunds}
        onClose={() => setShowSendFunds(false)}
        recipientAddress={recipientAddress}
        recipientName={recipientName}
        scholarshipId={scholarshipId}
      />
    </>
  );
};

export default ScholarshipActions;
