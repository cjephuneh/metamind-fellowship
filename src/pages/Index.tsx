
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Wallet, Building2 } from "lucide-react";
import MainNavigation from "@/components/MainNavigation";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <MainNavigation />
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-28 bg-gradient-to-b from-purple-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Education through Blockchain
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              EduChain connects students with sponsors through smart contract scholarships, enabling transparent and direct funding for educational opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/connect">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Connect Wallet
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How EduChain Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Students</h3>
                    <p className="text-gray-600">
                      Apply for blockchain-based scholarships and receive funds directly to your wallet as you complete milestones.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Sponsors</h3>
                    <p className="text-gray-600">
                      Create smart contract scholarships with customizable terms and milestone-based payments for maximum impact.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Smart Contracts</h3>
                    <p className="text-gray-600">
                      Transparent, secure, and automated scholarship disbursement based on predefined achievement milestones.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're a student seeking funding or a sponsor looking to support education, EduChain makes it simple and transparent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/connect">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EduChain</h3>
              <p className="text-gray-400">
                Revolutionizing education financing through blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="/smart-contracts" className="text-gray-400 hover:text-white">Smart Contracts</Link></li>
                <li><Link to="/signin" className="text-gray-400 hover:text-white">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} EduChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
