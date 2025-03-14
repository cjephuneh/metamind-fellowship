
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Plus, X } from "lucide-react";

interface ApplyForGrantModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarshipTitle: string;
  scholarshipId: string;
}

const ApplyForGrantModal = ({
  isOpen,
  onClose,
  scholarshipTitle,
  scholarshipId,
}: ApplyForGrantModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [story, setStory] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Application Submitted!",
        description: `Your application for ${scholarshipTitle} has been submitted successfully.`,
      });
      setIsSubmitting(false);
      onClose();
      
      // Reset form
      setStep(1);
      setStory("");
      setFiles([]);
      setContactEmail("");
      setContactPhone("");
    }, 1500);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apply for {scholarshipTitle}</DialogTitle>
          <DialogDescription>
            Complete all steps to submit your application for this scholarship.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full flex-1 mx-1 ${
                i + 1 <= step ? "bg-purple-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tell Your Story</h3>
            <p className="text-sm text-gray-500">
              Share why you deserve this grant and how it will help you achieve your goals.
            </p>
            <Textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="min-h-[200px]"
              placeholder="Tell us your story and why you're a good fit for this scholarship..."
              required
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload Documents</h3>
            <p className="text-sm text-gray-500">
              Upload any supporting documents such as transcripts, recommendation letters, or certificates.
            </p>
            
            <div className="grid gap-4">
              <Label htmlFor="files">Upload Files</Label>
              <div
                className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <FileUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, DOC, DOCX, JPG or PNG (max 10MB each)
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Uploaded Files:</h4>
                  <ul className="divide-y">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="py-2 px-3 flex justify-between items-center text-sm bg-gray-50 rounded-md"
                      >
                        <span className="truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-7 w-7 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <p className="text-sm text-gray-500">
              Provide your contact details so we can reach you about your application.
            </p>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyForGrantModal;
