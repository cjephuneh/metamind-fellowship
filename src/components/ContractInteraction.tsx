
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { recordTransaction } from "@/lib/api";
import { Loader2, CheckCircle } from "lucide-react";

interface ContractInteractionProps {
  contractId: string;
  studentAddress: string;
  studentName: string;
  milestone: {
    description: string;
    percentage: number;
  };
  onSuccess?: () => void;
}

const ContractInteraction = ({
  contractId,
  studentAddress,
  studentName,
  milestone,
  onSuccess,
}: ContractInteractionProps) => {
  const { user, account } = useWallet();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const completeMilestone = async () => {
    if (!user?.address || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to perform this action.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // This would be actual smart contract interaction in production
      // For this demo, we'll simulate the transaction
      
      // 1. Calculate the amount based on milestone percentage
      const contractData = {
        totalFunds: 5.0, // This would come from the actual contract
      };
      
      const amount = (contractData.totalFunds * milestone.percentage / 100).toFixed(2);
      
      // 2. Record the transaction in our backend
      await recordTransaction({
        fromAddress: account,
        toAddress: studentAddress,
        amount: amount,
        scholarshipId: contractId,
        txHash: `0x${Math.random().toString(16).substring(2)}`, // Simulate tx hash
      });

      toast({
        title: "Milestone Completed!",
        description: `Successfully sent ${amount} ETH to ${studentName} for milestone: ${milestone.description}`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error completing milestone:", error);
      toast({
        title: "Transaction Failed",
        description: "There was an error processing the milestone. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Complete Milestone</CardTitle>
        <CardDescription>
          Release funds to student upon milestone completion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Student:</span>
            <span className="text-sm">{studentName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Milestone:</span>
            <span className="text-sm">{milestone.description}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Percentage:</span>
            <span className="text-sm">{milestone.percentage}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={completeMilestone}
          disabled={isProcessing || user?.type !== 'sponsor'}
          className="w-full"
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          {isProcessing ? "Processing..." : "Complete & Release Funds"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContractInteraction;
