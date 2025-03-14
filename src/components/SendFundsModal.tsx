
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";
import { Loader2 } from "lucide-react";

interface SendFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientAddress: string;
  recipientName: string;
  scholarshipId?: string;
}

const SendFundsModal = ({
  isOpen,
  onClose,
  recipientAddress,
  recipientName,
  scholarshipId,
}: SendFundsModalProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { account, isConnected } = useWallet();

  const handleSendFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Convert amount to Wei (1 ETH = 10^18 Wei)
      const amountInWei = (parseFloat(amount) * 1e18).toString();
      
      // Request transaction from MetaMask
      await window.ethereum?.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: recipientAddress,
            value: `0x${parseInt(amountInWei).toString(16)}`, // Convert to hex
            gas: "0x5208", // 21000 gas in hex
          },
        ],
      });
      
      setIsSuccess(true);
      toast({
        title: "Transaction Submitted",
        description: `You've successfully sent ${amount} ETH to ${recipientName}.`,
      });
      
      // Record the transaction in your system if needed
      // This would typically be done through an API call
      console.log("Transaction recorded:", {
        from: account,
        to: recipientAddress,
        amount,
        scholarshipId,
        timestamp: new Date(),
      });
      
      // Reset the form
      setAmount("");
      
      // Close modal after brief success message
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "There was an error processing your transaction.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Funds</DialogTitle>
          <DialogDescription>
            Send ETH directly to {recipientName}.
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="py-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Transaction Submitted!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your transaction is being processed on the blockchain.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  value={recipientName}
                  disabled
                />
                <p className="text-xs text-muted-foreground truncate">
                  {recipientAddress}
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.1"
                />
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
                <p className="text-xs text-amber-800">
                  You are about to send funds directly to this recipient using your connected wallet.
                  This transaction will incur gas fees and cannot be reversed.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSendFunds} disabled={isLoading || !amount}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Send Funds"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SendFundsModal;
