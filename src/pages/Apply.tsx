
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Apply = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
      
      toast({
        title: "Files Added",
        description: `${fileArray.length} file(s) have been added to your application.`,
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "Your grant application has been submitted successfully!",
    });
    
    // In a real app, you would submit to your backend
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-10 px-4">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Apply for a Grant</h1>
            <p className="text-gray-600">
              Tell us your story and how this grant will help you achieve your educational goals.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((s) => (
                  <div 
                    key={s} 
                    className={`flex items-center justify-center rounded-full h-10 w-10 ${
                      s < step ? "bg-green-500 text-white" : 
                      s === step ? "bg-purple-500 text-white" : 
                      "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                  </div>
                ))}
              </div>
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-purple-500" 
                  style={{ width: `${(step - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Personal Info</span>
              <span>Story</span>
              <span>Documents</span>
              <span>Review</span>
            </div>
          </div>
          
          <Card>
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Tell us about yourself and your educational background.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="First Name" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Last Name" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="institution">Institution/University</Label>
                      <Input id="institution" placeholder="Where you study" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="major">Field of Study/Major</Label>
                      <Input id="major" placeholder="Your major" className="mt-1" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => setStep(2)} className="bg-purple-500 hover:bg-purple-600">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}
            
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Your Story</CardTitle>
                  <CardDescription>
                    Tell us how this grant will help you achieve your educational and professional goals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Application Title</Label>
                      <Input id="title" placeholder="Give your application a title" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="story">Your Story</Label>
                      <Textarea 
                        id="story" 
                        placeholder="Share your story, goals, and how this grant will help you..." 
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="impact">Expected Impact</Label>
                      <Textarea 
                        id="impact" 
                        placeholder="How will this grant impact your education and future career?" 
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <Button onClick={() => setStep(3)} className="bg-purple-500 hover:bg-purple-600">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}
            
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                  <CardDescription>
                    Upload documents to support your application.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop files here, or click to select files
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        (PDF, DOC, DOCX, JPG, PNG files. Max 10MB each)
                      </p>
                      <Input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        id="file-upload" 
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer">
                          Select Files
                        </Button>
                      </label>
                    </div>
                    
                    {files.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Uploaded Files:</h4>
                        <ul className="space-y-2">
                          {files.map((file, index) => (
                            <li key={index} className="flex items-center p-2 bg-gray-50 rounded">
                              <FileText className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-auto">
                                {(file.size / 1024).toFixed(0)} KB
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Any additional information about your documents..." 
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <Button onClick={() => setStep(4)} className="bg-purple-500 hover:bg-purple-600">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}
            
            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Review and Submit</CardTitle>
                  <CardDescription>
                    Review your application before submitting.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Personal Information</h4>
                      <p className="text-sm">John Doe</p>
                      <p className="text-sm">john.doe@example.com</p>
                      <p className="text-sm">Stanford University</p>
                      <p className="text-sm">Computer Science</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Your Story</h4>
                      <p className="text-sm">
                        This grant will help me pursue my research in artificial intelligence...
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Supporting Documents</h4>
                      <ul className="text-sm space-y-1">
                        {files.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <input type="checkbox" id="agree" className="mt-1" />
                      <label htmlFor="agree" className="text-sm text-gray-700">
                        I certify that all the information provided is accurate and true. I understand that providing false information may result in disqualification.
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <Button onClick={handleSubmit} className="bg-purple-500 hover:bg-purple-600">
                    Submit Application
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Apply;
