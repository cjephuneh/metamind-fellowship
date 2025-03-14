
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, BookOpen, CheckCircle, MessageCircle, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50">
      {/* Navigation */}
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h1 className="text-xl font-bold">MetaMind Fellowship</h1>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/scholarships" className="text-sm font-medium hover:text-purple-500 transition-colors">
            Explore
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-purple-500 transition-colors">
            How it Works
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Dashboard
            </Button>
          </Link>
          <Link to="/connect">
            <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
              Connect Wallet
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 md:px-0">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Decentralized Scholarships for the Digital Age</h1>
          <p className="text-xl text-gray-600 mb-10">
            Connect your MetaMask wallet to apply for scholarships or fund the next generation of innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button size="lg" className="bg-purple-500 hover:bg-purple-600 w-full sm:w-auto">
                Apply for Funding <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/sponsor">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Become a Sponsor
              </Button>
            </Link>
          </div>
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
              toast({
                title: "Coming Soon!",
                description: "Our AI assistant will be available to help with your application soon.",
              });
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
    </div>
  );
};

export default Index;
