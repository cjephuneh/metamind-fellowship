
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sparkles, ArrowLeft, Upload, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  institution: z.string().min(2, { message: "Institution is required." }),
  amount: z.string().min(1, { message: "Please enter a requested amount." }),
  projectTitle: z.string().min(5, { message: "Project title is required." }),
  background: z.string().min(50, { message: "Please provide a detailed background (minimum 50 characters)." }),
  goals: z.string().min(50, { message: "Please provide detailed goals (minimum 50 characters)." }),
  timeline: z.string().min(20, { message: "Please provide a timeline." }),
  budget: z.string().min(20, { message: "Please provide a budget breakdown." }),
});

const ApplyForGrant = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState("info");
  const [files, setFiles] = useState<File[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      institution: "",
      amount: "",
      projectTitle: "",
      background: "",
      goals: "",
      timeline: "",
      budget: "",
    },
  });

  React.useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to apply for a grant",
        variant: "destructive",
      });
      navigate("/connect");
    }
  }, [isConnected, navigate, toast]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you would send this data to your backend
    console.log("Form submitted:", values);
    console.log("Files:", files);
    
    toast({
      title: "Application Submitted",
      description: "Your grant application has been successfully submitted!",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-8 px-4 md:px-0">
        <Link to="/" className="inline-flex items-center text-purple-600 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <h1 className="text-3xl font-bold">Grant Application</h1>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Apply for Funding</CardTitle>
              <CardDescription>
                Complete the form below to apply for a grant. Make sure to provide detailed information about your project and upload any relevant documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="info">Personal Information</TabsTrigger>
                  <TabsTrigger value="project">Project Details</TabsTrigger>
                  <TabsTrigger value="docs">Documents</TabsTrigger>
                </TabsList>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TabsContent value="info" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution/Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="University/Organization Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requested Amount (USD)</FormLabel>
                            <FormControl>
                              <Input placeholder="5000" type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter the total amount you are requesting for your project
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          onClick={() => setActiveTab("project")}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          Next: Project Details
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="project" className="space-y-6">
                      <FormField
                        control={form.control}
                        name="projectTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your project title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="background"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background & Project Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your project, its purpose, and why it's important..." 
                                className="min-h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a detailed description of your project, including context and motivation
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="goals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Goals & Outcomes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What are the specific goals of your project and expected outcomes..." 
                                className="min-h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timeline</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Outline your project timeline and key milestones..." 
                                className="min-h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Breakdown</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide a detailed breakdown of how the funds will be used..." 
                                className="min-h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab("info")}
                        >
                          Back: Personal Info
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => setActiveTab("docs")}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          Next: Upload Documents
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="docs" className="space-y-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <h3 className="font-medium mb-1">Upload Supporting Documents</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Drag and drop files, or click to browse. Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 10MB each).
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="mx-auto"
                        >
                          <Paperclip className="mr-2 h-4 w-4" />
                          Browse Files
                        </Button>
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                      
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-medium">Uploaded Files:</h4>
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center">
                                <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between mt-8">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab("project")}
                        >
                          Back: Project Details
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Submit Application
                        </Button>
                      </div>
                    </TabsContent>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyForGrant;
