import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type User = {
  address: string;
  type?: "student" | "sponsor";
  balance?: string;
};

interface WalletContextType {
  user: User | null;
  isConnecting: boolean;
  connectWallet: (type?: "student" | "sponsor") => Promise<boolean>;
  disconnectWallet: () => void;
  sendTransaction: (amount: string, recipient: string) => Promise<boolean>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts && accounts.length > 0) {
            // Get user data from localStorage if available
            const userData = localStorage.getItem('user');
            if (userData) {
              const parsedUser = JSON.parse(userData);
              
              // Verify the stored address matches the current connected account
              if (parsedUser.address.toLowerCase() === accounts[0].toLowerCase()) {
                // Get current balance
                const balance = await window.ethereum.request({
                  method: 'eth_getBalance',
                  params: [accounts[0], 'latest'],
                });
                
                const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
                
                setUser({
                  ...parsedUser,
                  balance: balanceInEth
                });
              } else {
                // Address mismatch, clear localStorage
                localStorage.removeItem('user');
              }
            } else {
              // Just set the address without type
              const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [accounts[0], 'latest'],
              });
              
              const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
              
              setUser({
                address: accounts[0],
                balance: balanceInEth
              });
            }
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkConnection();
    
    // Set up event listeners for MetaMask
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setUser(null);
      localStorage.removeItem('user');
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
      navigate('/');
    } else {
      // User switched accounts
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });
      
      const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
      
      // Update with the new address but keep the user type if possible
      const newUser = {
        address: accounts[0],
        type: user?.type,
        balance: balanceInEth
      };
      
      setUser(newUser);
      
      // Update localStorage
      if (user?.type) {
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      
      toast({
        title: "Account Changed",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    }
  };

  const connectWallet = async (type?: "student" | "sponsor"): Promise<boolean> => {
    setIsConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
          // Get current balance
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest'],
          });
          
          const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
          
          const newUser = {
            address: accounts[0],
            ...(type && { type }),
            balance: balanceInEth
          };
          
          setUser(newUser);
          
          // If user type is provided, save to localStorage
          if (type) {
            localStorage.setItem('user', JSON.stringify(newUser));
          }
          
          toast({
            title: "Wallet Connected!",
            description: `Connected with address: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
          
          return true;
        }
      } else {
        toast({
          variant: "destructive",
          title: "MetaMask Not Found",
          description: "Please install MetaMask to connect your wallet.",
        });
      }
      return false;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Could not connect to your wallet. Please try again.",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Wallet Disconnected",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  const refreshBalance = async () => {
    if (user?.address) {
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [user.address, 'latest'],
        });
        
        const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
        
        setUser(prevUser => {
          if (prevUser) {
            return {
              ...prevUser,
              balance: balanceInEth
            };
          }
          return prevUser;
        });
      } catch (error) {
        console.error("Error refreshing balance:", error);
      }
    }
  };

  const sendTransaction = async (amount: string, recipient: string): Promise<boolean> => {
    if (!user?.address) {
      toast({
        variant: "destructive",
        title: "Not Connected",
        description: "Please connect your wallet first.",
      });
      return false;
    }
    
    try {
      // Convert amount from ETH to Wei
      const amountInWei = `0x${(parseFloat(amount) * 1e18).toString(16)}`;
      
      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: user.address,
          to: recipient,
          value: amountInWei,
        }],
      });
      
      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${txHash.slice(0, 6)}...${txHash.slice(-4)}`,
      });
      
      // Refresh balance after transaction
      await refreshBalance();
      
      return true;
    } catch (error) {
      console.error("Error sending transaction:", error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: "Failed to send transaction. Please try again.",
      });
      return false;
    }
  };

  return (
    <WalletContext.Provider value={{
      user,
      isConnecting,
      connectWallet,
      disconnectWallet,
      sendTransaction,
      refreshBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
