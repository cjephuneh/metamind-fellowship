
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get user type and wallet address from URL
  const userType = searchParams.get("type") || "student";
  const walletAddress = searchParams.get("address") || "";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    institution: "", // University or Organization
    profileImage: null,
    documents: null, // For students: transcripts, etc. For sponsors: verification docs
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name is required",
        description: "Please enter your full name to continue."
      });
      return false;
    }
    
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Valid email is required",
        description: "Please enter a valid email address."
      });
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, you would send this data to your backend
      console.log("Submitting registration:", {
        ...formData,
        userType,
        walletAddress
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Redirecting to dashboard..."
      });
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 flex flex-col">
      <div className="container mx-auto py-6 px-4">
        <Link to="/connect" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Connect Wallet
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {userType === "student" ? "Student Registration" : "Sponsor Registration"}
            </CardTitle>
            <CardDescription className="text-center">
              {userType === "student" 
                ? "Create your student profile to apply for scholarships" 
                : "Create your sponsor profile to offer scholarships"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="institution">
                        {userType === "student" ? "University/School" : "Organization/Institution"}
                      </Label>
                      <Input
                        id="institution"
                        name="institution"
                        placeholder={userType === "student" ? "Enter your school name" : "Enter your organization name"}
                        value={formData.institution}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="pt-3">
                      <Button 
                        type="button" 
                        onClick={handleNextStep} 
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio / About</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder={userType === "student" 
                          ? "Tell us about yourself, your academic goals and why you're seeking a scholarship..." 
                          : "Tell us about your organization and your mission for providing scholarships..."}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image</Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="profileImage"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                          </div>
                          <Input
                            id="profileImage"
                            name="profileImage"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {formData.profileImage && (
                        <p className="text-xs text-green-600">
                          File selected: {formData.profileImage.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="documents">
                        {userType === "student" ? "Supporting Documents" : "Verification Documents"}
                      </Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="documents"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                          </div>
                          <Input
                            id="documents"
                            name="documents"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {formData.documents && (
                        <p className="text-xs text-green-600">
                          File selected: {formData.documents.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-purple-500 hover:bg-purple-600"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                          </span>
                        ) : "Complete Registration"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-gray-500">
              Connected with wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
