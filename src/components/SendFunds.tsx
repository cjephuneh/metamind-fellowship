
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SendHorizonal, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SendFundsProps {
  recipientAddress?: string;
  recipientName?: string;
  onSuccess?: () => void;
}

const SendFunds = ({ recipientAddress, recipientName, onSuccess }: SendFundsProps) => {
  const { user, sendTransaction, refreshBalance } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [customRecipient, setCustomRecipient] = useState(recipientAddress || "");
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSend = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
      });
      return;
    }

    if (!customRecipient) {
      toast({
        variant: "destructive",
        title: "Missing Recipient",
        description: "Please enter a recipient address.",
      });
      return;
    }

    setIsSending(true);
    try {
      const success = await sendTransaction(amount, customRecipient);
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
      toast({
        title: "Balance Updated",
        description: "Your wallet balance has been refreshed.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send Funds</CardTitle>
        <CardDescription>
          {recipientName 
            ? `Send ETH to ${recipientName}`
            : "Send ETH to support scholarships"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Your balance</p>
          <div className="flex items-center gap-2">
            <p className="font-medium">{user?.balance || "0.0000"} ETH</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleRefreshBalance}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.01"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        {!recipientAddress && (
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={customRecipient}
              onChange={(e) => setCustomRecipient(e.target.value)}
              required
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-purple-500 hover:bg-purple-600"
          onClick={handleSend}
          disabled={isSending || !user?.address}
        >
          {isSending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <SendHorizonal className="mr-2 h-5 w-5" />
              Send {amount ? `${amount} ETH` : 'Funds'}
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SendFunds;
