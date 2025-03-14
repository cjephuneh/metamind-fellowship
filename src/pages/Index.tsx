
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, BookOpen, CheckCircle, MessageCircle, Shield, Sparkles, User, BookCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import AIChat from "@/components/AIChat";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWallet } from "@/context/WalletContext";
import SettingsModal from "@/components/SettingsModal";
import { saveApiKey } from "@/lib/localStorage";

interface IndexProps {
  openAIApiKey: string;
  setOpenAIApiKey: (key: string) => void;
}

const Index = ({ openAIApiKey, setOpenAIApiKey }: IndexProps) => {
  const { toast } = useToast();
  const { isConnected, userType } = useWallet();
  const [userRole, setUserRole] = useState<"student" | "sponsor">("student");
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const handleSaveApiKey = (newApiKey: string) => {
    setOpenAIApiKey(newApiKey);
    saveApiKey(newApiKey);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50">
      {/* Navigation */}
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h1 className="text-xl font-bold">MetaMind Fellowship</h1>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/apply" className="text-sm font-medium hover:text-purple-500 transition-colors">
            Apply
          </Link>
          <Link to="/scholarships" className="text-sm font-medium hover:text-purple-500 transition-colors">
            Explore
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-purple-500 transition-colors">
            How it Works
          </Link>
          {isConnected ? (
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/connect">
              <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                Connect Wallet
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 md:px-0">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Decentralized Scholarships for the Digital Age</h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect your MetaMask wallet to apply for scholarships or fund the next generation of innovators.
          </p>
          
          <Tabs 
            defaultValue={userRole} 
            onValueChange={(value) => setUserRole(value as "student" | "sponsor")}
            className="mb-8"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
              <TabsTrigger value="student">I'm a Student</TabsTrigger>
              <TabsTrigger value="sponsor">I'm a Sponsor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student" className="mt-6 space-y-4">
              <h3 className="text-xl font-medium">Apply for grants and scholarships</h3>
              <p className="text-gray-600 mb-6">
                Connect your wallet, create a profile, and find scholarships that match your educational goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/apply">
                  <Button size="lg" className="bg-purple-500 hover:bg-purple-600 w-full sm:w-auto">
                    Apply for Funding <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/connect">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Connect Wallet
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="sponsor" className="mt-6 space-y-4">
              <h3 className="text-xl font-medium">Fund the next generation</h3>
              <p className="text-gray-600 mb-6">
                Create scholarships, set eligibility criteria, and directly fund promising students through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/connect">
                  <Button size="lg" className="bg-purple-500 hover:bg-purple-600 w-full sm:w-auto">
                    Become a Sponsor <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    if (!openAIApiKey) {
                      setShowSettings(true);
                    } else {
                      setShowAIChat(true);
                    }
                  }}
                >
                  Chat with AI Assistant
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto py-20 px-4 md:px-0">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose MetaMind Fellowship</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Shield className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Web3 Integration</h3>
            <p className="text-gray-600">Connect with MetaMask for secure, transparent, and decentralized scholarship management.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <CheckCircle className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">AI-Verified Applications</h3>
            <p className="text-gray-600">Our AI system validates student information to ensure authenticity and trust.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <MessageCircle className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Direct Communication</h3>
            <p className="text-gray-600">Students and sponsors can message directly on our platform for seamless interaction.</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto py-20 px-4 md:px-0 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-600">
              <User className="h-6 w-6" />
              For Students
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-purple-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-700 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Connect Your Wallet</h4>
                  <p className="text-gray-600 text-sm">Link your MetaMask wallet to create your student profile.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-purple-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-700 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Complete Your Profile</h4>
                  <p className="text-gray-600 text-sm">Add your educational details, achievements, and future goals.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-purple-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-700 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Apply for Scholarships</h4>
                  <p className="text-gray-600 text-sm">Browse available grants and submit detailed applications.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-purple-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-700 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Receive Funds Directly</h4>
                  <p className="text-gray-600 text-sm">Approved scholarships are sent directly to your wallet.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-600">
              <BookCheck className="h-6 w-6" />
              For Sponsors
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-700 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Register as a Sponsor</h4>
                  <p className="text-gray-600 text-sm">Connect your MetaMask wallet and create your sponsor profile.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-700 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Create Scholarships</h4>
                  <p className="text-gray-600 text-sm">Define criteria, funding amounts, and application requirements.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-700 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Review Applications</h4>
                  <p className="text-gray-600 text-sm">Evaluate submitted applications and select recipients.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-700 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Fund Recipients</h4>
                  <p className="text-gray-600 text-sm">Send funds directly through the platform with complete transparency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-500 py-16">
        <div className="container mx-auto px-4 md:px-0 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Education Funding?</h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join our platform today and be part of the future of educational grants and scholarships.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => {
              if (!openAIApiKey) {
                setShowSettings(true);
              } else {
                setShowAIChat(true);
              }
            }}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Talk to our AI Assistant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="font-semibold">MetaMind Fellowship</span>
            </div>
            <div className="flex gap-8">
              <Link to="/about" className="text-sm text-gray-500 hover:text-purple-500">About</Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-purple-500">Privacy</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-purple-500">Terms</Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-purple-500">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MetaMind Fellowship. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* AI Chat Dialog */}
      <Dialog open={showAIChat} onOpenChange={setShowAIChat}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Scholarship Assistant
            </DialogTitle>
            <DialogDescription>
              Ask questions about scholarships, applications, or eligibility requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[60vh] overflow-y-auto">
            <AIChat apiKey={openAIApiKey} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Settings Modal for API Key */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={openAIApiKey}
        onSave={handleSaveApiKey}
      />
    </div>
  );
};

export default Index;
