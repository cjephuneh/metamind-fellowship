
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  DollarSign, 
  FileText, 
  MessageCircle, 
  User, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIAssistant from "@/components/AIAssistant";

// Mock data for demonstration
const mockScholarships = [
  {
    id: "1",
    title: "Tech Innovation Grant",
    sponsor: "Future Tech Foundation",
    sponsorAddress: "0x3a2d3b45C67A98df234B21399E8ee9C",
    amount: 5000,
    deadline: "2023-12-31",
    status: "open",
    description: "For students pursuing degrees in computer science, AI, or related fields with a focus on innovative technology solutions.",
    requirements: "Minimum GPA of 3.5, demonstrated interest in technology innovation through projects or coursework.",
    criteria: "Applications will be evaluated based on academic merit (40%), project portfolio (30%), and personal statement (30%).",
    eligibility: "Open to undergraduate and graduate students enrolled in accredited universities worldwide.",
    applicationProcess: "Complete the online application form, upload your academic transcripts, provide links to your technology projects, and submit a 500-word personal statement.",
    details: "This scholarship aims to support the next generation of technology innovators. Recipients will also have the opportunity to participate in our annual Tech Summit and network with industry leaders."
  },
  {
    id: "2",
    title: "Women in STEM Scholarship",
    sponsor: "Diversity in Tech Alliance",
    sponsorAddress: "0x8b34c91A53D7e4eC45C67Ae1234c5d6",
    amount: 7500,
    deadline: "2023-11-15",
    status: "open",
    description: "Supporting women pursuing education in Science, Technology, Engineering and Mathematics to increase diversity in these fields.",
    requirements: "Open to female-identifying students in accredited STEM programs with a passion for advancing gender equality in technology.",
    criteria: "Selection based on academic achievement (30%), leadership potential (30%), commitment to supporting women in STEM (20%), and financial need (20%).",
    eligibility: "Open to female-identifying students enrolled in STEM programs at accredited universities. Both undergraduate and graduate students may apply.",
    applicationProcess: "Submit your application form, academic transcripts, two letters of recommendation, and a 750-word essay on your vision for increasing gender diversity in your field.",
    details: "Recipients will be paired with industry mentors and invited to participate in our Women in Tech Leadership program."
  }
];

const ScholarshipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showAssistant, setShowAssistant] = useState(false);
  
  // In a real application, you would fetch this data from an API
  const scholarship = mockScholarships.find(s => s.id === id);
  
  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Scholarship Not Found</h1>
          <p className="text-gray-600 mb-6">The scholarship you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleApply = () => {
    toast({
      title: "Application Started",
      description: `You've started an application for ${scholarship.title}`,
    });
    // In a real app, you would redirect to an application form
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold">{scholarship.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    scholarship.status === "open" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {scholarship.status === "open" ? "Open" : "Closed"}
                  </span>
                </div>
                <p className="text-gray-700 mb-6">{scholarship.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Amount: ${scholarship.amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Deadline: {formatDate(scholarship.deadline)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Sponsor: {scholarship.sponsor}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <FileText className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Applications: Open</span>
                  </div>
                </div>
                
                {scholarship.status === "open" && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-purple-500 hover:bg-purple-600"
                      onClick={handleApply}
                    >
                      Apply Now
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Message Sent",
                          description: "Your message has been sent to the scholarship sponsor."
                        });
                      }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message Sponsor
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowAssistant(!showAssistant)}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Assistant
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm">
              <Tabs defaultValue="details">
                <div className="px-6 pt-6">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="process">Process</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="details" className="p-6">
                  <h2 className="text-lg font-semibold mb-3">Scholarship Details</h2>
                  <p className="text-gray-700 mb-4">{scholarship.details}</p>
                  
                  <h3 className="text-md font-semibold mb-2">Selection Criteria</h3>
                  <p className="text-gray-700">{scholarship.criteria}</p>
                </TabsContent>
                
                <TabsContent value="eligibility" className="p-6">
                  <h2 className="text-lg font-semibold mb-3">Eligibility Criteria</h2>
                  <p className="text-gray-700 mb-4">{scholarship.eligibility}</p>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-md font-semibold mb-2">Who Should Apply</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Students enrolled in accredited institutions</li>
                      <li>Individuals demonstrating academic excellence</li>
                      <li>Those meeting specific scholarship requirements</li>
                      <li>Candidates with a passion for the field</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="requirements" className="p-6">
                  <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                  <p className="text-gray-700 mb-4">{scholarship.requirements}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium">Academic Transcripts</h3>
                        <p className="text-gray-600 text-sm">Official transcripts from your current institution</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium">Personal Statement</h3>
                        <p className="text-gray-600 text-sm">Essay explaining your goals and why you deserve this scholarship</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium">Letters of Recommendation</h3>
                        <p className="text-gray-600 text-sm">Two letters from academic or professional references</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium">Proof of Enrollment</h3>
                        <p className="text-gray-600 text-sm">Documentation confirming your enrollment status</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="process" className="p-6">
                  <h2 className="text-lg font-semibold mb-3">Application Process</h2>
                  <p className="text-gray-700 mb-4">{scholarship.applicationProcess}</p>
                  
                  <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-6 py-2">
                    <div className="relative">
                      <div className="absolute -left-10 top-1 flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full border-2 border-white">
                        <span className="text-xs font-bold text-purple-600">1</span>
                      </div>
                      <h3 className="text-md font-medium">Create Profile</h3>
                      <p className="text-gray-600 text-sm">Complete your student profile with all required information</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 top-1 flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full border-2 border-white">
                        <span className="text-xs font-bold text-purple-600">2</span>
                      </div>
                      <h3 className="text-md font-medium">Submit Application</h3>
                      <p className="text-gray-600 text-sm">Fill out the application form and upload all required documents</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 top-1 flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full border-2 border-white">
                        <span className="text-xs font-bold text-purple-600">3</span>
                      </div>
                      <h3 className="text-md font-medium">Verification Process</h3>
                      <p className="text-gray-600 text-sm">Our AI system verifies your information and eligibility</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 top-1 flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full border-2 border-white">
                        <span className="text-xs font-bold text-purple-600">4</span>
                      </div>
                      <h3 className="text-md font-medium">Review by Sponsor</h3>
                      <p className="text-gray-600 text-sm">The scholarship sponsor reviews eligible applications</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 top-1 flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full border-2 border-white">
                        <span className="text-xs font-bold text-purple-600">5</span>
                      </div>
                      <h3 className="text-md font-medium">Decision Notification</h3>
                      <p className="text-gray-600 text-sm">You'll be notified of the decision via email and in-platform message</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            {showAssistant ? (
              <AIAssistant 
                context={`${scholarship.title} scholarship application`}
                onClose={() => setShowAssistant(false)}
              />
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">About the Sponsor</h2>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{scholarship.sponsor}</h3>
                      <p className="text-sm text-gray-500">Verified Sponsor</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    A leading organization dedicated to supporting education and innovation in technology fields.
                  </p>
                  <div className="text-xs font-mono text-gray-500 mb-4 overflow-hidden text-ellipsis">
                    Wallet: {scholarship.sponsorAddress}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Sponsor
                  </Button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Important Dates</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Application Deadline</span>
                      <span className="text-sm text-gray-600">{formatDate(scholarship.deadline)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Review Period</span>
                      <span className="text-sm text-gray-600">2 weeks after deadline</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Decision Date</span>
                      <span className="text-sm text-gray-600">Within 30 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Fund Disbursement</span>
                      <span className="text-sm text-gray-600">Upon selection</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetail;
