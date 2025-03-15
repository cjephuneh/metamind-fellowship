
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { getUserTransactions } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  from_address: string;
  to_address: string;
  amount: string;
  scholarship_id?: string;
  timestamp: string;
  status: string;
  tx_hash?: string;
  milestone?: string;
}

const TransactionHistory = () => {
  const { user } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.address) {
        try {
          setIsLoading(true);
          const data = await getUserTransactions(user.address);
          setTransactions(data);
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [user?.address]);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View all your blockchain transactions on EduChain
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found. Scholarships that you receive from sponsors will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>{user?.type === "student" ? "From" : "To"}</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {user?.type === "student" 
                        ? shortenAddress(tx.from_address)
                        : shortenAddress(tx.to_address)
                      }
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {parseFloat(tx.amount).toFixed(4)} ETH
                    </TableCell>
                    <TableCell>
                      {tx.milestone || "Direct Transfer"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.status === "completed" ? "success" : "outline"}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
