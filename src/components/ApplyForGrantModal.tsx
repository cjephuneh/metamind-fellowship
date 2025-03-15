
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";
import { submitApplication } from "@/lib/api";

interface ApplyForGrantModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarship: {
    id: string;
    title: string;
  };
}

const ApplyForGrantModal = ({ isOpen, onClose, scholarship }: ApplyForGrantModalProps) => {
  const { toast } = useToast();
  const { user } = useWallet();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [story, setStory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.address) {
      toast({
        title: "Error",
        description: "You must be logged in to apply for scholarships.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Using user.address as applicantId if user.id is not available
      const applicantId = user.id || user.address;
      
      await submitApplication({
        scholarshipId: scholarship.id,
        scholarshipTitle: scholarship.title,
        applicantId: applicantId,
        story,
        contactEmail: email,
        contactPhone: phone
      });
      
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted!",
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for {scholarship.title}</DialogTitle>
          <DialogDescription>
            Please provide the required information for your scholarship application.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="story">Your Story</Label>
              <Textarea
                id="story"
                placeholder="Tell us why you should receive this scholarship..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                required
                className="min-h-[120px]"
              />
              <p className="text-sm text-muted-foreground">
                Explain how this scholarship will help you achieve your goals.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyForGrantModal;
