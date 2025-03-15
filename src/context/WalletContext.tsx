import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { loginWithEmailPassword, getUserByAddress, createUser } from "@/lib/api";

type User = {
  id?: string;
  address?: string;
  name?: string;
  email?: string;
  type?: "student" | "sponsor";
  balance?: string;
};

interface WalletContextType {
  user: User | null;
  isConnecting: boolean;
  connectWallet: (type?: "student" | "sponsor") => Promise<boolean>;
  emailPasswordSignIn: (email: string, password: string) => Promise<boolean>;
  disconnectWallet: () => void;
  sendTransaction: (amount: string, recipient: string) => Promise<boolean>;
  refreshBalance: () => Promise<void>;
  isConnected: boolean;
  account: string | undefined;
  userType: string | undefined;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        if (parsedUser.address && typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts && accounts.length > 0 && parsedUser.address.toLowerCase() === accounts[0].toLowerCase()) {
            const balance = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest'],
            });
            
            const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
            
            setUser({
              ...parsedUser,
              balance: balanceInEth
            });
            return;
          }
        } 
        
        if (parsedUser.email) {
          setUser(parsedUser);
          return;
        }
        
        localStorage.removeItem('user');
      }
      
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts && accounts.length > 0) {
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
    };

    checkConnection();
    
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
      setUser(null);
      localStorage.removeItem('user');
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
      navigate('/');
    } else {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });
      
      const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
      
      const newUser = {
        address: accounts[0],
        ...(user?.type && { type: user?.type }),
        balance: balanceInEth
      };
      
      setUser(newUser);
      
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
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
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

  const emailPasswordSignIn = async (email: string, password: string): Promise<boolean> => {
    setIsConnecting(true);
    
    try {
      const response = await loginWithEmailPassword(email, password);
      
      if (response.success) {
        const userData = response.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast({
          title: "Signed In!",
          description: `Welcome back, ${userData.name || 'User'}!`,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Invalid email or password. Please try again.",
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
      title: "Signed Out",
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
      const amountInWei = `0x${(parseFloat(amount) * 1e18).toString(16)}`;
      
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

  const isConnected = user !== null;
  const account = user?.address;
  const userType = user?.type;

  return (
    <WalletContext.Provider value={{
      user,
      isConnecting,
      connectWallet,
      emailPasswordSignIn,
      disconnectWallet,
      sendTransaction,
      refreshBalance,
      isConnected,
      account,
      userType
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
