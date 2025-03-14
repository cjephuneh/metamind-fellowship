
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (apiKey: string) => void;
}

const SettingsModal = ({ isOpen, onClose, apiKey, onSave }: SettingsModalProps) => {
  const [inputApiKey, setInputApiKey] = useState(apiKey);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(inputApiKey);
    toast({
      title: "Settings Saved",
      description: "Your API key has been saved successfully.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
          <DialogDescription>
            Configure your AI assistant settings here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              placeholder="sk-..."
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
